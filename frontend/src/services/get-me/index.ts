import axiosInstance from "@/axios";

export const getMe = async () => {
	const response = await axiosInstance.get("users/me");
    
    const data = response.data;

	return {
        data
    };
};
