// app/api/shorten/route.js
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const Url =
  mongoose.models.Url ||
  mongoose.model(
    "Url",
    new mongoose.Schema({
      slug: { type: String, unique: true },
      url: String,
    })
  );

export async function POST(req) {
  const { url } = await req.json();
  if (!url || !url.startsWith("http")) {
    return new Response(JSON.stringify({ error: "Invalid URL" }), {
      status: 400,
    });
  }

  await connectDB();

  const slug = nanoid(6);
  await Url.create({ slug, url });

  return new Response(
    JSON.stringify({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}` }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
