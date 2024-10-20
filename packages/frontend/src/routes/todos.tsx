import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/todos")({
	component: () => <div>Hello /todos!</div>,
});
