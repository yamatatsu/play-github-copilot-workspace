import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Cards from "@cloudscape-design/components/cards";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { apiClient } from "../api/apiClient";

export const Route = createFileRoute("/todos")({
	component: Component,
});

const items = [
	{
		name: "Item 1",
		alt: "First",
		description: "This is the first item",
		type: "1A",
		size: "Small",
	},
	{
		name: "Item 2",
		alt: "Second",
		description: "This is the second item",
		type: "1B",
		size: "Large",
	},
	{
		name: "Item 3",
		alt: "Third",
		description: "This is the third item",
		type: "1A",
		size: "Large",
	},
	{
		name: "Item 4",
		alt: "Fourth",
		description: "This is the fourth item",
		type: "2A",
		size: "Small",
	},
	{
		name: "Item 5",
		alt: "Fifth",
		description: "This is the fifth item",
		type: "2A",
		size: "Large",
	},
	{
		name: "Item 6",
		alt: "Sixth",
		description: "This is the sixth item",
		type: "1A",
		size: "Small",
	},
];

function Component() {
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
						{item.name}
					</Link>
				),
				sections: [
					{
						id: "description",
						header: "Description",
						content: (item) => item.description,
					},
					{
						id: "type",
						header: "Type",
						content: (item) => item.type,
					},
					{
						id: "size",
						header: "Size",
						content: (item) => item.size,
					},
				],
			}}
			visibleSections={["description", "type", "size"]}
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
			items={items}
		/>
	);
}
