
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Target, BookOpen } from 'lucide-react';
import { format, isSameDay, startOfDay } from 'date-fns';
import { useStudySessions } from '@/hooks/useStudySessions';
import { CreateSessionDialog } from './CreateSessionDialog';

export const StudyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { studySessions, isLoading } = useStudySessions();

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter(session => 
      isSameDay(new Date(session.session_date), date)
    );
  };

  const getTotalHoursForDate = (date: Date) => {
    const sessions = getSessionsForDate(date);
    return sessions.reduce((total, session) => total + (session.duration_minutes / 60), 0);
  };

  const selectedDateSessions = getSessionsForDate(selectedDate);
  const totalHours = getTotalHoursForDate(selectedDate);

  const renderCalendarDay = (day: Date) => {
    const sessions = getSessionsForDate(day);
    const hasStudySession = sessions.length > 0;
    
    return (
      <div className="relative">
        {hasStudySession && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Study Calendar</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border-0"
            components={{
              Day: ({ date }) => (
                <div className="relative p-2">
                  <span>{format(date, 'd')}</span>
                  {renderCalendarDay(date)}
                </div>
              )
            }}
          />
        </Card>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <Badge variant={totalHours > 0 ? "default" : "outline"}>
                {totalHours.toFixed(1)}h studied
              </Badge>
            </div>

            {selectedDateSessions.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {session.session_type}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.duration_minutes}min
                      </div>
                    </div>
                    
                    {session.topics_covered && session.topics_covered.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {session.topics_covered.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {session.flashcards_reviewed > 0 && (
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {session.flashcards_reviewed} flashcards
                        {session.correct_answers > 0 && (
                          <span className="ml-2 text-green-600">
                            {Math.round((session.correct_answers / session.flashcards_reviewed) * 100)}% correct
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No study sessions scheduled for this day</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Schedule a Session
                </Button>
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h4 className="font-semibold mb-3">This Week</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sessions</span>
                <span className="font-medium">{studySessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Hours</span>
                <span className="font-medium">
                  {(studySessions.reduce((total, session) => 
                    total + session.duration_minutes, 0) / 60).toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Session</span>
                <span className="font-medium">
                  {studySessions.length > 0 
                    ? Math.round(studySessions.reduce((total, session) => 
                        total + session.duration_minutes, 0) / studySessions.length)
                    : 0}min
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <CreateSessionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        selectedDate={selectedDate}
      />
    </div>
  );
};
