'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StudyPlan } from '@/lib/types';

const STORAGE_KEY = 'duda-ai-study-plans';

export function useStudyPlans() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(STORAGE_KEY);
      if (items) {
        setStudyPlans(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to load study plans from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveToLocalStorage = (plans: StudyPlan[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error("Failed to save study plans to localStorage", error);
    }
  };

  const addStudyPlan = useCallback((plan: StudyPlan) => {
    setStudyPlans(prevPlans => {
      const newPlans = [plan, ...prevPlans];
      saveToLocalStorage(newPlans);
      return newPlans;
    });
  }, []);

  const getStudyPlanById = useCallback((id: string): StudyPlan | undefined => {
    return studyPlans.find(plan => plan.id === id);
  }, [studyPlans]);

  const deleteStudyPlan = useCallback((id: string) => {
    setStudyPlans(prevPlans => {
      const newPlans = prevPlans.filter(plan => plan.id !== id);
      saveToLocalStorage(newPlans);
      return newPlans;
    });
  }, []);

  return { studyPlans, isLoaded, addStudyPlan, getStudyPlanById, deleteStudyPlan };
}
