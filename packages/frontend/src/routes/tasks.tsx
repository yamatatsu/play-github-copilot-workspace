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
import { deleteTask, listTasks, postTask, updateTask } from "../api";

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
	const [taskTitle, setTaskTitle] = useState("");
	const [taskContent, setTaskContent] = useState("");

	const { data: tasks, isLoading } = useQuery({
		queryKey: ["api", "tasks"],
		queryFn: listTasks,
	});

	const taskPostMutation = useMutation({
		mutationFn: async () => {
			return postTask({ title: taskTitle, content: taskContent });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "tasks"] });
			setIsModalVisible(false);
			setTaskTitle("");
			setTaskContent("");
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

	const taskUpdateMutation = useMutation({
		mutationFn: async ({
			taskId,
			title,
			content,
			done,
		}: { taskId: number; title: string; content: string; done: boolean }) => {
			return updateTask(taskId.toString(), title, content, done);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "tasks"] });
			setTaskTitle("");
			setTaskContent("");
			setIsModalVisible(false);
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
									taskUpdateMutation.mutate({
										taskId: item.id,
										title: item.title,
										content: item.content,
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
										setTaskTitle("");
										setTaskContent("");
									}}
								>
									create
								</Button>
								<Button
									variant="normal"
									disabled={!selectedTask}
									onClick={() => {
										if (!selectedTask) {
											return;
										}
										setTaskTitle(selectedTask.title);
										setTaskContent(selectedTask.content);
										setIsModalVisible(true);
									}}
								>
									edit
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
									setTaskTitle("");
									setTaskContent("");
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
				header={selectedTask ? "Edit Task" : "Create Task"}
				footer={
					<SpaceBetween direction="horizontal" size="xs">
						<Button variant="link" onClick={() => setIsModalVisible(false)}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								if (selectedTask) {
									taskUpdateMutation.mutate({
										taskId: selectedTask.id,
										title: taskTitle,
										content: taskContent,
										done: selectedTask.done,
									});
								} else {
									taskPostMutation.mutate();
								}
							}}
						>
							Submit
						</Button>
					</SpaceBetween>
				}
			>
				<SpaceBetween size="m">
					<Input
						value={taskTitle}
						onChange={(event) => setTaskTitle(event.detail.value)}
						placeholder="Enter Task title"
					/>
					<Input
						value={taskContent}
						onChange={(event) => setTaskContent(event.detail.value)}
						placeholder="Enter Task content"
					/>
				</SpaceBetween>
			</Modal>
		</>
	);
}
