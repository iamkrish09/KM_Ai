// "use client";

// import { useState, useRef, useEffect } from "react";
// import MessageBubble from "./MessageBubble";
// import { Send, Loader2, Wallet, Mic } from "lucide-react";

// // Types
// interface Message {
//   sender: "user" | "bot";
//   text: string;
// }

// const ChatUI = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       sender: "bot",
//       text: "Hi! I’m KharchaMind (💰) — your friendly finance companion, here to make managing your daily expenses simple and stress-free.",
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // -------------------------------------------------------
//   //  1. AUTO-REDIRECT IF USER NOT LOGGED IN
//   // -------------------------------------------------------
//   // useEffect(() => {
//   //   const token = localStorage.getItem("access_token");
//   //   if (!token) {
//   //     alert("Please login first.");
//   //     window.location.href = "/login"; // redirect
//   //   }
//   // }, []);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // -------------------------------------------------------
//   //  2. SEND MESSAGE TO BACKEND WITH JWT INCLUDED
//   // -------------------------------------------------------
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       alert("Session expired. Please login again.");
//       window.location.href = "/";
//       return;
//     }

//     // Add user message to UI
//     setMessages((prev) => [...prev, { sender: "user", text: input }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/agent/query`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, 
//           },
//           body: JSON.stringify({
//             message: input,
//             session_id: token,
//           }),
//         }
//       );

//       if (res.status === 401) {
//         alert("Your session expired. Please login again.");
//         localStorage.removeItem("access_token");
//         window.location.href = "/";
//         return;
//       }

//       const data = await res.json();
//       const reply = data.reply || data.message || "⚠️ I couldn't understand that.";

//       setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Server unreachable. Try again." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // -------------------------------------------------------
//   // 🟦 3. SPEECH TO TEXT (unchanged)
//   // -------------------------------------------------------
//   const recognitionRef = useRef<any>(null);

//   useEffect(() => {
//     const SpeechRecognition =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//     if (SpeechRecognition) {
//       const recog = new SpeechRecognition();
//       recog.continuous = true;
//       recog.interimResults = true;
//       recog.lang = "en-IN";

//       recog.onresult = (event: any) => {
//         let transcript = "";
//         for (let i = 0; i < event.results.length; i++) {
//           transcript += event.results[i][0].transcript + " ";
//         }
//         setInput(transcript.trim());
//       };

//       recog.onerror = (err: any) => {
//         console.error("Speech Error:", err);
//       };

//       recognitionRef.current = recog;
//     }
//   }, []);

//   const startListening = () => recognitionRef.current?.start();
//   const stopListening = () => recognitionRef.current?.stop();

//   // -------------------------------------------------------

//   return (
//     <div className="flex flex-col h-screen bg-black text-white">
//       {/* Header */}
//       <div className="border-b border-gray-800 bg-[#0f0f0f] shadow-xl">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-3">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-black flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)]">
//             <Wallet size={22} className="text-white" />
//           </div>

//           <div>
//             <h1 className="text-lg font-semibold">WELCOME TO KHARCHA MIND AI AGENT</h1>
//             <p className="text-xs text-gray-400">
//               Your personal AI to keep your expenses simple & stress-free.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
//           {messages.map((msg, i) => (
//             <MessageBubble key={i} sender={msg.sender} text={msg.text} showAvatar />
//           ))}

//           {loading && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 rounded-2xl border border-gray-700">
//                 <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
//                 <span className="text-sm text-gray-300">Thinking...</span>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input Bar */}
//       <div className="border-t border-gray-800 bg-[#0f0f0f]/95 backdrop-blur-md">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-end gap-2">

//           {/* Text Input */}
//           <textarea
//             className="flex-1 bg-black border border-gray-400 text-white placeholder-gray-500 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:border-blue-500 shadow-lg"
//             placeholder="Type your message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleEnter}
//             rows={1}
//           />

//           {/* Mic */}
//           <button
//             onMouseDown={startListening}
//             onMouseUp={stopListening}
//             onTouchStart={startListening}
//             onTouchEnd={stopListening}
//             className="bg-black border border-gray-300 hover:border-gray-400 text-white p-3 rounded-2xl shadow-lg"
//           >
//             <Mic className="w-5 h-5 text-white" />
//           </button>

//           {/* Send */}
//           <button
//             onClick={sendMessage}
//             disabled={loading || !input.trim()}
//             className="bg-black border border-gray-300 hover:border-gray-400 text-white p-3 rounded-2xl shadow-lg disabled:opacity-40"
//           >
//             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatUI;



