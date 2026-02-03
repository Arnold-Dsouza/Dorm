
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getDormConfig } from '@/dorms/registry';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDormId, setSelectedDormId] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Get selected dorm from localStorage
    const dormId = localStorage.getItem('selectedDorm');
    if (!dormId) {
      // Redirect to dorm selection if not selected
      router.push('/select-dorm');
      return;
    }
    setSelectedDormId(dormId);
  }, [router]);

  const dormConfig = selectedDormId ? getDormConfig(selectedDormId) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user's dorm matches the selected dorm
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userDormId = userData.dormId;
        
        if (userDormId !== selectedDormId) {
          // User belongs to a different dorm
          await auth.signOut(); // Sign out the user
          
          const userDormConfig = getDormConfig(userDormId);
          toast({
            title: 'Access Denied',
            description: `This account belongs to ${userDormConfig.displayName || userDormConfig.name}. Please select the correct dormitory.`,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Update user status to logged in
      try {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          isLoggedIn: true,
          lastLoginAt: new Date(),
        });
      } catch (firestoreError) {
        console.error('Error updating user login status:', firestoreError);
      }
      
      toast({
        title: 'Success',
        description: 'Welcome back!',
      });
      router.push('/');
    } catch (error: any) {
      let message = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!dormConfig) {
    return null; // Loading or redirecting
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <UserPlus className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">{dormConfig.displayName || dormConfig.name}</span>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => router.push('/select-dorm')}
            >
              Change Dormitory
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="abc@gmail.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="underline hover:text-primary">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
