import { decodeToken, isExpired } from "react-jwt";
import { create } from "zustand";

const useDataStore = create((set) => ({
	name: "",
	openModal: false,
	user: null,
	token: null,
	isAuthenticated: false,

	setName: (name) => set({ name: name }),
	removeName: () => set({ name: "" }),
	setOpenModal: () => set({ openModal: true }),
	removeOpenModal: () => set({ openModal: false }),

	syncUser: () => {
        // console.log('Sinkronisasi dilakukan!');
		const token = localStorage.getItem("identifier");
		const name = localStorage.getItem("name");
		let userData = {};
		try {
			userData.name = name;
			userData.role = (!token) ? "test" : decodeToken(token).role;
			// if (!token) {
			// 	userData.role = "test";
			// } else {
			// 	userData.role = decodeToken(token).role;
			// }
			set({
				user: userData,
				isAuthenticated: true 
			});
		} catch (error) {
            console.error("Sinkronisasi error: ", error);
		}
        // console.log('Sinkronisasi selesai!');
	},

	setUser: (userData) =>
		set({
			user: { name: userData.name, role: userData.role },
			isAuthenticated: true,
		}),

	setToken: (token) => {
		localStorage.setItem("identifier", token);
		const isTokenExpired = isExpired(token);
		const decodedData = decodeToken(token);
		localStorage.setItem("name", decodedData.username.trim());

		set({
			token: token,
			user: {
				name: decodedData.username,
				role: decodedData.role,
			},
			isAuthenticated: !isTokenExpired,
		});
	},

    logout: () => {
        localStorage.removeItem('identifier');
        localStorage.removeItem('name');
        set({name: '', user: null, isAuthenticated:false})
        return true;
    }

	// validateToken: async () => {
	//     const token = localStorage.getItem("identifier");
	//     if (!token) {
	//       set({
	//         user: null,
	//         isAuthenticated: false
	//       });
	//       return false;
	//     }

	//     const isTokenExpired = isExpired(token);
	//     if (isTokenExpired) {
	//       localStorage.removeItem("identifier");
	//       set({
	//         user: null,
	//         token: null,
	//         isAuthenticated: false
	//       });
	//       return false;
	//     }

	//     const decodedData = decodeToken(token);
	//     set({
	//       token: token,
	//       user: {
	//         name: decodedData.username,
	//         role: decodedData.role
	//       },
	//       isAuthenticated: true
	//     });
	//     return true;
	// }
}));

export default useDataStore;
