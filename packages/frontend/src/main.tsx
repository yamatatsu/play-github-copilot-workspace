import "@aws-amplify/ui-react/styles.css";
import "@cloudscape-design/global-styles/index.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Amplify } from "aws-amplify";
import React from "react";
import { createRoot } from "react-dom/client";
import outputs from "../amplify_outputs.json";
import { routeTree } from "./routeTree.gen";

Amplify.configure(outputs);

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
		<Authenticator hideSignUp>
			<RouterProvider router={router} />
		</Authenticator>
	</React.StrictMode>,
);
