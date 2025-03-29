import { uploadInputCsv } from "@/services/upload-input-csv";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const processFile = async (file: File) => {
	const formData = new FormData();
	formData.append("file", file);
	
	return await uploadInputCsv(formData);
};

export const useProcessCsv = () => {
	const navigate = useNavigate()

	const useProcessFile = () => {
		return useMutation({
			mutationFn: processFile,
		});
		// return useMutation({
		// 	mutationFn: async (file: File) => {
		// 		await new Promise(resolve => setTimeout(resolve, 5000)); 
		// 		return processFile(file);
		// 	},
		// }); if you want to simulate a delay
	};

	const handleDragOver = (
		e: React.DragEvent,
		setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
	) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (
		setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
	) => {
		setIsDragging(false);
	};

	const handleDrop = (
		e: React.DragEvent,
		setFile: React.Dispatch<React.SetStateAction<File | null>>,
		setError: React.Dispatch<React.SetStateAction<string | null>>,
		setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
	) => {
		e.preventDefault();
		setIsDragging(false);

		const droppedFile = e.dataTransfer.files[0];

		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		if (droppedFile && droppedFile.name.endsWith(".csv")) {
			setFile(droppedFile);
			setError(null);
		} else {
			setError("Please, select a CSV file.");
		}
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setFile: React.Dispatch<React.SetStateAction<File | null>>,
		setError: React.Dispatch<React.SetStateAction<string | null>>,
	) => {
		const selectedFile = e.target.files?.[0];

		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		if (selectedFile && selectedFile.name.endsWith(".csv")) {
			setFile(selectedFile);
			setError(null);
		} else {
			setError("Please, select a CSV file.");
		}
	};

	const handleResetUpload = (
		setFile: React.Dispatch<React.SetStateAction<File | null>>, 
		reset: ReturnType<typeof useMutation>["reset"]
	) => {
		setFile(null);
		reset();
	};

	const handleViewInsights = () => {
		navigate("/analytics");
	}

	return {
		useProcessFile,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleFileChange,
		handleResetUpload,
		handleViewInsights
	};
};
