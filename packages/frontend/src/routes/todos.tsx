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

export const Route = createFileRoute("/todos")({
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
	const [selectedTodo, setSelectedTodo] = useState<Item | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [newTodoContent, setNewTodoContent] = useState(""); // P62f4

	const { data: todos, isLoading } = useQuery({
		queryKey: ["api", "todos"],
		queryFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();
			const res = await apiClient.todos.$get({
				header: { authorization: `Bearer ${idToken}` },
			});
			return res.json();
		},
	});

	const todoPostMutation = useMutation({
		mutationFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			const res = await apiClient.todos.$post({
				json: { title: newTodoTitle, content: newTodoContent }, // Pc374
				header: { authorization: `Bearer ${idToken}` },
			});

			if (res.status === 400) {
				const { message } = await res.json();
				throw new Error(message);
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "todos"] });
			setIsModalVisible(false);
			setNewTodoTitle("");
			setNewTodoContent(""); // P4be3
		},
	});

	const todoDeleteMutation = useMutation({
		mutationFn: async (todoId: number) => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			const res = await apiClient.todos[":todoId"].$delete({
				param: { todoId: todoId.toString() },
				header: { authorization: `Bearer ${idToken}` },
			});

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api", "todos"] });
			setSelectedTodo(null);
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
				items={todos || []}
				loading={isLoading}
				loadingText="Loading resources"
				header={
					<Header
						actions={
							<SpaceBetween direction="horizontal" size="xs">
								<Button
									variant="normal"
									disabled={!selectedTodo}
									onClick={() => {
										if (!selectedTodo) {
											return;
										}
										todoDeleteMutation.mutate(selectedTodo.id);
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
						TODOs
					</Header>
				}
				empty={
					<Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
						<SpaceBetween size="m">
							<b>No resources</b>
							<Button>Create resource</Button>
						</SpaceBetween>
					</Box>
				}
				selectionType="single"
				selectedItems={selectedTodo ? [selectedTodo] : []}
				onSelectionChange={({ detail }) =>
					setSelectedTodo(detail.selectedItems[0])
				}
			/>
			<Modal
				onDismiss={() => setIsModalVisible(false)}
				visible={isModalVisible}
				header="Create TODO"
				footer={
					<SpaceBetween direction="horizontal" size="xs">
						<Button variant="link" onClick={() => setIsModalVisible(false)}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								todoPostMutation.mutate();
							}}
						>
							Submit
						</Button>
					</SpaceBetween>
				}
			>
				<SpaceBetween size="m">
					<Input
						value={newTodoTitle}
						onChange={(event) => setNewTodoTitle(event.detail.value)}
						placeholder="Enter TODO title"
					/>
					<Input
						value={newTodoContent} // Pee25
						onChange={(event) => setNewTodoContent(event.detail.value)} // Pee25
						placeholder="Enter TODO content" // Pee25
					/>
				</SpaceBetween>
			</Modal>
		</>
	);
}