"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { Send, Loader2, Wallet, Mic } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout, setToken } from "@/store/authSlice";
import { useRouter } from "next/navigation";

/** -------------------------
 * Types
 * --------------------------*/
interface Message {
  sender: "user" | "bot";
  text: string;
}

/** -------------------------
 * ENV / CONFIG
 * --------------------------
 * Make sure NEXT_PUBLIC_API_BASE_URL is set in env.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://km-backend-yj1m.onrender.com";
const AGENT_QUERY_ENDPOINT = `${API_BASE}/agent/query`;

/** -------------------------
 * Utilities
 * --------------------------*/

/** -------------------------
 * Component
 * --------------------------*/
const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! I'm KharchaMind (💰) — your friendly finance companion, here to make managing your daily expenses simple and stress-free.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Redux hooks
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Sync token from localStorage on mount (for SSR hydration)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        // Clean the token before setting
        const cleanToken = storedToken.trim().replace(/^["']|["']$/g, "");
        if (cleanToken && cleanToken !== token) {
          dispatch(setToken(cleanToken));
          console.log("Token synced from localStorage:", cleanToken.substring(0, 20) + "...");
        }
      }
    }
  }, [dispatch]); // Remove token from dependencies to avoid infinite loop

  // Redirect to home if not authenticated (with delay to allow sync)
  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("access_token");
          if (!storedToken) {
            router.push("/");
          }
        }
      }
    };
    
    // Small delay to allow Redux to sync from localStorage
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [token, router]);

  // auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech recognition setup (unchanged)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-IN";

      recog.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setInput(transcript.trim());
      };

      recog.onerror = (err: any) => {
        console.error("Speech Error:", err);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const startListening = () => recognitionRef.current?.start();
  const stopListening = () => recognitionRef.current?.stop();

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /** Core sendMessage with token from Redux */
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Get token from Redux or localStorage as fallback
    let authToken = token;
    if (!authToken && typeof window !== "undefined") {
      authToken = localStorage.getItem("access_token");
      if (authToken) {
        dispatch(setToken(authToken));
      }
    }

    // Check if user is authenticated
    if (!authToken) {
      alert("Session expired. Please login again.");
      dispatch(logout());
      router.push("/");
      return;
    }

    // Trim token to remove any whitespace
    authToken = authToken.trim();

    // Push user message immediately
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Log for debugging (remove in production)
      console.log("Sending request with token:", authToken.substring(0, 20) + "...");

      const res = await fetch(AGENT_QUERY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      // Log response status for debugging
      console.log("API Response status:", res.status);

      // Handle 401 Unauthorized
      if (res.status === 401) {
        const errorText = await res.text().catch(() => "");
        console.error("401 Unauthorized - Token might be invalid:", errorText);
        alert("Your session expired. Please login again.");
        dispatch(logout());
        router.push("/");
        return;
      }

      if (!res.ok) {
        // non-401 errors
        const text = await res.text().catch(() => "");
        console.error("Agent query failed", res.status, text);
        
        // If it's a 401 but we didn't catch it above, handle it
        if (res.status === 401) {
          alert("Your session expired. Please login again.");
          dispatch(logout());
          router.push("/");
          return;
        }
        
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              "⚠️ Something went wrong. Server returned " +
              `${res.status}. ${text ? "Message: " + text : ""}`,
          },
        ]);
        return;
      }

      // success
      const data = await res.json().catch(() => ({}));
      console.log("API Response data:", data);
      const reply = data?.reply || data?.message || "⚠️ I couldn't understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("sendMessage error", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server unreachable. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f0f] shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-black flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <Wallet size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-semibold">WELCOME TO KHARCHA MIND AI AGENT</h1>
            <p className="text-xs text-gray-400">
              Your personal AI to keep your expenses simple & stress-free.
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} text={msg.text} showAvatar />
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-gray-900 px-4 py-3 rounded-2xl border border-gray-700">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm text-gray-300">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-800 bg-[#0f0f0f]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-end gap-2">
          <textarea
            className="flex-1 bg-black border border-gray-400 text-white placeholder-gray-500 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:border-blue-500 shadow-lg"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            rows={1}
          />

          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            className="bg-black border border-gray-300 hover:border-gray-400 text-white p-3 rounded-2xl shadow-lg"
            title="Hold to speak"
            type="button"
          >
            <Mic className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-black border border-gray-300 hover:border-gray-400 text-white p-3 rounded-2xl shadow-lg disabled:opacity-40"
            type="button"
            title="Send"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
