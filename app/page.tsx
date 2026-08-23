"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Gallery from "../components/gallery";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const MAX_QUESTIONS_PER_SESSION = 10;

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const questionCount = messages.filter((m) => m.role === "user").length;
  const limitReached = questionCount >= MAX_QUESTIONS_PER_SESSION;

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || limitReached) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to get a response.");
      }

      const data = await res.json();
      setMessages([
        ...nextMessages,
        { role: "model", text: data.answer || "No answer received." },
      ]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight ">Hi, I’m Brian</h1>

        <p className="text-lg leading-relaxed ">
          I’m a software engineer who enjoys building practical, user-focused
          tools that make a real difference. I grew up near Philadelphia,
          studied computer science at the University of Pittsburgh, and now work
          at Epic Systems in Wisconsin, where I develop software that helps
          clinicians deliver better care.
        </p>

        <p className="text-lg leading-relaxed  ">
          I like working across the stack and finding the balance between clean
          design and solid engineering. Outside of work, I’m passionate about
          music — whether it’s playing, recording, or discovering new artists —
          and I’m always looking for new ways to combine creativity and
          technology.
        </p>

        {/* Ask form */}
        <form
          onSubmit={handleAsk}
          className="pt-8 flex flex-col items-center space-y-4"
        >
          <input
            type="text"
            placeholder={limitReached ? "Question limit reached" : "Ask me anything..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={limitReached}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white text-gray-800 placeholder-gray-400
                       disabled:opacity-50
                      "
          />

          <button
            type="submit"
            disabled={loading || !input.trim() || limitReached}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       disabled:opacity-50
                       dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>

          {!limitReached && questionCount > 0 && (
            <p className="text-xs text-white/60">
              {MAX_QUESTIONS_PER_SESSION - questionCount} question
              {MAX_QUESTIONS_PER_SESSION - questionCount === 1 ? "" : "s"} left this session
            </p>
          )}

          {limitReached && (
            <p className="text-xs text-white/60">
              You&apos;ve reached the question limit for this session. Reload the page to start a new one.
            </p>
          )}
        </form>

        {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}

        {messages.length > 0 && (
          <div className="mt-10 flex flex-col space-y-4 max-w-xl mx-auto">
            {messages.map((message, i) =>
              message.role === "user" ? (
                <div key={i} className="text-right">
                  <span className="inline-block px-4 py-2 rounded-2xl bg-blue-600 text-white text-sm max-w-xs text-left">
                    {message.text}
                  </span>
                </div>
              ) : (
                <div key={i} className="flex items-start space-x-4">
                  {/* Profile image */}
                  <div className="flex-shrink-0">
                    <img
                      src="/brian.JPG"
                      alt="Brian Sostek"
                      className="w-14 h-14 rounded-full border border-gray-300 shadow-sm
                                 dark:border-gray-700"
                    />
                  </div>

                  {/* Speech bubble */}
                  <div className="relative bg-white p-4 rounded-2xl shadow-md text-left max-w-md transition-colors">
                    {/* Speech arrow */}
                    <div
                      className="absolute -left-2 top-6 w-4 h-4 bg-white
                                    rotate-45 border-l border-t "
                    ></div>

                    <div className="prose prose-slate text-gray-800 ">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <Gallery />
    </main>
  );
}
