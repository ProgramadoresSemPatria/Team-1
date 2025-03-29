import axiosInstance from "@/axios";

export const uploadInputCsv = async (formData: FormData) => {
	const response = await axiosInstance.post("/search/input", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	const data = response.data;

	return { data };
};
