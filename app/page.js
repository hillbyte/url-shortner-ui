"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrlId] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [clicks, setClicks] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

    const clearUrl = sourceUrl.replace(/^(https?:\/\/)/, "");
    if (!clearUrl) {
      setError("Please enter a URL.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://url-shortner-api-pi.vercel.app/url",
        {
          url: "http://" + clearUrl,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        },
      );
      setUrlId(response.data.id);
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  const handleAnalytics = async () => {
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

    if (!url) {
      setError("Please shorten a URL first to view analytics.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://url-shortner-api-pi.vercel.app/url/analytics/${url}`,
      );
      setClicks(response.data.totalClicks);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(
        "Failed to fetch analytics. Make sure the shortened URL is valid.",
      );
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  const handleCopy = () => {
    const shortenedUrl = `https://url-shortner-api-pi.vercel.app/${url}`;
    navigator.clipboard
      .writeText(shortenedUrl)
      .then(() => {
        alert("Shortened URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy URL.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 p-4 sm:p-6 font-sans">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 drop-shadow-lg text-center">
        URL Shortener
      </h1>
      <p className="text-lg sm:text-xl mb-8 text-gray-300 text-center max-w-xl">
        Transform your long URLs into concise, shareable links.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col sm:flex-row items-stretch rounded-xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700 transition-all duration-300 hover:shadow-purple-500/30"
      >
        <span className="bg-indigo-600 text-white py-3 px-4 sm:px-6 flex items-center justify-center text-base sm:text-lg font-medium">
          https://
        </span>
        <input
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          type="text"
          name="url"
          id="url"
          placeholder="Paste a long URL here"
          className="py-3 px-4 sm:px-5 flex-1 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base sm:text-lg transition-all duration-200"
          aria-label="Enter long URL"
        />
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-600 text-white py-3 px-6 sm:px-8 font-semibold text-base sm:text-lg rounded-b-xl sm:rounded-l-none sm:rounded-r-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Shorten"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 text-red-400 bg-red-900/30 border border-red-700 rounded-lg p-3 text-center max-w-md w-full animate-fade-in-down">
          {error}
        </div>
      )}

      {url && (
        <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-gray-700 text-center animate-fade-in-up">
          <p className="text-lg sm:text-xl font-medium text-gray-300 mb-3">
            Your shortened URL:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://url-shortner-api-pi.vercel.app/${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 break-all text-base sm:text-lg font-mono underline hover:no-underline transition-colors duration-200 p-2 bg-gray-700 rounded-lg flex-grow"
              aria-label={`Go to shortened URL: https://url-shortner-api-pi.vercel.app/${url}`}
            >
              https://url-shortner-api-pi.vercel.app/{url}
            </a>
            <button
              onClick={handleCopy}
              className="bg-sky-700 hover:bg-sky-600 text-white py-2 px-4 sm:px-5 rounded-lg text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 shadow-md"
            >
              Copy
            </button>
          </div>

          <section className="mt-6 flex flex-col items-center">
            <button
              onClick={handleAnalytics}
              className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-6 rounded-lg text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md mb-4"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "View Analytics"
              )}
            </button>
            {clicks !== null && (
              <p className="text-xl sm:text-2xl font-bold text-teal-400 bg-gray-700 rounded-full py-2 px-5 shadow-inner animate-fade-in">
                Total Clicks: <span className="text-white">{clicks}</span>
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
