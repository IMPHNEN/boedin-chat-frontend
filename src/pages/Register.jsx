import { useState, useEffect } from "react";
import useDataStore from "@/store/Store";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { BACKEND_HTTP_URI } from "@/config/constants";

export default function Register() {
	const [name, setName] = useState("");
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// const addNameStore = useDataStore((state) => state.setName);
	const setUser = useDataStore((state) => state.setUser);
	const setToken = useDataStore((state) => state.setToken);
	// const isAuthenticated = useDataStore((state) => state.isAuthenticated);

	const navigate = useNavigate();

	// const register = async () => {
	// 	try {
	// 		const response = await fetch(`${BACKEND_HTTP_URI}/api/auth/register`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Accept: "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				username: name,
	// 			}),
	// 		});
	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			setToken(data.token);
	// 		} else {
	// 			setError("Register gagal");
	// 		}
	// 		setIsLoading(false);
	// 	} catch (error) {
	// 		console.error("Failed to regist user: ", error);
	// 		setError(
	// 			"Failed to regist user: " + (error instanceof Error)
	// 				? error.message
	// 				: "Unknown error"
	// 		);
	// 		setIsLoading(false);
	// 		return null;
	// 	}
	// };

	const register = () => {
		if(!name) return;
		try {
			localStorage.setItem("name", name)
			setUser({
				name: name,
				role: "test"
			});
		} catch (error) {
			console.error("Failed to regist user: ", error);
			setError(error);
		}
		setIsLoading(false);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		register();
		window.location.reload();
		if (!isLoading && !error) navigate("/", { replace: true });
	};

	useEffect(() => {
		// const localToken = localStorage.getItem("identifier");
		// if (localToken) return navigate("/", { replace: true });
		const localName = localStorage.getItem("name");
		if (localName) return navigate("/", { replace: true });
	}, [navigate]);

	return (
		<div className="w-screen h-screen flex items-center justify-center bg-background">
			<Card className="w-full max-w-md bg-background border-white shadow shadow-white">
				<CardHeader>
					<CardTitle className="text-white">
						Selamat datang di Boedin chat!
					</CardTitle>
					<CardDescription className="text-white">
						Boleh tau nama Anda siapa?
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="flex flex-col gap-6">
						<div className="group/field grid gap-2">
							<Label htmlFor="name" className="text-white">
								Nama{" "}
								<span aria-hidden="true" className="text-destructive">
									*
								</span>
							</Label>
							<Input
								id="name"
								name="name"
								placeholder="Fathin"
								className="peer border-white text-white"
								onChange={(e) => setName(e.target.value)}
								value={name}
								required={true}
								min={5}
								max={21}
								aria-errormessage="error-name"
							/>
							{!(name.trim().length > 5 && name.trim().length <= 21) ? (
								<p className="text-destructive invinsible peer-invalid:visible">
									Username harus memiliki panjang 6-21 karakter saja
								</p>
							) : (
								""
							)}
						</div>
					</CardContent>
					<CardFooter>
						<Button
							className="bg-success text-background"
							type="submit"
							size="sm"
							disabled={!name || name.trim() === ""}
						>
							Start Chatting
						</Button>
						{error ? (
							<div className="text-sm mr-3 text-destructive">{error}</div>
						) : (
							""
						)}
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
