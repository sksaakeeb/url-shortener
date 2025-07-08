import { connectDB } from "@/lib/db";
import { nanoid } from "nanoid";
import mongoose from "mongoose";

const Url = mongoose.models.Url || mongoose.model("Url", new mongoose.Schema({
  slug: { type: String, unique: true },
  url: String,
}));

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
    }

    await connectDB();

    const slug = nanoid(6);
    await Url.create({ slug, url });

    return new Response(JSON.stringify({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}