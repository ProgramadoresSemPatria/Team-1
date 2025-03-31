import { createSession } from "@/services/create-session";
import { createUser } from "@/services/create-user";
import { AuthContext } from "@/context/AuthContext";
import type { loginPayload } from "@/types/login";
import type { registerPayload } from "@/types/register";
import { projectConstants } from "@/utils/constants";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthContext = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("SomeComponent must be used within an AuthProvider");
	}

	const { isLogged, setIsLogged, setUser, user } = context;

	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [isRegisterLoading, setIsRegisterLoading] = useState(false);

	const navigate = useNavigate();

	const login = async ({ email, password }: loginPayload) => {
		setIsLoginLoading(true);
		try {
			const res = await createSession({ email, password });

			localStorage.setItem(projectConstants.accessToken, res.data.access_token);
			setIsLogged(true);
			setUser(res.data.user);

			navigate("/upload");
		} catch (error) {
			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 404:
						toast.error("Invalid credentials");
						break;
					case 422:
						toast.error("Email or password is required");
						break;
					default:
						toast.error(
							error.response?.data?.message || "Internal server error",
						);
						break;
				}
			}
		} finally {
			setIsLoginLoading(false);
		}
	};

	const register = async ({
		cnpj,
		company_name,
		company_type,
		cpf,
		email,
		name,
		password,
		username,
	}: registerPayload) => {
		setIsRegisterLoading(true);
		try {
			await createUser({
				cnpj,
				company_name,
				company_type,
				cpf,
				email,
				name,
				password,
				username,
			});

			toast.success("User created successfully");
			navigate("/login");
		} catch (error) {
			if (error instanceof AxiosError) {
				switch (error.response?.status) {
					case 400:
						toast.error("User already exists");
						break;
					case 422:
						toast.error("All fields are required");
						break;
					default:
						toast.error(
							error.response?.data?.message || "Internal server error",
						);
						break;
				}
			}
		} finally {
			setIsRegisterLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem(projectConstants.accessToken);
		localStorage.removeItem(projectConstants.user);
		setIsLogged(false);
		setUser(null);
	};

	return {
		isLogged,
		register,
		logout,
		login,
		isLoginLoading,
		isRegisterLoading,
		user,
	};
};

export default useAuthContext;
