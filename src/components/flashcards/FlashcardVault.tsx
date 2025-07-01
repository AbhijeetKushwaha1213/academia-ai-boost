
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFlashcards } from '@/hooks/useFlashcards';
import { CreateFlashcardDialog } from './CreateFlashcardDialog';
import { FlashcardReview } from './FlashcardReview';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Brain, 
  FileQuestion, 
  GitBranch, 
  FileText,
  Search, 
  Filter, 
  Play, 
  Edit, 
  Trash2,
  Plus
} from 'lucide-react';

interface StudyMaterial {
  id: string;
  type: 'flashcards' | 'mindmaps' | 'quizzes' | 'diagrams' | 'notes';
  title: string;
  content: any;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  tags?: string[];
}

interface ExtendedFlashcard {
  id: string;
  title: string;
  question: string;
  answer: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  mastery_level: number;
  review_count: number;
  last_reviewed: string | null;
  next_review: string;
  created_at: string;
  updated_at: string;
  topic?: string;
}

export const FlashcardVault = () => {
  const { flashcards, isLoading, deleteFlashcard } = useFlashcards();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [activeTab, setActiveTab] = useState('flashcards');

  // Load study materials from localStorage
  useEffect(() => {
    const materials = JSON.parse(localStorage.getItem('studyMaterials') || '[]');
    setStudyMaterials(materials);
  }, []);

  const materialIcons = {
    flashcards: BookOpen,
    mindmaps: Brain,
    quizzes: FileQuestion,
    diagrams: GitBranch,
    notes: FileText
  };

  const filterMaterials = (materials: any[], type: string) => {
    let filtered = materials;
    
    if (type !== 'all') {
      filtered = materials.filter(material => material.type === type);
    }

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (material.topic && material.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (material.question && material.question.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(material => material.difficulty === difficultyFilter);
    }

    if (topicFilter !== 'all') {
      filtered = filtered.filter(material => {
        if (material.topic === topicFilter) return true;
        if (material.tags && material.tags.includes(topicFilter)) return true;
        return false;
      });
    }

    return filtered;
  };

  const getFilteredFlashcards = () => {
    return filterMaterials(flashcards, 'flashcards');
  };

  const getFilteredMaterials = (type: string) => {
    return filterMaterials(studyMaterials, type);
  };

  const handleDeleteMaterial = (materialId: string, type: string) => {
    if (type === 'flashcards') {
      deleteFlashcard(materialId);
    } else {
      const updatedMaterials = studyMaterials.filter(m => m.id !== materialId);
      setStudyMaterials(updatedMaterials);
      localStorage.setItem('studyMaterials', JSON.stringify(updatedMaterials));
      toast({
        title: "Material Deleted",
        description: "Study material has been removed successfully.",
      });
    }
  };

  const renderMaterialCard = (material: any, type: string) => {
    const IconComponent = materialIcons[type as keyof typeof materialIcons] || BookOpen;
    
    return (
      <Card key={material.id} className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <IconComponent className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900">{material.title}</h3>
              <Badge variant="outline" className="text-xs">
                {material.difficulty}
              </Badge>
            </div>
            
            {/* Render preview based on type */}
            {type === 'flashcards' && (
              <div className="text-sm text-gray-600 mb-3">
                <p><strong>Q:</strong> {material.question?.substring(0, 100)}...</p>
              </div>
            )}
            
            {type === 'mindmaps' && (
              <div className="text-sm text-gray-600 mb-3">
                <p><strong>Central Topic:</strong> {material.content?.central_topic}</p>
                <p><strong>Branches:</strong> {material.content?.branches?.length || 0} main branches</p>
              </div>
            )}
            
            {type === 'quizzes' && (
              <div className="text-sm text-gray-600 mb-3">
                <p><strong>Q:</strong> {material.content?.question?.substring(0, 100)}...</p>
              </div>
            )}
            
            {type === 'diagrams' && (
              <div className="text-sm text-gray-600 mb-3">
                <p><strong>Components:</strong> {material.content?.components?.join(', ')}</p>
              </div>
            )}
            
            {type === 'notes' && (
              <div className="text-sm text-gray-600 mb-3">
                <p>{material.content?.content?.substring(0, 150)}...</p>
              </div>
            )}
            
            {material.tags && material.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {material.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {type === 'flashcards' && (
              <Button size="sm" variant="outline" onClick={() => setShowReview(true)}>
                <Play className="w-3 h-3" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleDeleteMaterial(material.id, type)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const getUniqueTopics = () => {
    const allMaterials = [...flashcards, ...studyMaterials];
    const topics = new Set<string>();
    
    allMaterials.forEach(material => {
      if ('topic' in material && material.topic) topics.add(material.topic);
      if ('tags' in material && material.tags) {
        material.tags.forEach((tag: string) => topics.add(tag));
      }
    });
    
    return Array.from(topics);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Material Vault</h1>
          <p className="text-gray-600">Manage your flashcards, mind maps, quizzes, and notes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Flashcard
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {getUniqueTopics().map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="flashcards" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Flashcards</span>
          </TabsTrigger>
          <TabsTrigger value="mindmaps" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Mind Maps</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center space-x-2">
            <FileQuestion className="w-4 h-4" />
            <span>Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="diagrams" className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>Diagrams</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredFlashcards().length > 0 ? (
              getFilteredFlashcards().map(flashcard => renderMaterialCard(flashcard, 'flashcards'))
            ) : (
              <div className="col-span-full text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No flashcards found. Create your first flashcard!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mindmaps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMaterials('mindmaps').length > 0 ? (
              getFilteredMaterials('mindmaps').map(material => renderMaterialCard(material, 'mindmaps'))
            ) : (
              <div className="col-span-full text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No mind maps found. Generate some using the AI Study Material Generator!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMaterials('quizzes').length > 0 ? (
              getFilteredMaterials('quizzes').map(material => renderMaterialCard(material, 'quizzes'))
            ) : (
              <div className="col-span-full text-center py-8">
                <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quizzes found. Generate some using the AI Study Material Generator!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="diagrams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMaterials('diagrams').length > 0 ? (
              getFilteredMaterials('diagrams').map(material => renderMaterialCard(material, 'diagrams'))
            ) : (
              <div className="col-span-full text-center py-8">
                <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No diagrams found. Generate some using the AI Study Material Generator!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMaterials('notes').length > 0 ? (
              getFilteredMaterials('notes').map(material => renderMaterialCard(material, 'notes'))
            ) : (
              <div className="col-span-full text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notes found. Generate some using the AI Study Material Generator!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateFlashcardDialog>
        <Button className="hidden">Create</Button>
      </CreateFlashcardDialog>
      
      {showReview && (
        <FlashcardReview 
          flashcards={getFilteredFlashcards()} 
          onUpdateMastery={(id: string, correct: boolean) => {
            console.log('Update mastery:', id, correct);
            setShowReview(false);
          }}
        />
      )}
    </div>
  );
};
