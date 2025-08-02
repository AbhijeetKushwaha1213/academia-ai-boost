
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Flame, Star, ChevronRight, BookOpen } from 'lucide-react';
import { FixStatusCard } from './common/FixStatusCard';

export const Dashboard = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Personal
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Dashboard</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay on top of your studies with real-time progress tracking and personalized insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Good morning, Abhijeet! 👋</h3>
                  <p className="text-indigo-100">Ready to conquer today's study goals?</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">Day 47</div>
                  <div className="text-indigo-200 text-sm">Study Streak</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">2h 30m</div>
                  <div className="text-indigo-200 text-sm">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-indigo-200 text-sm">Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-indigo-200 text-sm">Weekly Goal</div>
                </div>
              </div>
            </Card>

            {/* Today's Plan */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Today's Study Plan</h3>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Physics - Thermodynamics</h4>
                    <p className="text-sm text-gray-600">Laws of thermodynamics & heat engines</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                </div>

                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Chemistry - Organic Reactions</h4>
                    <p className="text-sm text-gray-600">SN1 and SN2 mechanisms</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-4">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Math - Calculus Practice</h4>
                    <p className="text-sm text-gray-600">Integration by parts</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Study Time</span>
                    <span className="font-medium">18h / 20h</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Topics Covered</span>
                    <span className="font-medium">12 / 15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Practice Tests</span>
                    <span className="font-medium">3 / 4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Streak Card */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="text-center">
                <Flame className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-1">47 Days</h3>
                <p className="text-gray-600 mb-4">Study Streak 🔥</p>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Keep Going!
                </Button>
              </div>
            </Card>

            {/* Fix Status Card */}
            <FixStatusCard />

            {/* Achievement Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievement</h3>
              <div className="text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Physics Master</h4>
                <p className="text-sm text-gray-600 mb-4">Completed 100 physics problems!</p>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View All Badges
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
