import "@aws-amplify/ui-react/styles.css";
import "@cloudscape-design/global-styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Amplify } from "aws-amplify";
import React from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: import.meta.env.VITE_USER_POOL_ID,
			userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
		},
	},
});

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const container = document.getElementById("root");
if (!container) {
	throw new Error("No container found");
}
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>,
);
