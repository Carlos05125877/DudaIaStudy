export type Flashcard = {
  front: string;
  back: string;
};

export type Quiz = {
  question: string;
  answer: string;
  explanation: string;
};

export type DeepDive = {
  feynman: {
    concept: string;
    explanation: string;
    analogy: string;
    gaps: string;
  };
};

export type StudyPlan = {
  id: string;
  title: string;
  summary: string;
  quizzes: Quiz[];
  flashcards: Flashcard[];
  deepDive: DeepDive;
  observations: string;
  createdAt: string;
  sourceText: string;
};
