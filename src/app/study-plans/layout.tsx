import { BrainCircuit } from 'lucide-react';

export default function StudyPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">Duda AI Study</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
