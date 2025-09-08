
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, Target, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (isSignUp = false) => {
    const errors: {[key: string]: string} = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (isSignUp && !name.trim()) {
      errors.name = 'Full name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(true)) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">StudyMate AI</h1>
          <p className="text-muted-foreground">Your intelligent study companion</p>
        </div>

        <Card className="p-6 shadow-xl border border-border bg-card/80 backdrop-blur-sm">
          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`mt-1 ${validationErrors.email ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.email && (
                    <div className="flex items-center mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.email}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`mt-1 ${validationErrors.password ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.password && (
                    <div className="flex items-center mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.password}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`mt-1 ${validationErrors.name ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.name && (
                    <div className="flex items-center mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.name}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`mt-1 ${validationErrors.email ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.email && (
                    <div className="flex items-center mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.email}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`mt-1 ${validationErrors.password ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.password && (
                    <div className="flex items-center mt-1 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.password}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Smart Plans</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">AI Flashcards</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-2">
              <Brain className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Progress Tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};
