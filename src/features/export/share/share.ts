import { brand } from "@/lib/brand";

export type ShareResult = "shared" | "unsupported" | "aborted";

export async function shareStrip(blob: Blob, filename: string): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  if (typeof navigator.share !== "function" || typeof navigator.canShare !== "function") {
    return "unsupported";
  }
  if (!navigator.canShare({ files: [file] })) return "unsupported";

  try {
    await navigator.share({
      files: [file],
      title: brand.name,
    });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "aborted";
    throw error;
  }
}
