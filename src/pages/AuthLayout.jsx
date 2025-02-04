import { useEffect, useState } from "react";
import useDataStore from "@/store/Store";
import { Navigate, Outlet, useNavigate, useSearchParams } from "react-router";
import { isExpired } from "react-jwt";

// export const AuthContext = createContext(undefined);

// export function AuthProvider({ children }) {
// 	const [currentUser, setCurrentUser] = useState(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		// Handle anonymous user
// 		if (localName) {
// 			addNameStore(localName);
// 		}
// 	}, []);

// 	const value = {
// 		currentUser: currentUser,
// 	};

// 	return (
// 		<AuthContext.Provider value={value}>
// 			{!isLoading && children}
// 		</AuthContext.Provider>
// 	);
// }

// export const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	if (!context) {
// 		throw new Error("Contextnya ilang coy!");
// 	}
// 	return context;
// };

export function AuthLayout() {
	const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useDataStore((state) => state.isAuthenticated);
    const syncUser = useDataStore((state) => state.syncUser);
    // const token = useDataStore((state) => state.token);
    const setToken = useDataStore((state) => state.setToken);
    const user = useDataStore((state) => state.user);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchParams.has("token")) {
            let token = searchParams.get("token");
            setToken(token);
            navigate('/',{replace:false});
        }
        return
    },[navigate, searchParams, setToken]);
    
    useEffect(() => {
        const initAuth = async () => {
            try {
                await syncUser();
            } catch (error) {
                console.error("Authentication error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [syncUser]);

    if (isLoading) {
        return null; // or loading spinner
    }

    const hasLocalAuth = localStorage.getItem("name") || localStorage.getItem("identifier");
    
    if (!isAuthenticated || !hasLocalAuth || !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
