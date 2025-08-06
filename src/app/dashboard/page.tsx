'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <img
            src={user.picture.large}
            alt={`${user.name.first} ${user.name.last}`}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <h1 className={styles.title}>
              Welcome to the Dashboard, {user.name.first} {user.name.last}!
            </h1>
            <p className={styles.subtitle}>
              You have successfully logged in to your account.
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>User Information</h2>
          <div className={styles.userDetails}>
            <div className={styles.detail}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user.email}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{user.phone}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Location:</span>
              <span className={styles.value}>
                {user.location.city}, {user.location.state}, {user.location.country}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Age:</span>
              <span className={styles.value}>{user.dob.age} years old</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}