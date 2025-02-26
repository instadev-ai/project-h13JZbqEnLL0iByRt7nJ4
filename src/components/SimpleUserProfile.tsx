import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SimpleUserProfile = () => {
  // State management
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formHistory, setFormHistory] = useState<Array<{name: string, email: string, timestamp: Date}>>([]);
  
  // Utility functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phone === '' || phoneRegex.test(phone);
  };
  
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length < 4) return digitsOnly;
    if (digitsOnly.length < 7) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    }
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  };
  
  const generateRandomUser = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    
    const fullName = `${randomFirstName} ${randomLastName}`;
    const emailAddress = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@${randomDomain}`;
    
    setName(fullName);
    setEmail(emailAddress);
  };
  
  const calculateProfileCompleteness = useCallback((): number => {
    let completeness = 0;
    if (name) completeness += 25;
    if (email && validateEmail(email)) completeness += 25;
    if (phone && validatePhone(phone)) completeness += 25;
    if (address) completeness += 25;
    return completeness;
  }, [name, email, phone, address]);
  
  const profileCompletenessMemo = useMemo(() => {
    return calculateProfileCompleteness();
  }, [calculateProfileCompleteness]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const saveUserProfile = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save successful
      setIsSaved(true);
      const now = new Date();
      setLastSaved(now);
      
      // Add to history
      setFormHistory(prev => [
        ...prev, 
        { name, email, timestamp: now }
      ].slice(-5)); // Keep only last 5 entries
      
      toast.success('Profile saved successfully!');
      
      // Reset saved status after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setName('John Doe');
    setEmail('john@example.com');
    setPhone('');
    setAddress('');
    setErrors({});
    toast.info('Form has been reset');
  };
  
  // Side effects
  useEffect(() => {
    // Load user data on component mount
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        // Data already set in initial state
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
    
    // Cleanup function
    return () => {
      console.log('Component unmounted, cleaning up...');
    };
  }, []);
  
  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (name !== 'John Doe' || email !== 'john@example.com' || phone || address) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [name, email, phone, address]);
  
  // Log changes for debugging
  useEffect(() => {
    console.log('Form state updated:', { name, email, phone, address });
  }, [name, email, phone, address]);
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Profile completeness: {profileCompletenessMemo}%
            {lastSaved && (
              <span className="block text-xs text-gray-500">
                Last saved: {lastSaved.toLocaleString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">Phone (optional)</label>
            <Input 
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              placeholder="Enter your phone number"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.phone}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Address (optional)</label>
            <Input 
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={saveUserProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetForm}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-xs" 
            onClick={generateRandomUser}
            disabled={isLoading}
          >
            Generate Random User
          </Button>
          
          {formHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Changes</h3>
              <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
                {formHistory.map((entry, index) => (
                  <div key={index} className="text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}: Changed to {entry.name} ({entry.email})
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleUserProfile;