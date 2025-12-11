"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MessageBubbleProps {
  sender?: "user" | "bot";
  text?: string;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender = "bot",
  text = "",
  showAvatar = false,
}) => {
  const cleanText = String(text).replace(/\n{2,}/g, "\n").trim();
  const isUser = sender === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`flex items-start space-x-3 max-w-[85%] ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {showAvatar && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-md ${
              isUser
                ? "bg-gradient-to-br from-gray-400 to-gray-600"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}
          >
            {isUser ? "👤" : "🤖"}
          </div>
        )}

        <div
          className={`px-5 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-none"
              : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
          }`}
          style={{ wordBreak: "break-word" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              p: ({ children }) => (
                <p
                  className={`m-0 leading-relaxed ${
                    isUser ? "text-white" : "text-gray-800"
                  }`}
                >
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong
                  className={`font-semibold ${
                    isUser ? "text-white" : "text-gray-900"
                  }`}
                >
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul
                  className={`list-disc list-inside mt-2 space-y-1 ${
                    isUser ? "text-white" : "text-gray-800"
                  }`}
                >
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol
                  className={`list-decimal list-inside mt-2 space-y-1 ${
                    isUser ? "text-white" : "text-gray-800"
                  }`}
                >
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({
                inline,
                children,
                }: {
                inline?: boolean;
                children?: React.ReactNode;
                }) =>
                inline ? (
                  <code
                    className={`px-1 py-0.5 rounded text-sm font-mono ${
                      isUser
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-pink-600"
                    }`}
                  >
                    {children}
                  </code>
                ) : (
                  <pre className="bg-gray-900 text-white p-3 rounded-lg text-sm overflow-auto mt-2 font-mono">
                    {children}
                  </pre>
                ),
              a: ({ children, href }) => (
                <a
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline ${
                    isUser ? "text-white" : "text-blue-600"
                  }`}
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  className={`border-l-4 pl-4 py-2 my-2 italic ${
                    isUser
                      ? "border-white/50 text-white/90"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {cleanText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
