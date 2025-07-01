"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    setLoading(true);
    setShortUrl("");
    setCopied(false);
    // Simulate network delay and dummy axios POST
    setTimeout(async () => {
      try {
        // Dummy request (replace with real endpoint later)
        await axios.post("https://dummy-endpoint.com/shorten", { url: longUrl });
        setShortUrl("https://short.ly/abc123");
      } catch {
        setShortUrl("https://short.ly/abc123"); // Always dummy for now
      }
      setLoading(false);
    }, 1000);
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90 dark:bg-zinc-950/90">
      <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500 rounded-3xl shadow-2xl p-1 w-full max-w-md border border-zinc-800 backdrop-blur-md transition-transform hover:scale-[1.025] hover:shadow-3xl duration-300">
        <div className="bg-zinc-900/95 dark:bg-zinc-950/95 rounded-2xl p-8">
          <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg">Shortner</h1>
          <p className="text-zinc-400 text-center mb-8 text-base">Paste your long URL below to get a short, shareable link instantly.</p>
          <div className="flex flex-col gap-5">
            <div className="relative flex items-center">
              {/* Input for long URL */}
              <input
                type="url"
                placeholder="Paste your long URL here..."
                className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-zinc-900 transition-all duration-200 shadow-inner"
                value={longUrl}
                onChange={e => setLongUrl(e.target.value)}
                disabled={loading}
              />
              {/* Info icon with tooltip */}
              <div className="ml-2 group relative cursor-pointer">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400 hover:text-blue-500 transition-colors duration-200">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                </svg>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-3 py-1.5 rounded bg-zinc-900 text-xs text-zinc-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg border border-zinc-700">
                  Enter a valid URL (e.g. https://example.com)
                </span>
              </div>
            </div>
            {/* Button to shorten URL */}
            <button
              className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 active:scale-95 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900 group disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleShorten}
              disabled={!longUrl || loading}
            >
              <span className="relative z-10">{loading ? "Shortening..." : "Shorten URL"}</span>
              {/* Ripple effect */}
              <span className="absolute inset-0 group-active:scale-110 group-active:bg-blue-800/20 transition-transform duration-200 rounded-lg" />
            </button>
          </div>
          {shortUrl && (
            <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in">
              <span className="text-zinc-300 mb-1">Your short URL:</span>
              <span
                className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-mono text-base rounded-full shadow-md cursor-pointer select-all transition-all duration-200 border border-zinc-700 ${copied ? 'scale-105' : ''}`}
                style={{ letterSpacing: "normal" }}
                onClick={handleCopy}
                title="Click to copy"
              >
                {shortUrl}
              </span>
              {copied && <span className="text-green-400 text-xs mt-1 animate-pulse">Copied!</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
