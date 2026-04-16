"use client";

import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

/**
 * Uploads a file to a Supabase bucket.
 * @param file The file to upload.
 * @param bucket The name of the bucket (e.g., 'media').
 * @param path The path within the bucket (e.g., 'thumbnails/session-1.png').
 * @returns The public URL of the uploaded file.
 */
export async function uploadFile(file: File, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      cacheControl: '3600'
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
