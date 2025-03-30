import TriangleUpload from "@/components/TriangleUpload";

export function Upload() {
	return (
		<>
			<div className="flex flex-col gap-2">
				<h2 className="text-3xl font-bold">Data Upload</h2>
				<p className="text-2xl font-regular text-gray-500">
					Upload your data file to generate insights with power of AI
				</p>
			</div>
			<div className="w-full mt-10 flex items-center justify-center h-[calc(100vh-300px)] md:mt-0">
				<TriangleUpload />
			</div>
		</>
	);
}
