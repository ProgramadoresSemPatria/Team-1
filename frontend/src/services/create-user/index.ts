import axiosInstance from "@/axios";
import type { registerPayload } from "@/types/register";

export const createUser = async ({
	cnpj,
	company_name,
	company_type,
	cpf,
	email,
	name,
	password,
	username,
}: registerPayload) => {
	const response = await axiosInstance.post("/users", {
		cnpj,
		company_name,
		company_type,
		cpf,
		email,
		name,
		password,
		username,
	});
	const data = response.data;

	return {
		data,
	};
};
