import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useFileUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    bucket: 'avatars' | 'documents',
    path?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${path || Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Save file info to database
      const { data: fileData, error: dbError } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: uploadData.path,
          file_type: file.type,
          file_size: file.size,
          upload_type: bucket === 'avatars' ? 'avatar' : 'document'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadProgress(100);
      return { url: publicUrl, data: fileData };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const deleteFile = async (filePath: string, bucket: 'avatars' | 'documents') => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_files')
        .delete()
        .eq('file_path', filePath)
        .eq('user_id', user.id);

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const getUserFiles = async (uploadType?: 'avatar' | 'document') => {
    if (!user) return [];

    try {
      let query = supabase
        .from('user_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (uploadType) {
        query = query.eq('upload_type', uploadType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadFile,
    deleteFile,
    getUserFiles
  };
};