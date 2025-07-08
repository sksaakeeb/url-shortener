"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shorten = async () => {
  if (!url || !url.startsWith("http")) {
    toast.error("Please enter a valid URL starting with http or https.");
    return;
  }

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const text = await res.text(); // get raw text first

    if (!res.ok) {
      throw new Error(
        JSON.parse(text)?.error || "Failed to shorten URL"
      );
    }

    const data = JSON.parse(text); // safe now
    setShortUrl(data.shortUrl);
    toast.success("Short URL created successfully!");
  } catch (err) {
    console.error("Shorten Error:", err);
    toast.error(err.message || "Something went wrong.");
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-tr from-sky-100 via-blue-50 to-white flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/60 shadow-2xl border border-white/40 rounded-3xl p-8 w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-3">
            The Fastest URL Shortener on the Internet
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mt-3">
            Instant redirects. Zero delays. Custom short links.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="url"
            placeholder="https://google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-base py-3"
          />
          <Button
            onClick={shorten}
            className="w-full text-base py-3 cursor-pointer"
          >
            ✂️ Shorten URL
          </Button>
        </div>

        {shortUrl && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl text-center relative">
            <p className="text-md text-green-800 font-medium">
              Your Short URL:
              <br />
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 break-words"
              >
                {shortUrl}
              </a>
            </p>

            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard
                    .writeText(shortUrl)
                    .then(() => toast.success("URL copied to clipboard."))
                    .catch(() => toast.error("Failed to copy to clipboard."));
                } else {
                  toast.error("Clipboard not supported in this browser.");
                }
              }}
              className="cursor-pointer absolute top-2 right-2 text-green-700 hover:text-green-900 transition"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
