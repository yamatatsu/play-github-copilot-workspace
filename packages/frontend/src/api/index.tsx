import { fetchAuthSession } from "aws-amplify/auth";
import { apiClient } from "./apiClient";

export async function listTasks() {
	const authHeader = await getAuthHeader();

	const res = await apiClient.tasks.$get({
		header: authHeader,
	});
	return res.json();
}

export async function postTask(props: { title: string; content: string }) {
	const authHeader = await getAuthHeader();

	const res = await apiClient.tasks.$post({
		header: authHeader,
		json: { title: props.title, content: props.content },
	});

	return res.json();
}

export async function deleteTask(taskId: string) {
	const authHeader = await getAuthHeader();

	const res = await apiClient.tasks[":taskId"].$delete({
		header: authHeader,
		param: { taskId },
	});

	return res.json();
}

export async function updateTask(
	taskId: string,
	title: string,
	content: string,
	done: boolean,
) {
	const authHeader = await getAuthHeader();

	const res = await apiClient.tasks[":taskId"].$put({
		header: authHeader,
		param: { taskId },
		json: { title, content, done },
	});

	return res.json();
}

async function getAuthHeader() {
	const session = await fetchAuthSession();
	const idToken = session.tokens?.idToken?.toString();
	return { authorization: `Bearer ${idToken}` };
}
