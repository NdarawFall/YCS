import crypto from "crypto";

/**
 * Suppression d'assets Cloudinary, côté serveur uniquement.
 *
 * Utilise l'endpoint signé `image/destroy` (et non l'Admin API, plus
 * sévèrement limitée en requêtes sur le plan gratuit).
 */

export type CloudinaryPurgeResult = {
  /** Assets effectivement supprimés (ou déjà absents chez Cloudinary). */
  deleted: number;
  /** public_ids dont la suppression a échoué. */
  failed: string[];
  /** true quand les identifiants serveur manquent : rien n'a été tenté. */
  skipped: boolean;
};

/** Extrait le public_id d'une URL Cloudinary, ou null si ce n'en est pas une. */
export function extractPublicId(url: string): string | null {
  if (typeof url !== "string" || !url.includes("cloudinary.com")) return null;

  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  // On retire la query string et le fragment éventuels
  const path = parts[1].split(/[?#]/)[0];
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // Le public_id est tout ce qui suit le segment de version (v1234567890).
  // L'uploader stocke `secure_url`, donc la version est toujours présente ;
  // le repli couvre les URLs porteuses de transformations (w_300,h_200/...).
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const idSegments =
    versionIndex !== -1
      ? segments.slice(versionIndex + 1)
      : segments[0].includes(",")
        ? segments.slice(1)
        : segments;

  if (idSegments.length === 0) return null;

  let publicId = idSegments.join("/");
  const lastDot = publicId.lastIndexOf(".");
  if (lastDot > 0) publicId = publicId.substring(0, lastDot);

  return publicId || null;
}

/**
 * Collecte récursivement toutes les URLs Cloudinary d'une valeur JSONB.
 *
 * Volontairement tolérant : les colonnes JSONB des vidéos stockent tantôt des
 * tableaux d'URLs (thumbnail_images, editing_resources), tantôt des objets. On
 * parcourt tout plutôt que de supposer une forme, pour ne rien laisser fuir.
 */
export function collectCloudinaryUrls(value: unknown): string[] {
  if (typeof value === "string") {
    return value.includes("cloudinary.com") ? [value] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectCloudinaryUrls);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectCloudinaryUrls);
  }
  return [];
}

async function destroyAsset(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  publicId: string
) {
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

  if (!res.ok) throw new Error(`Cloudinary a répondu ${res.status}`);

  const data = (await res.json().catch(() => null)) as { result?: string } | null;

  // "not found" est un succès de notre point de vue : l'asset n'occupe plus rien.
  if (data?.result !== "ok" && data?.result !== "not found") {
    throw new Error(data?.result || "réponse Cloudinary inattendue");
  }
}

/**
 * Supprime chez Cloudinary tous les assets référencés par ces URLs.
 *
 * Best-effort : n'échoue jamais, mais renvoie le détail pour journalisation.
 * Les URLs non-Cloudinary et les doublons sont ignorés.
 */
export async function deleteCloudinaryAssets(urls: string[]): Promise<CloudinaryPurgeResult> {
  const publicIds = [
    ...new Set(urls.map(extractPublicId).filter((id): id is string => id !== null)),
  ];

  if (publicIds.length === 0) return { deleted: 0, failed: [], skipped: false };

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      `[cloudinary] CLOUDINARY_API_KEY/SECRET absents : ${publicIds.length} asset(s) non supprimé(s)`
    );
    return { deleted: 0, failed: publicIds, skipped: true };
  }

  const results = await Promise.allSettled(
    publicIds.map((publicId) => destroyAsset(cloudName, apiKey, apiSecret, publicId))
  );

  const failed = publicIds.filter((_, i) => results[i].status === "rejected");

  if (failed.length > 0) {
    console.error(
      `[cloudinary] échec de suppression pour ${failed.length}/${publicIds.length} asset(s) :`,
      failed.join(", ")
    );
  }

  return { deleted: publicIds.length - failed.length, failed, skipped: false };
}
