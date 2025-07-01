
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Play, Edit, Trash2, BookOpen } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { CreateFlashcardDialog } from './CreateFlashcardDialog';
import { FlashcardReview } from './FlashcardReview';

export const FlashcardVault = () => {
  const { flashcards, isLoading, deleteFlashcard, updateFlashcard } = useFlashcards();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(null);

  const filteredFlashcards = flashcards.filter((card) => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => card.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(flashcards.flatMap(card => card.tags)));

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
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteFlashcard(card.id)}>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flashcard Vault</h1>
          <p className="text-gray-600">
            {flashcards.length} flashcards • {filteredFlashcards.length} showing
          </p>
        </div>
        <div className="flex space-x-2">
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
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {allTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Filter by Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Flashcards Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading flashcards...</div>
      ) : filteredFlashcards.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No flashcards found</h3>
          <p className="text-gray-600 mb-4">
            {flashcards.length === 0 
              ? "Create your first flashcard to get started!"
              : "Try adjusting your search or filters."}
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
                  <Badge className={getDifficultyColor(card.difficulty)} size="sm">
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

                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {card.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                    {card.tags.length > 3 && (
                      <Badge variant="outline" size="sm">
                        +{card.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
