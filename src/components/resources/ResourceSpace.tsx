
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Filter, FileText, Video, Github, Twitter, Link, Folder, X } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'note' | 'file' | 'youtube' | 'github' | 'twitter' | 'article' | 'pdf';
  url?: string;
  content?: string;
  tags: string[];
  folder?: string;
  created_at: string;
}

export const ResourceSpace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);

  // Form state
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'note' as Resource['type'],
    url: '',
    content: '',
    tags: [] as string[],
    folder: ''
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (user?.user_id) {
      fetchResources();
    }
  }, [user?.user_id]);

  const fetchResources = async () => {
    if (!user?.user_id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_resources')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setResources(data || []);
      
      // Extract unique folders
      const uniqueFolders = [...new Set(data?.map(r => r.folder).filter(Boolean) || [])];
      setFolders(uniqueFolders);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResource = async () => {
    if (!user?.user_id || !newResource.title) return;

    try {
      const { error } = await supabase
        .from('user_resources')
        .insert({
          user_id: user.user_id,
          title: newResource.title,
          description: newResource.description,
          type: newResource.type,
          url: newResource.url,
          content: newResource.content,
          tags: newResource.tags,
          folder: newResource.folder
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource added successfully!",
      });

      setNewResource({
        title: '',
        description: '',
        type: 'note',
        url: '',
        content: '',
        tags: [],
        folder: ''
      });
      setShowAddDialog(false);
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newResource.tags.includes(newTag.trim())) {
      setNewResource({
        ...newResource,
        tags: [...newResource.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'note': return <FileText className="w-5 h-5" />;
      case 'youtube': return <Video className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      default: return <Link className="w-5 h-5" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesFolder = selectedFolder === 'all' || resource.folder === selectedFolder;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Space</h1>
          <p className="text-gray-600">Your personal content vault</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="Resource title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={newResource.type} onValueChange={(value: Resource['type']) => setNewResource({...newResource, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>

              {(newResource.type !== 'note') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">URL</label>
                  <Input
                    value={newResource.url}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              )}

              {newResource.type === 'note' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                    placeholder="Your notes..."
                    rows={4}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Folder</label>
                  <Input
                    value={newResource.folder}
                    onChange={(e) => setNewResource({...newResource, folder: e.target.value})}
                    placeholder="Optional folder name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {newResource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>#{tag}</span>
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>
                  Add Resource
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
            </SelectContent>
          </Select>

          {folders.length > 0 && (
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-40">
                <Folder className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getResourceIcon(resource.type)}
                <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {resource.type}
              </Badge>
            </div>
            
            {resource.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
            )}
            
            {resource.folder && (
              <div className="flex items-center space-x-1 mb-2">
                <Folder className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{resource.folder}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              {resource.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Yet</h3>
          <p className="text-gray-600 mb-4">
            Start building your personal content vault by adding your first resource!
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </Card>
      )}
    </div>
  );
};
