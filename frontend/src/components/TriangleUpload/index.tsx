import { cn } from "@/lib/utils";
import { BarChart2, FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useProcessCsv } from "@/hooks/useProcessCsv";
import { AxiosError } from "axios";
import { useCsvAnalyzeStore } from "@/store/useCsvAnalyzeStore";
import type { Feedback } from "@/types/feedback";

const TriangleUpload = () => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		useProcessFile,
		handleDragLeave,
		handleDragOver,
		handleDrop,
		handleFileChange,
		handleResetUpload,
		handleViewInsights,
	} = useProcessCsv();

	const {
		mutate,
		data,
		isLoading: y,
		error: processCsvError,
		reset,
		isSuccess,
	} = useProcessFile();

	const { addFeedback, clearFeedbacks } = useCsvAnalyzeStore();

	const handleUpload = async (file: File) => {
		clearFeedbacks();
		mutate(file);
	};

	useEffect(() => {
		if (data?.data.sample) {
			// biome-ignore lint/complexity/noForEach:
			data.data.sample.forEach((item: Feedback) => addFeedback(item));
		}
	}, [data, addFeedback]);

	return (
		<div className="relative flex justify-center items-center h-full">
			<div
				className={cn(
					"absolute w-[600px] h-[600px] rounded-full transition-all duration-300",
					y
						? "animate-[spin_3s_linear_infinite] border-gradient-outer"
						: "border-[15px] border-gray-300 opacity-50",
					isSuccess && "border-green-500",
					(processCsvError as string) && "border-red-500",
				)}
			/>

			<div
				className={cn(
					"absolute w-[500px] h-[500px] rounded-full transition-all duration-300",
					y
						? "animate-[spin_3s_linear_infinite] border-gradient-inner"
						: "border-[30px] border-gray-400 opacity-60",
					isSuccess && "border-green-500",
					(processCsvError as string) && "border-red-500",
				)}
			/>
			<div
				className={cn(
					"w-[500px] h-[420px] relative transition-all duration-500",
				)}
			>
				{/* biome-ignore lint: */}
				<div
					className={cn(
						"absolute w-0 h-0 left-1/2 -translate-x-1/2",
						"border-l-[225px] border-r-[225px] border-b-[390px]",
						"border-l-transparent border-r-transparent",
						isSuccess ? "border-b-green-500" : "border-b-black",
						(processCsvError as string) && "border-b-red-500",
					)}
				></div>

				{/* biome-ignore lint: */}
				<div
					className="absolute w-0 h-0 left-1/2 -translate-x-1/2 top-[40px]
                      border-l-[185px] border-r-[185px] border-b-[320px]
                      border-l-transparent border-r-transparent border-b-white"
				></div>

				<div
					className="absolute inset-0 flex items-center justify-center"
					style={{ transform: "translateY(40px)" }}
				>
					{/* biome-ignore lint: */}
					<div
						className={cn(
							"w-[300px] h-[200px] flex flex-col items-center justify-center p-4 text-center",
							isDragging ? "bg-blue-50 bg-opacity-50 rounded-lg" : "",
							y && "animate-[spin_3s_linear_infinite]",
						)}
						onDragOver={(e) => handleDragOver(e, setIsDragging)}
						onDragLeave={() => handleDragLeave(setIsDragging)}
						onDrop={(e) => handleDrop(e, setFile, setError, setIsDragging)}
						onClick={() => !file && !isSuccess && fileInputRef.current?.click()}
					>
						{!file && !isSuccess && (
							<>
								<h2 className="text-3xl font-bold text-black mb-4">FeedAI</h2>
								<Upload className="w-10 h-10 text-black mb-3" />
								<p className="text-black font-semibold mb-1">
									Drag & Drop your CSV file here
								</p>
								<p className="text-sm text-gray-700">
									or click to select a file
								</p>
								<input
									ref={fileInputRef}
									type="file"
									accept=".csv"
									className="hidden"
									onChange={(e) => handleFileChange(e, setFile, setError)}
								/>
							</>
						)}

						{file && !y && !isSuccess && (
							<>
								<h2 className="text-3xl font-bold text-black mb-3">FeedAI</h2>
								<div className="flex items-center gap-2 mb-3">
									<FileText className="w-5 h-5 text-black" />
									<span className="font-medium text-gray-700 truncate max-w-[180px]">
										{file.name}
									</span>
								</div>
								<Button
									className="bg-blue-600 hover:bg-blue-700 mb-2"
									onClick={() => handleUpload(file)}
								>
									Generate Insights
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleResetUpload(setFile, reset)}
								>
									Other File
								</Button>
							</>
						)}

						{y && (
							<>
								<h2 className="text-3xl font-bold text-black mb-3">FeedAI</h2>
								<BarChart2 className="w-10 h-10 text-black mb-3 animate-pulse" />
								<p className="text-black">Processing data...</p>
								<p className="text-sm text-black mt-1">
									Generating insights with AI
								</p>
							</>
						)}

						{isSuccess && (
							<>
								<h2 className="text-3xl font-bold text-black mb-3">FeedAI</h2>
								<p className="text-green-700 mb-3">Analysis Completed!</p>
								<Button
									className="bg-blue-600 hover:bg-blue-700 mb-2"
									onClick={() => {
										handleViewInsights();
									}}
								>
									View Insights
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleResetUpload(setFile, reset)}
								>
									New file
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
			{(processCsvError as string) && (
				<div className="absolute -bottom-4 bg-red-50 text-red-700 p-3 rounded-lg max-w-md text-center">
					{processCsvError instanceof AxiosError
						? processCsvError.message === "Network Error"
							? "Processing Error"
							: processCsvError.response?.data?.message
						: "Processing Error"}
				</div>
			)}
			{error && (
				<div className="absolute -bottom-4 bg-red-50 text-red-700 p-3 rounded-lg max-w-md text-center">
					{error}
				</div>
			)}
		</div>
	);
};

export default TriangleUpload;
