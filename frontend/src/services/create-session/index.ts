import axiosInstance from "@/axios";
import type { loginPayload } from "@/types/login";

export const createSession = async ({ email, password }: loginPayload) => {
	const response = await axiosInstance.post("/auth/login", {
		email,
		password,
	});
	const data = response.data;

	return {
		data,
	};
};
