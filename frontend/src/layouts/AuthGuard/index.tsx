import useAuthContext from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

type AuthGuardProps = {
	isPrivate: boolean;
};

export function AuthGuard({ isPrivate }: AuthGuardProps) {
	 const { isLogged } = useAuthContext();
	 
	if (isPrivate && !isLogged) {
		return <Navigate to="/login" />;
	}

	return <Outlet />;
}
