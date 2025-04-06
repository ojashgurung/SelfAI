import {
  GraduationCap,
  Mail,
  FileCode,
  Briefcase,
  Code,
  FolderGit2,
  LucideIcon,
} from "lucide-react";

export const iconMapping: { [key: string]: LucideIcon } = {
  GraduationCap,
  Mail,
  FileCode,
  Briefcase,
  Code,
  FolderGit2,
};

export const getIconComponent = (iconName: string) => {
  return iconMapping[iconName] || Code;
};
