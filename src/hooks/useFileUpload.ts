
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  bucket: string;
  folder?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    options: UploadOptions
  ): Promise<string | null> => {
    const {
      bucket,
      folder = '',
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/*', 'application/pdf', 'text/*']
    } = options;

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize / 1024 / 1024}MB`,
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: "Please select a supported file type",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      
      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      });

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (bucket: string, filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      toast({
        title: "File deleted",
        description: "File has been deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const getFileUrl = (bucket: string, filePath: string): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    uploading,
    progress
  };
};
