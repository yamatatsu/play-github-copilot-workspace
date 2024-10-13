import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	loader: async () => {
		return redirect({ to: "/home" });
	},
});
