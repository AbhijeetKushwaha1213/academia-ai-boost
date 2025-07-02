
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Zap } from 'lucide-react';
import { Flashcard } from '@/hooks/useFlashcards';

interface SpacedRepetitionProps {
  flashcards: Flashcard[];
  onUpdateCard: (id: string, correct: boolean) => void;
}

export const SpacedRepetitionSystem = ({ flashcards, onUpdateCard }: SpacedRepetitionProps) => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    streak: 0,
  });

  // Spaced repetition algorithm
  const calculateNextReview = (masteryLevel: number, correct: boolean) => {
    const baseIntervals = [1, 3, 7, 14, 30, 90]; // days
    let newLevel = correct ? Math.min(masteryLevel + 1, 5) : Math.max(masteryLevel - 1, 0);
    
    const intervalDays = baseIntervals[newLevel] || 90;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);
    
    return { newLevel, nextReview: nextReview.toISOString() };
  };

  const getDueCards = () => {
    const now = new Date();
    return flashcards.filter(card => {
      const nextReview = new Date(card.next_review || now);
      return nextReview <= now;
    }).sort((a, b) => {
      // Prioritize by mastery level (lower first) and then by due date
      if (a.mastery_level !== b.mastery_level) {
        return a.mastery_level - b.mastery_level;
      }
      return new Date(a.next_review || 0).getTime() - new Date(b.next_review || 0).getTime();
    });
  };

  const dueCards = getDueCards();

  useEffect(() => {
    if (dueCards.length > 0 && !currentCard) {
      setCurrentCard(dueCards[0]);
    }
  }, [dueCards, currentCard]);

  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    const { newLevel, nextReview } = calculateNextReview(currentCard.mastery_level, correct);
    
    onUpdateCard(currentCard.id, correct);
    
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (correct ? 1 : 0),
      streak: correct ? prev.streak + 1 : 0,
    }));

    // Move to next card
    const currentIndex = dueCards.findIndex(card => card.id === currentCard.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < dueCards.length) {
      setCurrentCard(dueCards[nextIndex]);
    } else {
      setCurrentCard(null);
    }
    
    setShowAnswer(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryBadge = (level: number) => {
    const labels = ['New', 'Learning', 'Familiar', 'Known', 'Mastered', 'Expert'];
    const colors = ['bg-gray-100', 'bg-red-100', 'bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];
    return { label: labels[level] || 'New', color: colors[level] || 'bg-gray-100' };
  };

  if (dueCards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">All caught up! 🎉</h3>
          <p className="text-gray-600">No cards are due for review right now. Check back later or create new flashcards.</p>
        </div>
      </Card>
    );
  }

  if (!currentCard) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Session Complete!</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Cards reviewed: {sessionStats.reviewed}</p>
            <p className="text-gray-600">Accuracy: {sessionStats.reviewed > 0 ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0}%</p>
            <p className="text-gray-600">Current streak: {sessionStats.streak}</p>
          </div>
        </div>
      </Card>
    );
  }

  const masteryBadge = getMasteryBadge(currentCard.mastery_level);
  const progress = ((sessionStats.reviewed) / Math.min(dueCards.length, 20)) * 100; // Cap at 20 cards per session

  return (
    <div className="space-y-6">
      {/* Session Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Session Progress</span>
          <span className="text-sm text-gray-600">{sessionStats.reviewed} / {Math.min(dueCards.length, 20)}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Accuracy: {sessionStats.reviewed > 0 ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0}%</span>
          <span>Streak: {sessionStats.streak}</span>
        </div>
      </Card>

      {/* Flashcard */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Card Header */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{currentCard.title}</h3>
            <div className="flex space-x-2">
              <Badge className={getDifficultyColor(currentCard.difficulty)}>
                {currentCard.difficulty}
              </Badge>
              <Badge className={masteryBadge.color}>
                {masteryBadge.label}
              </Badge>
            </div>
          </div>

          {/* Question */}
          <div className="min-h-[200px] flex flex-col justify-center">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Question:</h4>
              <p className="text-lg">{currentCard.question}</p>
            </div>

            {/* Answer (shown when revealed) */}
            {showAnswer && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Answer:</h4>
                <p className="text-lg">{currentCard.answer}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {currentCard.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {currentCard.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {!showAnswer ? (
          <Button onClick={() => setShowAnswer(true)} className="px-8">
            Show Answer
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleAnswer(false)}
              className="px-6 text-red-600 border-red-200 hover:bg-red-50"
            >
              Hard
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAnswer(true)}
              className="px-6 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            >
              Good
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              className="px-6 bg-green-600 hover:bg-green-700"
            >
              Easy
            </Button>
          </div>
        )}
      </div>

      {/* Next Review Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <Clock className="w-4 h-4" />
          <span>
            Review count: {currentCard.review_count || 0} | 
            Mastery level: {currentCard.mastery_level}/5
          </span>
        </div>
      </Card>
    </div>
  );
};
