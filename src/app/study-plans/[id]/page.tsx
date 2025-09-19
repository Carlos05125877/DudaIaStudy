'use client';

import { useParams, notFound } from 'next/navigation';
import { useStudyPlans } from '@/hooks/use-study-plans';
import { StudyPlanView } from '@/components/study-plan-view';
import { useEffect, useState } from 'react';
import type { StudyPlan } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function StudyPlanDetailPage() {
  const params = useParams();
  const { getStudyPlanById, isLoaded } = useStudyPlans();
  const [plan, setPlan] = useState<StudyPlan | undefined>(undefined);
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (isLoaded && id) {
      const foundPlan = getStudyPlanById(id);
      setPlan(foundPlan);
    }
  }, [id, getStudyPlanById, isLoaded]);


  if (!isLoaded || (isLoaded && plan === undefined && id)) {
     // Still loading or plan fetch is pending
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isLoaded && !plan) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">{plan?.title}</h1>
      <p className="text-muted-foreground mb-6">
        Aqui está seu plano de estudo gerado por IA. Use as abas abaixo para navegar pelos materiais.
      </p>
      {plan && <StudyPlanView plan={plan} />}
    </div>
  );
}
