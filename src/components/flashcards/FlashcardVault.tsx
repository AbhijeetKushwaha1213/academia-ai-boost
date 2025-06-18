
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, BookOpen, Brain, Star } from 'lucide-react';

export const FlashcardVault = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const flashcards = [
    {
      id: 1,
      question: "What is the photoelectric effect?",
      subject: "Physics",
      difficulty: "Medium",
      lastReviewed: "2 days ago",
      mastery: 85,
      tags: ["quantum", "light", "electrons"]
    },
    {
      id: 2,
      question: "Explain SN1 reaction mechanism",
      subject: "Chemistry", 
      difficulty: "Hard",
      lastReviewed: "1 day ago",
      mastery: 65,
      tags: ["organic", "mechanisms", "nucleophile"]
    },
    {
      id: 3,
      question: "Find the derivative of sin(x²)",
      subject: "Mathematics",
      difficulty: "Easy",
      lastReviewed: "Today",
      mastery: 95,
      tags: ["calculus", "derivatives", "trigonometry"]
    }
  ];

  const subjects = ['all', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Flashcard Vault</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>

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
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={selectedFilter === subject ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(subject)}
              className="whitespace-nowrap"
            >
              {subject === 'all' ? 'All Subjects' : subject}
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
          <div className="text-2xl font-bold text-gray-900">156</div>
          <div className="text-sm text-gray-600">Total Cards</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Brain className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">89%</div>
          <div className="text-sm text-gray-600">Avg Mastery</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-600">Due Today</div>
        </Card>
      </div>

      {/* Flashcards List */}
      <div className="space-y-4">
        {flashcards.map((card) => (
          <Card key={card.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{card.question}</h3>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{card.subject}</Badge>
                  <Badge variant={
                    card.difficulty === 'Easy' ? 'default' :
                    card.difficulty === 'Medium' ? 'secondary' : 'destructive'
                  }>
                    {card.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Reviewed {card.lastReviewed}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{card.mastery}%</div>
                <div className="text-sm text-gray-500">Mastery</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {card.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                Review
              </Button>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start">
            <Brain className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
          <Button variant="outline" className="justify-start">
            <BookOpen className="w-4 h-4 mr-2" />
            Import Notes
          </Button>
        </div>
      </Card>
    </div>
  );
};
