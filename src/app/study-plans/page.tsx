'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Trash2, BookOpen, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateStudyPlanForm } from '@/components/create-study-plan';
import { useStudyPlans } from '@/hooks/use-study-plans';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function StudyPlansPage() {
  const { studyPlans, deleteStudyPlan, isLoaded } = useStudyPlans();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const noPlansImage = PlaceHolderImages.find(img => img.id === 'no-plans');

  if (!isLoaded) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl font-bold">Meus Planos de Estudo</h1>
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Criar Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Criar um Novo Plano de Estudo</DialogTitle>
              <DialogDescription>
                Forneça um título e seu texto jurídico para começar.
              </DialogDescription>
            </DialogHeader>
            <CreateStudyPlanForm setIsOpen={setCreateOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {studyPlans.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          {noPlansImage && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={noPlansImage.imageUrl}
                alt={noPlansImage.description}
                width={600}
                height={400}
                data-ai-hint={noPlansImage.imageHint}
                className="w-1/2 max-w-sm mx-auto object-contain"
              />
            </div>
          )}
          <h2 className="font-headline text-2xl font-semibold">Nenhum Plano de Estudo Ainda</h2>
          <p className="text-muted-foreground mt-2 mb-4">
            Clique em &quot;Criar Novo Plano&quot; para gerar seu primeiro plano de estudo.
          </p>
          <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                Criar Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Criar um Novo Plano de Estudo</DialogTitle>
                <DialogDescription>
                  Forneça um título e seu texto jurídico para começar.
                </DialogDescription>
              </DialogHeader>
              <CreateStudyPlanForm setIsOpen={setCreateOpen} />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studyPlans.map(plan => (
            <Card key={plan.id} className="flex flex-col transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">{plan.title}</CardTitle>
                <CardDescription>
                  Criado {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{plan.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <Link href={`/study-plans/${plan.id}`}>
                    <BookOpen />
                    Ver Plano
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 />
                      <span className="sr-only">Excluir plano</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente seu plano de estudo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteStudyPlan(plan.id)}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
