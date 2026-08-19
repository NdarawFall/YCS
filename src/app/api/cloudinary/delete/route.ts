import { NextResponse } from "next/server";

import { deleteCloudinaryAssets, extractPublicId } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requise" }, { status: 400 });
    }

    if (!extractPublicId(url)) {
      return NextResponse.json({ error: "URL Cloudinary non reconnue" }, { status: 400 });
    }

    const result = await deleteCloudinaryAssets([url]);

    if (result.skipped) {
      return NextResponse.json({
        success: true,
        message:
          "Image retirée localement (Ajoutez CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.local pour la suppression physique sur Cloudinary)",
      });
    }

    if (result.failed.length > 0) {
      return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true, result: "ok" });
  } catch {
    return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
  }
}
