import { logger } from "@/utils/logger";
import { logger as honoLogger } from "hono/logger";

export default honoLogger((str: string, ...rest: string[]) => {
	logger.info(str, ...rest);
});
