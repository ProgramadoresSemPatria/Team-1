import { Navigate, Outlet } from "react-router-dom";

type AuthGuardProps = {
	isPrivate: boolean;
};

export function AuthGuard({ isPrivate }: AuthGuardProps) {
	const isLogged = true;

	if (isPrivate && !isLogged) {
		return <Navigate to="/login" />;
	}

	if (!isPrivate && isLogged) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}
