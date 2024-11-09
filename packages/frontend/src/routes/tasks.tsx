import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { deleteTask, listTasks, postTask, updateTaskDone } from "../api";

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
		queryFn: listTasks,
	});

	const taskPostMutation = useMutation({
		mutationFn: async () => {
			return postTask({ title: newTaskTitle, content: newTaskContent });
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
			return deleteTask(taskId.toString());
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "tasks"] });
			setSelectedTask(null);
		},
	});

	const taskUpdateDoneMutation = useMutation({
		mutationFn: async ({ taskId, done }: { taskId: number; done: boolean }) => {
			return updateTaskDone(taskId.toString(), done);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "tasks"] });
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
						cell: (item) => (
							<input
								type="checkbox"
								checked={item.done}
								onChange={(e) => {
									taskUpdateDoneMutation.mutate({
										taskId: item.id,
										done: e.target.checked,
									});
								}}
							/>
						),
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
