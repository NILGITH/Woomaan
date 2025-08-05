import { supabase } from "@/integrations/supabase/client";

export const storageService = {
  async uploadCollectionImage(file: File): Promise<string> {
    if (!supabase) {
      throw new Error("Supabase client is not initialized.");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `collections/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
        throw new Error("Could not get public URL for uploaded image.");
    }

    return data.publicUrl;
  },
};
