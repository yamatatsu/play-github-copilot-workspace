import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Table from "@cloudscape-design/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { apiClient } from "../api/apiClient";

export const Route = createFileRoute("/todos")({
	component: Component,
});

function Component() {
	const queryClient = useQueryClient();

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

	// TODO: refactor as moving to a shared file
	const todoPostMutation = useMutation({
		mutationFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			const res = await apiClient.todos.$post({
				// TODO: set title from input
				json: { title: "Test Task" },
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
		},
	});

	return (
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
							<Button
								variant="primary"
								onClick={() => {
									todoPostMutation.mutate();
								}}
							>
								Create New TODO
							</Button>
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
			/>
	);
}
