"use client";
import Image from "next/image";
import UrlShortener from "./lib/api";
import { FormEvent, useEffect, useState, useRef } from "react";
import getToken from "./lib/getToken";
import { env } from "./lib/config";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  AlertCircle,
  Link as LinkIcon,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [token, setToken] = useState<string>();
  const [result, setResult] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const api = new UrlShortener({ token });

  useEffect(() => {
    async function getAndSetToken() {
      const token = await getToken();
      setToken(token);
    }

    getAndSetToken();
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [result]);

  function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError("");
    setResult("");
    setCopied(false);

    const redirect = inputValue.trim();

    if (!redirect) {
      setError("Please enter a URL");
      inputRef.current?.focus();
      return;
    }

    if (!isValidUrl(redirect)) {
      setError("Please enter a valid URL (include http:// or https://)");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);

    api
      .createShortUrl(redirect)
      .then(({ slug, message }) => {
        if (slug) {
          const url = new URL(slug, env.NEXT_PUBLIC_FRONTEND_URL).toString();
          setResult(url);
          setInputValue("");
        } else {
          setError(message ?? "Unknown error, try again later.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to shorten URL. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError("Failed to copy to clipboard");
      });
  }

  function openUrl(url: string) {
    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-300">
                Fast & Secure URL Shortening
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent animate-gradient">
                Shorten Your Links
              </span>
              <br />
              <span className="text-gray-300 text-3xl md:text-5xl font-normal">
                in Seconds
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform long URLs into short, memorable links that are perfect
              for sharing anywhere. Fast, secure, and completely free.
            </p>
          </motion.header>

          {/* URL Shortener Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 md:p-8 mb-12 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <LinkIcon className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Shorten a URL</h2>
                <p className="text-gray-400">Enter your long URL below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="url"
                    id="redirect"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-900/50 border-2 border-gray-800 rounded-xl text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-500"
                    placeholder="https://example.com/very-long-url-path"
                    required
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LinkIcon className="w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Shorten URL
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">Secure</div>
                <div className="text-gray-400">HTTPS Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">Free</div>
                <div className="text-gray-400">No Limits</div>
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                ref={resultRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-6 md:p-8 mb-12 backdrop-blur-lg border border-green-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">URL Shortened!</h2>
                    <p className="text-gray-400">
                      Your shortened link is ready to use
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-900/50 rounded-xl border-2 border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-400 mb-1">
                          Short URL
                        </div>
                        <div className="text-lg font-mono text-green-400 truncate">
                          {result}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(result)}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all active:scale-95 flex items-center gap-2"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => openUrl(result)}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-all active:scale-95 flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-gray-400">
                    <p>Link copied to clipboard? Share it anywhere!</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setInputValue("");
                        setResult("");
                        setError("");
                        inputRef.current?.focus();
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all active:scale-95"
                    >
                      Shorten Another
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          "https://twitter.com/intent/tweet?text=" +
                            encodeURIComponent(
                              `Just shortened a URL with this awesome tool! Check it out: ${result}`
                            ),
                          "_blank"
                        )
                      }
                      className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-all active:scale-95"
                    >
                      Share on Twitter
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-2xl p-6 md:p-8 backdrop-blur-lg"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Our URL Shortener?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-400">
                  Create shortened URLs instantly with our optimized
                  infrastructure.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
                <p className="text-gray-400">
                  All links are protected with HTTPS encryption and spam
                  detection.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Registration</h3>
                <p className="text-gray-400">
                  Start shortening URLs immediately without any sign-up
                  required.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} URL Shortener. All rights reserved.
          </p>
          <p className="mt-2">
            Made with ❤️ for faster and better sharing experience.
          </p>
        </div>
      </footer>
    </main>
  );
}
