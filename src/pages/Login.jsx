import { useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { NavLink, useNavigate } from "react-router";
// import useDataStore from "@/store/Store";
import { BACKEND_HTTP_URI } from "@/config/constants";

export default function Login() {
	const navigate = useNavigate();
	
	// const setUser = useDataStore((state) => state.setUser);
	// const setToken = useDataStore((state) => state.setToken);
	// const isAuthenticated = useDataStore((state) => state.isAuthenticated);

	useEffect(() => {
		const localToken = localStorage.getItem("identifier");
		if (localToken) return navigate("/", { replace: true });
	}, [navigate]);

	return (
		<div className="w-screen h-screen flex items-center justify-center bg-background">
			<Card className="w-full max-w-md bg-background border-white shadow shadow-white">
				<CardHeader>
					<CardTitle className="text-white">
						Selamat datang di Boedin chat!
					</CardTitle>
					<CardDescription className="text-white">
						Login dulu yuk!
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<NavLink
						to={`${BACKEND_HTTP_URI}/api/auth/login`}
						className="bg-accent text-white px-1.5 py-3 text-center"
						// target="_blank"
					>
						Login dengan discord
					</NavLink>
					<NavLink
						to="/register"
						className="bg-primary outline-white text-white px-1.5 py-3 text-center"
					>
						Coba Dulu
					</NavLink>
				</CardContent>
			</Card>
		</div>
	);
}