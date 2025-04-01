import {
  GraduationCap,
  Mail,
  FileCode,
  Briefcase,
  Code,
  FolderGit2,
} from "lucide-react";

import { WidgetPromptProps } from "@/types/widget";

export const widgetPrompts: WidgetPromptProps[] = [
  {
    title: "Education & Graduation",
    content: "Where does he study right now and when does he graduate?",
    icon: GraduationCap as React.ComponentType<React.ComponentProps<"svg">>,
  },
  {
    title: "Contact Info",
    content: "Can I get his portfolio website link and also his email?",
    icon: Mail as React.ComponentType<React.ComponentProps<"svg">>,
  },
  {
    title: "Python Projects",
    content: "Can you show me some of his Python projects?",
    icon: FileCode as React.ComponentType<React.ComponentProps<"svg">>,
  },
  {
    title: "Work Experience",
    content: "What's his previous work experience?",
    icon: Briefcase as React.ComponentType<React.ComponentProps<"svg">>,
  },
  {
    title: "Skills & Technologies",
    content: "What programming languages and tools does he use?",
    icon: Code as React.ComponentType<React.ComponentProps<"svg">>,
  },
  {
    title: "Recent Projects",
    content: "What projects is he currently working on?",
    icon: FolderGit2 as React.ComponentType<React.ComponentProps<"svg">>,
  },
];
