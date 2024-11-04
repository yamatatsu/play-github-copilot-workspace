import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const authorizationHeaderValidator = () =>
	headerValidator(
		z.object({
			authorization: z.string(),
		}),
	);

export const headerValidator = <T extends z.ZodType>(schema: T) =>
	zValidator("header", schema, (result, c) => {
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
	});

export const paramValidator = <T extends z.ZodType>(schema: T) =>
	zValidator("param", schema, (result, c) => {
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
	});

export const jsonValidator = <T extends z.ZodType>(schema: T) =>
	zValidator("json", schema, (result, c) => {
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
	});
