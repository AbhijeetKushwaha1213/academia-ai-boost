import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFileUpload } from '../../hooks/useFileUpload';
import { Upload, Camera, FileText, Trash2, Check, AlertCircle } from 'lucide-react';

const ProfileUpload: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { uploading, uploadProgress, uploadFile, deleteFile, getUserFiles } = useFileUpload();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarPreview(profile.avatar_url);
    }
    loadUserFiles();
  }, [profile]);

  const loadUserFiles = async () => {
    const files = await getUserFiles('document');
    setDocuments(files);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const result = await uploadFile(file, 'avatars', 'avatar');
      await updateProfile({ avatar_url: result.url });
      setAvatarPreview(result.url);
      setUploadStatus('success');
      
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      console.error('Avatar upload error:', error);
      setUploadStatus('error');
      alert('Failed to upload avatar. Please try again.');
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadStatus('error');
      alert('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      alert('File size must be less than 10MB');
      return;
    }

    try {
      const result = await uploadFile(file, 'documents');
      await loadUserFiles();
      setUploadStatus('success');
      
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      console.error('Document upload error:', error);
      setUploadStatus('error');
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleDeleteDocument = async (document: any) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteFile(document.file_path, 'documents');
      await loadUserFiles();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile & Files</h2>
        <p className="text-gray-600">Upload your profile picture and documents</p>
      </div>

      {/* Upload Status */}
      {uploadStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          uploadStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {getStatusIcon()}
          <span>
            {uploadStatus === 'success' ? 'Upload successful!' : 'Upload failed. Please try again.'}
          </span>
        </div>
      )}

      {/* Avatar Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="text-white text-sm font-medium">
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </button>
            
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
        
        <div className="mb-6">
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf"
            onChange={handleDocumentUpload}
            className="hidden"
          />
          
          <button
            onClick={() => documentInputRef.current?.click()}
            disabled={uploading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
          
          <p className="text-sm text-gray-500 mt-2">
            PDF files up to 10MB
          </p>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{document.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(document.file_size)} • {new Date(document.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const { data } = supabase.storage
                        .from('documents')
                        .getPublicUrl(document.file_path);
                      window.open(data.publicUrl, '_blank');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(document)}
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUpload;