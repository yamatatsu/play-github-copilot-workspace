import type { Hook } from "@hono/zod-validator";

export const jsonHook: Hook<unknown, object, string> = (result, c) => {
	if (!result.success) {
		return c.json(
			{
				code: "schema_validation_failed",
				message: "Bad Request",
				errors: result.error.flatten(),
			},
			400,
		);
	}
};

export const paramHook: Hook<unknown, object, string> = (result, c) => {
	if (!result.success) {
		return c.json(
			{
				code: "schema_validation_failed",
				message: "Not Found",
				errors: result.error.flatten(),
			},
			404,
		);
	}
};
