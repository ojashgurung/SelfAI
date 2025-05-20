interface SectionProps {
  label: string;
  percent: number;
}

interface ProfileCompletionProps {
  completion_score: number;
  sections: SectionProps[];
}
