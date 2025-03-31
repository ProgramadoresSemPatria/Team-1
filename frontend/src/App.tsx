import "@/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "@/context/AuthContext";
import { AuthGuard } from "./layouts/AuthGuard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Upload } from "./pages/Upload";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "./services/query-client";
import { CsvAnalyze } from "./pages/CsvAnalyze";
import FixedLayout from "./layouts/FixedLayout";
import { LandingPage } from "./pages/LandingPage";

function App() {
	return (
		<div className="h-full overflow-y-hidden">
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				className={"w-[95%] ml-4 md:w-[100%] md:ml-0"}
			/>
			<BrowserRouter>
				<ReactQueryProvider>
					<AuthProvider>
						<Routes>
							<Route element={<AuthGuard isPrivate={false} />}>
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />
								<Route path="/" element={<LandingPage />} />
							</Route>
							<Route element={<AuthGuard isPrivate={true} />}>
								<Route element={<FixedLayout />}>
									<Route path="/upload" element={<Upload />} />
									<Route path="/analytics" element={<CsvAnalyze />} />
								</Route>
							</Route>
						</Routes>
					</AuthProvider>
				</ReactQueryProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
