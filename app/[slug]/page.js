import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";

const Url =
  mongoose.models.Url ||
  mongoose.model(
    "Url",
    new mongoose.Schema({
      slug: { type: String, unique: true },
      url: String,
    })
  );

export default async function RedirectPage({ params }) {
  await connectDB();
  const found = await Url.findOne({ slug: params.slug });

  if (!found) return notFound();
  redirect(found.url);
}
