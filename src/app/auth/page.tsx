'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { RandomUserResponse } from '@/types/user';
import styles from './auth.module.scss';

export default function AuthPage() {
  const [formData, setFormData] = useState<LoginFormData>({ phoneNumber: '' });
  const [errors, setErrors] = useState<{ phoneNumber?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: { phoneNumber?: string } = {};
      error.issues?.forEach((err: any) => {
        if (err.path[0] === 'phoneNumber') {
          formattedErrors.phoneNumber = err.message;
        }
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api/?results=1&nat=us');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data: RandomUserResponse = await response.json();
      const userData = data.results[0];
      
      login(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Enter your phone number to continue</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            ref={phoneInputRef}
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="09xxxxxxxxx"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={errors.phoneNumber}
          />
          
          <Button
            type="submit"
            loading={isLoading}
            className={styles.loginButton}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}