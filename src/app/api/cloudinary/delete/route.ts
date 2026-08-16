import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requise" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Direct client fallback if API credentials are not set on server environment
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: true,
        message: "Image retirée localement (Ajoutez CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.local pour la suppression physique sur Cloudinary)",
      });
    }

    // Extract public_id from Cloudinary URL
    const parts = url.split("/upload/");
    if (parts.length < 2) {
      return NextResponse.json({ error: "URL Cloudinary non reconnue" }, { status: 400 });
    }

    let publicId = parts[1].replace(/^v\d+\//, "");
    const lastDot = publicId.lastIndexOf(".");
    if (lastDot !== -1) {
      publicId = publicId.substring(0, lastDot);
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json({ success: true, result: data.result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur de suppression" }, { status: 500 });
  }
}
