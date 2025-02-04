import { useEffect, useRef, useState } from "react";
import DummyChat from "./DummyChat";
import DummyChatSelf from "./DummyChatSelf";
import { Button } from "./ui/button";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";
import useDataStore from "@/store/Store";
import Hamburger from "./Hamburger";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { WEBSOCKET_URI } from "@/config/constants";
// import "react-quill-new/dist/quill.snow.css";
import useWebSocket, { ReadyState } from 'react-use-websocket'

const ChatBox = () => {
	const [openInput, setOpenInput] = useState(false);
	// const nameStore = useDataStore((state) => state.name);
	// const syncUser = useDataStore((state) => state.syncUser);
	// // const [currentUser, setCurrentUser] = useState(null);
	const isAuthenticated = useDataStore((state) => state.isAuthenticated);
	const user = useDataStore((state) => state.user);
	const token = useDataStore((state) => state.token);
	const quillRef = useRef(null);
	const [sidebarVisible, setSidebarVisible] = useState(true); // State untuk sidebar

	const [messages, setMessages] = useState([]);

	// const currentUser = nameStore || user?.name || localStorage.getItem('name');
	const [inputMessage, setInputMessage] = useState("");

	const [socket, setSocket] = useState(null);

	/*
		Kode di bawah hanya bersifat backup,
		jika websocket sedang maintenance.
	*/

	// const handleSendButton = () => {
	//     // console.log("Pesan ada di component chat input", inputMessage);
	//     setMessages((prev) => [
	//         ...prev,
	//         {
	//             name: currentUser,
	//             message: inputMessage,
	//             time: new Date().toISOString(),
	//         },
	//     ]);
	//     setInputMessage("");
	// };

	/*
		End of backup code
	*/

	/*
		Kode di bawah adalah implementasi hook react-use-websocket,
		jika ws legacy aman, kode ini bisa diganti
	*/
	const {
		sendJsonMessage,
		lastJsonMessage,
		readyState,
		getWebSocket,
	} = useWebSocket(WEBSOCKET_URI, {
		share: false,
		shouldConnect: isAuthenticated && !!token,
		reconnectAttempts: 5,
		reconnectInterval: 3000,
		onOpen: () => {
			console.log('WebSocket Connected, sending auth token');
			// Get token from localStorage
			const storedToken = localStorage.getItem('identifier');
			console.log('Stored token: ', storedToken ? 'exists' : 'missing');
		
			if (!storedToken) {
				console.error('No token in localStorage');
				return;
			}

			// Send token immediately on connection
			sendJsonMessage({ 
				token: token?.trim() || storedToken // Ensure token is properly formatted
			});

			// try {
			// 	// Send token immediately on connection
			// 	sendJsonMessage({ 
			// 		token: token.trim() // Ensure token is properly formatted
			// 	});
			// 	console.log('Auth token sent:', { token: token });
			// 	setSocket(getWebSocket());
			// 	setOpenInput(true);
			// } catch (err) {
			// 	console.error("Error during WebSocket authentication:", err);
			// 	setOpenInput(false);
			// }
			console.log('Auth message sent');
			setSocket(getWebSocket());
			setOpenInput(true);
		},
		onMessage: (event) => {
			try {
				const data = JSON.parse(event.data);
				const incomingMessage = Array.isArray(data) ? data : [data];
				setMessages(prev => [...prev, ...incomingMessage].slice(-29));
			} catch (err) {
				console.error("Message processing error:", err);
			}
		},
		onError: (error) => {
			console.error("WebSocket error:", error);
			setOpenInput(false);
		},
		onClose: () => {
			console.log("WebSocket disconnected");
			setOpenInput(false);
		},
		//Will attempt to reconnect on all close events, such as server shutting down
		shouldReconnect: (closeEvent) => true,
		// Add retryOnError
		retryOnError: true
	});
	/*
		End of websocket react hook code
	*/


	const handleSendButton = () => {
		const editor = quillRef.current?.getEditor();
		let content = editor?.root.innerHTML.trim(); // Ambil konten rich text sebagai HTML

		// Simpan tag <img> dalam array dan ganti sementara dengan placeholder
		const images = [];
		const contentWithImages = content.replace(/<img[^>]*>/g, (match) => {
			images.push(match); // Simpan tag <img>
			return `[[IMG-${images.length - 1}]]`; // Gantikan <img> dengan placeholder
		});

		// Hapus semua tag HTML lain (kecuali <img>)
		let contentWithoutHTML = contentWithImages.replace(/<\/?[^>]+(>|$)/g, "");

		// Jika hanya ada spasi atau newline, jangan lanjutkan
		if (!contentWithoutHTML || contentWithoutHTML.trim().length === 0) {
			return; // Jangan kirim jika kosong atau hanya newline
		}

		// Hapus elemen <p><br></p> dan <span class="ql-cursor">
		content = contentWithImages.replace(/<p><br><\/p>$/, "").replace('<span class="ql-cursor">﻿</span>', ""); // Hapus elemen kursor kosong

		// Kembalikan tag <img> ke posisi semula
		content = content.replace(/\[\[IMG-(\d+)\]\]/g, (match, index) => {
			return images[index]; // Kembalikan tag <img> ke posisi semula
		});

		try {
			// Persiapkan data pesan
			const messageData = {
				name: user.name,
				content: content,
				timestamp: new Date().toISOString(),
			};
			// Kirim pesan jika WebSocket tersedia
			if (socket) {
				sendJsonMessage(messageData) // Kirim pesan melalui WebSocket React Hook
				// socket.send(JSON.stringify(messageData)); // Kirim pesan melalui WebSocket
			}
		} catch (error) {
			console.error("Test message failed to sent! :", error);
		}

		// Bersihkan editor (hapus konten)
		editor.setContents([]);

		// Reset state input message
		setInputMessage("");
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendButton();
		}
	};

	
	// Original Websocket
	// useEffect(() => {
	// 	if(!isAuthenticated) return;
	// 	const ws = new WebSocket(WEBSOCKET_URI);
	// 	setSocket(ws);

	// 	ws.onopen = () => {
	// 		ws.send(JSON.stringify({ token: token }));
	// 		console.log("WebSocket connected")
	// 	}
	// 	ws.onclose = () => console.log("WebSocket disconnected");
	// 	ws.onerror = (error) => console.error("WebSocket error: ", error);

	// 	ws.onmessage = (event) => {
	// 		const data = JSON.parse(event.data);

	// 		const incomingMessage = Array.isArray(data) ? data: [data];

	// 		setMessages((prev) => {
	// 			const newMessages = [...prev, ...incomingMessage];
	// 			return newMessages.slice(-29); // hanya mengambil 29 pesan terakhir
	// 		});
	// 	};

	// 	setOpenInput(true);
	// 	return () => ws.close();
	// }, [isAuthenticated, token]);

	/*
		Websocket react hook status logging
	*/
	useEffect(() => {
		if (!isAuthenticated) return;

		const connectionStatus = {
			[ReadyState.CONNECTING]: 'Connecting',
			[ReadyState.OPEN]: 'Open',
			[ReadyState.CLOSING]: 'Closing',
			[ReadyState.CLOSED]: 'Closed',
			[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
		}[readyState];
	
		console.log('WebSocket Status:', connectionStatus);
	}, [isAuthenticated, readyState, token]);
	/*
		End of websocket react hook code
	*/

  	const chatContainer = useRef();

	useEffect(() => {
		if (chatContainer.current) {
			setTimeout(() => {
				chatContainer.current.scrollTo({
					top: chatContainer.current.scrollHeight,
					behavior: "smooth",
				});
			}, 1);
		}
	}, [messages]);

	const handleChange = (content) => {
		// Menyimpan semua tag <img> dalam konten
		const images = [];
		const contentWithImages = content.replace(/<img[^>]*>/g, (match) => {
			images.push(match); // Simpan tag <img>
			return `[[IMG-${images.length - 1}]]`; // Gantikan <img> dengan placeholder
		});

		// Pemrosesan teks selain <img> (trim dan replace lainnya)
		let processedContent = contentWithImages
			.trim()
			.replace(/<p><br><\/p>$/, "")
			.replace('<span class="ql-cursor">﻿</span>', "");

        // Mengembalikan tag <img> ke posisi aslinya
        processedContent = processedContent.replace(/\[\[IMG-(\d+)\]\]/g, (match, index) => {
            return images[index]; // Kembalikan tag <img> ke posisi semula
        });

		setInputMessage(processedContent);
	};	

	return (
		<div className="h-[100vh] xl:h-[90vh] w-[100vw] xl:w-[95vw] px-0 bg-background flex flex-col md:flex-row xl:rounded-xl overflow-hidden gap-2">
			{sidebarVisible && (
				<div className="flex-[1] border-primary border-4 bg-primary text-white rounded-xl overflow-hidden hidden xl:block">
					<img
						src="https://ik.imagekit.io/9hpbqscxd/SG/image-83.jpg?updatedAt=1705798245623"
						alt=""
					/>
					<div>
						<h1 className="font-bold text-center text-2xl mt-3 mb-3">
							Eyyoo <span className="text-success">{user?.name}</span>
						</h1>
						<h3 className="font-bold text-center text-xl mb-1">Shortcut</h3>
						<ul className="list-inside list-disc pl-5 text-sm text-gray-600">
							<li>
								<strong>Bold:</strong> <code>Ctrl + B</code>
							</li>
							<li>
								<strong>
									<em>Italic:</em>
								</strong>{" "}
								<code>Ctrl + I</code>
							</li>
							<li>
								<strong>
									<u>Underline:</u>
								</strong>{" "}
								<code>Ctrl + U</code>
							</li>
							<li>
								<strong>Bullet List:</strong> <code>Ctrl + Shift + 8</code>
							</li>
							<li>
								<strong>Numbered List:</strong> <code>Ctrl + Shift + 7</code>
							</li>
							<li>
								<strong>Insert Link:</strong> Use the toolbar
							</li>
						</ul>
						<h3 className="font-bold text-center text-xl mb-1 mt-6">Rules</h3>
						<ul className="list-inside list-disc pl-5 text-sm text-gray-600">
							<li>Be respectful and kind to others.</li>
							<li>No spamming or excessive messages.</li>
							<li>Avoid offensive language.</li>
							<li>Keep the conversation on-topic.</li>
							<li>Do not share personal information.</li>
						</ul>
					</div>
				</div>
			)}
			<div
				className={`flex flex-[4] flex-col bg-primary text-white overflow-hidden xl:rounded-xl border-4 border-primary`}
			>
				<div className="w-full h-20 bg-primary flex items-center justify-between px-3 xl:px-7 gap-4">
					<div className="flex items-center gap-4">
						<div className="w-[50px] h-[50px] bg-yellow-500 rounded-full overflow-hidden">
							<img src="/fp-square.jpeg" alt="" />
						</div>
						<div>
							<h1 className="font-bold uppercase">IMPHNEN</h1>
							<p className="font-normal truncate hidden md:block opacity-70">
								Ingin Menjadi Programmer Handal, Namun Enggan Ngoding
							</p>
						</div>
					</div>
					<Hamburger />
				</div>

                <div ref={chatContainer} className="max-w-full relative z-5 chat-container flex-1 bg-gradient-to-r from-background to-primary overflow-y-auto overflow-x-hidden pr-6 py-6">
                    {/* DISINI TEMPAT UNTUK MELAKUKAN CHAT, WEB SOCKET HARUS TERHUBUNG KE SINI */}

					{messages.map((message, index) => {
						const messageBefore = index > 0 ? messages[index - 1] : null;

						return message.name === user?.name ? (
							<DummyChatSelf
								key={index}
								name={user?.name}
								content={message.content}
								messageBefore={messageBefore} // Kirimkan pesan sebelumnya
							/>
						) : (
							<DummyChat
								key={index}
								name={message.name}
								content={message.content}
								messageBefore={messageBefore} // Kirimkan pesan sebelumnya
							/>
						);
					})}
				</div>
				<div className="w-full h-20 bg-primary py-4 px-2 flex ">
					<div className="w-full flex flex-row space-x-2">
						{openInput ? (
							<>
								<Button
									onClick={() => setSidebarVisible(!sidebarVisible)}
									className="w-12 h-12 bg-accent hidden xl:block text-white"
								>
									{sidebarVisible ? <ChevronLeft /> : <ChevronRight />}
								</Button>
								<ReactQuill
									ref={quillRef}
									theme="snow"
									id="message"
									className="flex-grow bg-accent max-w-full text-white rounded-md border-none placeholder:text-white placeholder-opacity-50 resize-none font-sans font-normal"
									onKeyDown={handleKeyDown}
									modules={{ toolbar: false }}
									onChange={handleChange}
									placeholder="Type your message..."
								/>
								<Button
									onClick={handleSendButton}
									disabled={!inputMessage}
									className="w-12 h-12 border bg-accent rounded-full text-white border-accent"
								>
									<Send className="w-6 h-6" />
								</Button>
							</>
						) : (
							<>
								<div className="w-full h-full flex items-center justify-center">
									<p>Silakan isi nama dulu untuk mulai chat!</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
