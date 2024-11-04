import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";
import { apiClient } from "../api/apiClient";

export const Route = createFileRoute("/tasks")({
	component: Component,
});

type Item = {
	id: number;
	title: string;
	content: string;
	done: boolean;
};

function Component() {
	const queryClient = useQueryClient();
	const [selectedTask, setSelectedTask] = useState<Item | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskContent, setNewTaskContent] = useState("");

	const { data: tasks, isLoading } = useQuery({
		queryKey: ["api", "tasks"],
		queryFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();
			const res = await apiClient.tasks.$get({
				header: { authorization: `Bearer ${idToken}` },
			});
			return res.json();
		},
	});

	const taskPostMutation = useMutation({
		mutationFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			const res = await apiClient.tasks.$post({
				json: { title: newTaskTitle, content: newTaskContent },
				header: { authorization: `Bearer ${idToken}` },
			});

			if (res.status === 400) {
				const { message } = await res.json();
				throw new Error(message);
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "tasks"] });
			setIsModalVisible(false);
			setNewTaskTitle("");
			setNewTaskContent("");
		},
	});

	const taskDeleteMutation = useMutation({
		mutationFn: async (taskId: number) => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			const res = await apiClient.tasks[":taskId"].$delete({
				param: { taskId: taskId.toString() },
				header: { authorization: `Bearer ${idToken}` },
			});

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "tasks"] });
			setSelectedTask(null);
		},
	});

	return (
		<>
			<Table
				columnDefinitions={[
					{
						id: "title",
						header: "Title",
						cell: (item) => item.title,
					},
					{
						id: "description",
						header: "Description",
						cell: (item) => item.content,
					},
					{
						id: "done",
						header: "Done",
						cell: (item) => (item.done ? "Yes" : "No"),
					},
				]}
				items={tasks || []}
				loading={isLoading}
				loadingText="Loading resources"
				header={
					<Header
						actions={
							<SpaceBetween direction="horizontal" size="xs">
								<Button
									variant="normal"
									disabled={!selectedTask}
									onClick={() => {
										if (!selectedTask) {
											return;
										}
										taskDeleteMutation.mutate(selectedTask.id);
									}}
								>
									delete
								</Button>
								<Button
									variant="primary"
									onClick={() => {
										setIsModalVisible(true);
									}}
								>
									create
								</Button>
							</SpaceBetween>
						}
					>
						Tasks
					</Header>
				}
				empty={
					<Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
						<SpaceBetween size="m">
							<b>No resources</b>
							<Button
								onClick={() => {
									setIsModalVisible(true);
								}}
							>
								create
							</Button>
						</SpaceBetween>
					</Box>
				}
				selectionType="single"
				selectedItems={selectedTask ? [selectedTask] : []}
				onSelectionChange={({ detail }) =>
					setSelectedTask(detail.selectedItems[0])
				}
			/>
			<Modal
				onDismiss={() => setIsModalVisible(false)}
				visible={isModalVisible}
				header="Create Task"
				footer={
					<SpaceBetween direction="horizontal" size="xs">
						<Button variant="link" onClick={() => setIsModalVisible(false)}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								taskPostMutation.mutate();
							}}
						>
							Submit
						</Button>
					</SpaceBetween>
				}
			>
				<SpaceBetween size="m">
					<Input
						value={newTaskTitle}
						onChange={(event) => setNewTaskTitle(event.detail.value)}
						placeholder="Enter Task title"
					/>
					<Input
						value={newTaskContent}
						onChange={(event) => setNewTaskContent(event.detail.value)}
						placeholder="Enter Task content"
					/>
				</SpaceBetween>
			</Modal>
		</>
	);
}
