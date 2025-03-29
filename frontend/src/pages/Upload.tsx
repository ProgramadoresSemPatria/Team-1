import { AsideNav } from "@/components/AsideNav";
import TriangleUpload from "@/components/TriangleUpload";
import { Header } from "@/layouts/Header";

export function Upload() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden pl-20">
        <AsideNav />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">Data Upload</h2>
            <p className="text-2xl font-regular text-gray-500">
              Upload your data file to generate insights with power of AI
            </p>
          </div>
          <div className="w-full flex items-center justify-center h-[calc(100vh-300px)]">
            <TriangleUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
