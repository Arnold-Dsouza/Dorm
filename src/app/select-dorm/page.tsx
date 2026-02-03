'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { getDormRegistry } from '@/dorms/registry';
import Image from 'next/image';

export default function SelectDormPage() {
  const [selectedDorm, setSelectedDorm] = useState<string>('');
  const router = useRouter();
  const dormRegistry = getDormRegistry();

  const handleConfirm = () => {
    if (!selectedDorm) return;
    
    // Store selected dorm in localStorage
    localStorage.setItem('selectedDorm', selectedDorm);
    
    // Redirect to login
    router.push('/login');
  };

  const dormConfig = selectedDorm ? dormRegistry[selectedDorm] : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Select Your Dormitory</CardTitle>
          <CardDescription>Choose your residence to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dorm">Dormitory</Label>
            <Select value={selectedDorm} onValueChange={setSelectedDorm}>
              <SelectTrigger id="dorm">
                <SelectValue placeholder="Select a dormitory..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(dormRegistry).map((dorm) => (
                  <SelectItem key={dorm.id} value={dorm.id}>
                    {dorm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {dormConfig && (
            <div className="space-y-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                {dormConfig.imageUrl ? (
                  <Image
                    src={dormConfig.imageUrl}
                    alt={dormConfig.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {dormConfig.description && (
                <p className="text-sm text-muted-foreground text-center">
                  {dormConfig.description}
                </p>
              )}
            </div>
          )}

          <Button 
            onClick={handleConfirm} 
            className="w-full" 
            disabled={!selectedDorm}
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
