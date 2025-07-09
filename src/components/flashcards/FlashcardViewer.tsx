
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, Lightbulb } from 'lucide-react';

interface FlashcardData {
  question: string;
  answer: string;
  hint?: string;
}

interface FlashcardViewerProps {
  flashcards: FlashcardData[];
  title: string;
  difficulty: string;
  onClose?: () => void;
}

export const FlashcardViewer = ({ flashcards, title, difficulty, onClose }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentCard = flashcards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
    setShowHint(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
    setShowHint(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!flashcards.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {onClose && (
            <Button variant="outline" onClick={onClose} className="mb-6">
              ← Back to Vault
            </Button>
          )}
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No flashcards available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <Badge className={`${getDifficultyColor(difficulty)} border`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                {currentIndex + 1} of {flashcards.length}
              </span>
            </div>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              ← Back to Vault
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / flashcards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center">
          <div 
            className="relative w-full max-w-3xl h-96 cursor-pointer perspective-1000"
            onClick={flipCard}
          >
            <div className={`absolute inset-0 transition-transform duration-700 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              {/* Front Side - Question */}
              <Card className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:shadow-xl transition-all duration-300 backface-hidden">
                <div className="text-center space-y-6 w-full">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                    Question
                  </div>
                  <p className="text-xl lg:text-2xl font-semibold text-gray-900 leading-relaxed max-w-2xl mx-auto">
                    {currentCard.question}
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Click to reveal answer</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Back Side - Answer */}
              <Card className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 hover:shadow-xl transition-all duration-300 backface-hidden rotate-y-180">
                <div className="text-center space-y-6 w-full">
                  <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
                    Answer
                  </div>
                  <p className="text-lg lg:text-xl text-gray-900 leading-relaxed max-w-2xl mx-auto">
                    {currentCard.answer}
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Click to see question</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Hint Section */}
        {currentCard.hint && (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Need a hint?'}
              </Button>
              {showHint && (
                <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">Hint</h4>
                      <p className="text-yellow-700">{currentCard.hint}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-lg border">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={flashcards.length <= 1}
              className="px-6"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setIsFlipped(false);
                setShowHint(false);
              }}
              className="px-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="default"
              onClick={flipCard}
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isFlipped ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isFlipped ? 'Show Question' : 'Show Answer'}
            </Button>

            <Button
              variant="outline"
              onClick={nextCard}
              disabled={flashcards.length <= 1}
              className="px-6"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
