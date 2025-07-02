
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Play, Edit, Trash2, BookOpen, Brain, FileQuestion, GitBranch, FileText } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useStudyMaterials, MaterialType } from '@/hooks/useStudyMaterials';
import { CreateFlashcardDialog } from './CreateFlashcardDialog';
import { FlashcardReview } from './FlashcardReview';

export const FlashcardVault = () => {
  const { flashcards, isLoading, deleteFlashcard, updateFlashcard } = useFlashcards();
  const { materials, isLoading: materialsLoading, deleteMaterial } = useStudyMaterials();
  const [activeTab, setActiveTab] = useState<'flashcards' | MaterialType>('flashcards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  // Filter flashcards
  const filteredFlashcards = flashcards.filter((card) => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => card.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Filter materials by active tab
  const filteredMaterials = materials.filter((material) => {
    if (activeTab === 'flashcards') return false; // Don't show materials in flashcard tab
    if (material.type !== activeTab) return false;
    
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const allTags = Array.from(new Set(flashcards.flatMap(card => card.tags)));

  const materialIcons = {
    mindmaps: Brain,
    quizzes: FileQuestion,
    diagrams: GitBranch,
    notes: FileText,
    flashcards: BookOpen,
  };

  const handleStartReview = () => {
    if (filteredFlashcards.length > 0) {
      setShowReviewMode(true);
    }
  };

  const handleUpdateMastery = (id: string, correct: boolean) => {
    const card = flashcards.find(c => c.id === id);
    if (card) {
      const newMasteryLevel = correct 
        ? Math.min(card.mastery_level + 1, 5)
        : Math.max(card.mastery_level - 1, 0);
      
      updateFlashcard({
        id,
        updates: {
          mastery_level: newMasteryLevel,
          review_count: card.review_count + 1,
          last_reviewed: new Date().toISOString(),
        }
      });
    }
  };

  const handleViewFlashcard = (id: string) => {
    setSelectedFlashcard(id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showReviewMode) {
    return (
      <FlashcardReview
        flashcards={filteredFlashcards}
        onUpdateMastery={handleUpdateMastery}
        onClose={() => setShowReviewMode(false)}
      />
    );
  }

  if (selectedFlashcard) {
    const card = flashcards.find(c => c.id === selectedFlashcard);
    if (card) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedFlashcard(null)}>
              ← Back to Vault
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={() => deleteFlashcard(card.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{card.title}</h1>
                <div className="flex space-x-2">
                  <Badge className={getDifficultyColor(card.difficulty)}>
                    {card.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <span className={getMasteryColor(card.mastery_level)}>
                      Mastery: {card.mastery_level}/5
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Question:</h3>
                  <p className="text-gray-700">{card.question}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                  <p className="text-gray-700">{card.answer}</p>
                </div>

                {card.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">#{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      );
    }
  }

  // Material detail view
  if (selectedMaterial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedMaterial(null)}>
            ← Back to Library
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => deleteMaterial(selectedMaterial.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{selectedMaterial.title}</h1>
              <div className="flex space-x-2">
                <Badge className={getDifficultyColor(selectedMaterial.difficulty)}>
                  {selectedMaterial.difficulty}
                </Badge>
                <Badge variant="outline">
                  {selectedMaterial.type}
                </Badge>
              </div>
            </div>

            {/* Render content based on type */}
            <div className="space-y-4">
              {selectedMaterial.type === 'flashcards' && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Question:</h3>
                    <p className="text-gray-700">{selectedMaterial.content.question}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                    <p className="text-gray-700">{selectedMaterial.content.answer}</p>
                  </div>
                </>
              )}

              {selectedMaterial.type === 'quizzes' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Question:</h3>
                  <p className="text-gray-700 mb-4">{selectedMaterial.content.question}</p>
                  <div className="space-y-2">
                    {selectedMaterial.content.options?.map((option: string, index: number) => (
                      <div key={index} className={`p-3 rounded border ${index === selectedMaterial.content.correct_answer ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                        {option} {index === selectedMaterial.content.correct_answer && '✓'}
                      </div>
                    ))}
                  </div>
                  {selectedMaterial.content.explanation && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <p className="text-gray-700">{selectedMaterial.content.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedMaterial.type === 'mindmaps' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Central Topic:</h3>
                  <p className="text-gray-700 mb-4">{selectedMaterial.content.central_topic}</p>
                  <h3 className="text-lg font-semibold mb-2">Branches:</h3>
                  <div className="space-y-3">
                    {selectedMaterial.content.branches?.map((branch: any, index: number) => (
                      <div key={index} className="p-3 border rounded">
                        <h4 className="font-medium">{branch.title}</h4>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                          {branch.subtopics?.map((subtopic: string, subIndex: number) => (
                            <li key={subIndex}>{subtopic}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMaterial.type === 'notes' && (
                <div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMaterial.content.content}</p>
                  </div>
                  {selectedMaterial.content.key_points && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Key Points:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedMaterial.content.key_points.map((point: string, index: number) => (
                          <li key={index} className="text-gray-700">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedMaterial.type === 'diagrams' && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Components:</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedMaterial.content.components?.map((component: string, index: number) => (
                      <div key={index} className="p-3 border rounded bg-blue-50">
                        {component}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Relationships:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMaterial.content.relationships?.map((rel: string, index: number) => (
                      <li key={index} className="text-gray-700">{rel}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Library</h1>
          <p className="text-gray-600">
            {flashcards.length + materials.length} items total
          </p>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'flashcards' && (
            <>
              <Button onClick={handleStartReview} disabled={filteredFlashcards.length === 0}>
                <Play className="w-4 h-4 mr-2" />
                Start Review
              </Button>
              <CreateFlashcardDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flashcard
                </Button>
              </CreateFlashcardDialog>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
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

        <TabsContent value="flashcards" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading flashcards...</div>
          ) : filteredFlashcards.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No flashcards found</h3>
              <p className="text-gray-600 mb-4">
                {flashcards.length === 0 
                  ? "Create your first flashcard to get started!"
                  : "Try adjusting your search."}
              </p>
              <CreateFlashcardDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flashcard
                </Button>
              </CreateFlashcardDialog>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlashcards.map((card) => (
                <Card 
                  key={card.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewFlashcard(card.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm line-clamp-2">{card.title}</h3>
                      <Badge className={getDifficultyColor(card.difficulty)}>
                        {card.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{card.question}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className={getMasteryColor(card.mastery_level)}>
                        Mastery: {card.mastery_level}/5
                      </span>
                      <span>Reviewed {card.review_count} times</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {['mindmaps', 'quizzes', 'diagrams', 'notes'].map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            {materialsLoading ? (
              <div className="text-center py-8">Loading {type}...</div>
            ) : filteredMaterials.length === 0 ? (
              <Card className="p-8 text-center">
                {React.createElement(materialIcons[type as keyof typeof materialIcons], { 
                  className: "w-12 h-12 mx-auto mb-4 text-gray-400" 
                })}
                <h3 className="text-lg font-semibold mb-2">No {type} found</h3>
                <p className="text-gray-600 mb-4">
                  Generate some {type} using the AI Generator to get started!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMaterials.map((material) => (
                  <Card 
                    key={material.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm line-clamp-2">{material.title}</h3>
                        <Badge className={getDifficultyColor(material.difficulty)}>
                          {material.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{material.topic}</p>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(material.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
