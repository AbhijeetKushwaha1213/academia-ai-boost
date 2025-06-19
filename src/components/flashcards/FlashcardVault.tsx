
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter, BookOpen, Brain, Star, Play, Edit, Trash2 } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { CreateFlashcardDialog } from './CreateFlashcardDialog';
import { FlashcardReview } from './FlashcardReview';

export const FlashcardVault = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('vault');
  
  const { 
    flashcards, 
    isLoading, 
    deleteFlashcard, 
    updateFlashcard, 
    isDeleting 
  } = useFlashcards();

  // Filter flashcards based on search and difficulty
  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || card.difficulty === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Get cards that are due for review (simplified logic)
  const dueForReview = flashcards.filter(card => 
    !card.last_reviewed || 
    new Date(card.next_review) <= new Date()
  );

  const difficultyFilters = ['all', 'easy', 'medium', 'hard'];

  const handleUpdateMastery = (id: string, correct: boolean) => {
    const card = flashcards.find(c => c.id === id);
    if (!card) return;

    const newMasteryLevel = correct 
      ? Math.min(card.mastery_level + 1, 5)
      : Math.max(card.mastery_level - 1, 0);

    updateFlashcard({
      id,
      updates: {
        mastery_level: newMasteryLevel,
        review_count: card.review_count + 1,
        last_reviewed: new Date().toISOString(),
        next_review: new Date(Date.now() + (correct ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000)).toISOString()
      }
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'hard': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getMasteryPercentage = (level: number) => (level / 5) * 100;

  const averageMastery = flashcards.length > 0 
    ? Math.round((flashcards.reduce((sum, card) => sum + card.mastery_level, 0) / flashcards.length / 5) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="vault">Vault</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          <CreateFlashcardDialog>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </CreateFlashcardDialog>
        </div>

        <TabsContent value="vault" className="space-y-6">
          {/* Search and Filters */}
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

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {difficultyFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="whitespace-nowrap"
                >
                  {filter === 'all' ? 'All Difficulties' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{flashcards.length}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Brain className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{averageMastery}%</div>
              <div className="text-sm text-gray-600">Avg Mastery</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{dueForReview.length}</div>
              <div className="text-sm text-gray-600">Due Today</div>
            </Card>
          </div>

          {/* Flashcards List */}
          <div className="space-y-4">
            {filteredFlashcards.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">
                  {flashcards.length === 0 
                    ? "No flashcards yet. Create your first one!" 
                    : "No flashcards match your search."}
                </p>
              </Card>
            ) : (
              filteredFlashcards.map((card) => (
                <Card key={card.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{card.question}</p>
                      <div className="flex items-center space-x-3">
                        <Badge className={getDifficultyColor(card.difficulty)}>
                          {card.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Reviewed {card.review_count} times
                        </span>
                        {card.last_reviewed && (
                          <span className="text-sm text-gray-500">
                            Last: {new Date(card.last_reviewed).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {getMasteryPercentage(card.mastery_level)}%
                      </div>
                      <div className="text-sm text-gray-500">Mastery</div>
                    </div>
                  </div>

                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteFlashcard(card.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          {dueForReview.length === 0 ? (
            <Card className="p-8 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No flashcards are due for review right now.</p>
            </Card>
          ) : (
            <FlashcardReview 
              flashcards={dueForReview} 
              onUpdateMastery={handleUpdateMastery}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
