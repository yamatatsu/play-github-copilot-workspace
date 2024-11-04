import { prisma } from "@/db";
import { createRoute, z } from "@hono/zod-openapi";
import { openapiRoute } from "../_shared/openapiRoute";
import { taskSchema } from "../_shared/schema";
export default openapiRoute().openapi(
	createRoute({
		method: "get",
		path: "/tasks",
		summary: "Fetch tasks",
		tags: ["tasks"],
		request: {
			headers: z.object({
				authorization: z.string(),
			}),
		},
		responses: {
			200: {
				description: "Success to fetch the tasks",
				content: {
					"application/json": {
						schema: z.array(taskSchema),
					},
				},
			},
		},
	}),
	async (c) => {
		const tasks = await prisma.task.findMany();
		return c.json(tasks, 200);
	},
);
