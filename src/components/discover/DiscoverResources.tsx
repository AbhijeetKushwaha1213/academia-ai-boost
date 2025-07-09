
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Star, 
  Download,
  ExternalLink,
  Filter,
  Bookmark,
  TrendingUp
} from 'lucide-react';

interface DiscoverResourcesProps {
  onNavigate: (tab: string) => void;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'course' | 'article' | 'tool';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  author: string;
  url: string;
  tags: string[];
  isFree: boolean;
  thumbnail?: string;
}

export const DiscoverResources = ({ onNavigate }: DiscoverResourcesProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);

  // Mock data for demonstration
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Complete React.js Course',
      description: 'Master React.js from basics to advanced concepts with hands-on projects.',
      type: 'course',
      category: 'Programming',
      difficulty: 'intermediate',
      rating: 4.8,
      downloads: 1250,
      author: 'Tech Academy',
      url: 'https://example.com/react-course',
      tags: ['React', 'JavaScript', 'Frontend'],
      isFree: false,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Physics Formula Sheet',
      description: 'Comprehensive collection of physics formulas for JEE/NEET preparation.',
      type: 'document',
      category: 'Physics',
      difficulty: 'intermediate',
      rating: 4.6,
      downloads: 3500,
      author: 'Physics Hub',
      url: 'https://example.com/physics-formulas',
      tags: ['Physics', 'Formulas', 'JEE', 'NEET'],
      isFree: true
    },
    {
      id: '3',
      title: 'Data Structures Visualization',
      description: 'Interactive tool to visualize and understand data structures.',
      type: 'tool',
      category: 'Computer Science',
      difficulty: 'beginner',
      rating: 4.9,
      downloads: 890,
      author: 'CS Tools',
      url: 'https://example.com/ds-visualizer',
      tags: ['Data Structures', 'Visualization', 'CS'],
      isFree: true
    },
    {
      id: '4',
      title: 'Calculus Made Easy',
      description: 'Step-by-step video tutorials explaining calculus concepts.',
      type: 'video',
      category: 'Mathematics',
      difficulty: 'beginner',
      rating: 4.7,
      downloads: 2100,
      author: 'Math Simplified',
      url: 'https://example.com/calculus-videos',
      tags: ['Calculus', 'Mathematics', 'Tutorial'],
      isFree: true
    }
  ];

  useEffect(() => {
    // Simulate loading resources
    const loadResources = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter resources based on user type
      let filteredResources = mockResources;
      if (user?.user_type === 'exam') {
        filteredResources = mockResources.filter(resource => 
          resource.category === 'Physics' || 
          resource.category === 'Mathematics' ||
          resource.tags.includes(user.exam_type || '')
        );
      } else if (user?.user_type === 'college') {
        filteredResources = mockResources.filter(resource => 
          resource.category === 'Programming' || 
          resource.category === 'Computer Science'
        );
      }
      
      setResources(filteredResources);
      setLoading(false);
    };

    loadResources();
  }, [user]);

  const categories = [
    'all',
    'Programming',
    'Mathematics',
    'Physics',
    'Computer Science',
    'Chemistry',
    'Biology'
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'tool': return <TrendingUp className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Resources</h1>
          <p className="text-gray-600 mt-1">
            Find study materials, courses, and tools for your learning journey
          </p>
        </div>
        <Button onClick={() => onNavigate('resources')}>
          <Bookmark className="w-4 h-4 mr-2" />
          My Resources
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources, courses, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(resource.id)}
                >
                  <Bookmark 
                    className={`w-4 h-4 ${bookmarkedResources.includes(resource.id) ? 'fill-current' : ''}`} 
                  />
                </Button>
              </div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription className="text-sm">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    <span className="text-sm text-gray-600">{resource.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {resource.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resource.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {resource.author}</span>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{resource.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {resource.isFree && (
                      <Badge variant="outline" className="text-green-600">
                        Free
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" asChild>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">
            Try adjusting your search or browse different categories
          </p>
        </div>
      )}

      {/* Recommended Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>
            Based on your study profile and interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.slice(0, 2).map(resource => (
              <div key={resource.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{resource.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{resource.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
