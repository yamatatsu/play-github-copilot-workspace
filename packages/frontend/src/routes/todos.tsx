import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Cards from "@cloudscape-design/components/cards";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { apiClient } from "../api/apiClient";

export const Route = createFileRoute("/todos")({
	component: Component,
});

function Component() {
	const { data: todos, isLoading } = useQuery({
		queryKey: ["api", "todos"],
		queryFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			return apiClient.todos.$get({
				header: { authorization: `Bearer ${idToken}` },
			});
		},
	});

	// TODO: refactor as moving to a shared file
	const todoPostMutation = useMutation({
		mutationFn: async () => {
			const session = await fetchAuthSession();
			const idToken = session.tokens?.idToken?.toString();

			return apiClient.todos.$post({
				// TODO: set title from input
				json: { title: "" },
				header: { authorization: `Bearer ${idToken}` },
			});
		},
	});

	return (
		<Cards
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
			cardDefinition={{
				header: (item) => (
					<Link href="#" fontSize="heading-m">
						{item.title}
					</Link>
				),
				sections: [
					{
						id: "description",
						header: "Description",
						content: (item) => item.content,
					},
					{
						id: "done",
						header: "Done",
						content: (item) => (item.done ? "Yes" : "No"),
					},
				],
			}}
			visibleSections={["description", "done"]}
			cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
			loadingText="Loading resources"
			empty={
					<Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
						<SpaceBetween size="m">
							<b>No resources</b>
							<Button>Create resource</Button>
						</SpaceBetween>
					</Box>
				}
			items={todos || []}
			loading={isLoading}
		/>
	);
}
