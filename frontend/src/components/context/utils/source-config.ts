import { FileText, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiNotion } from "react-icons/si";

export const SOURCE_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
  }
> = {
  github: {
    label: "GitHub",
    icon: FaGithub as React.ElementType,
    color: "#ffffff",
    bg: "#1a1a1a",
  },
  notion: {
    label: "Notion",
    icon: SiNotion as React.ElementType,
    color: "#1a1a1a",
    bg: "#ffffff",
  },
  gmail: { label: "Gmail", icon: Mail, color: "#dc2626", bg: "#fef2f2" },
  documents: { label: "Docs", icon: FileText, color: "#2563eb", bg: "#eff6ff" },
};

export const ALL_SOURCES = ["github", "notion", "gmail", "documents"];

export const SIDEBAR_SOURCES = [
  {
    id: "github",
    title: "GitHub",
    subtitle: "Code & repositories",
    available: true,
    comingSoon: false,
  },
  {
    id: "notion",
    title: "Notion",
    subtitle: "Docs & notes",
    available: false,
    comingSoon: true,
  },
  {
    id: "gmail",
    title: "Gmail",
    subtitle: "Emails",
    available: false,
    comingSoon: true,
  },
  {
    id: "documents",
    title: "Documents",
    subtitle: "PDF, DOCX, MD",
    available: true,
    comingSoon: false,
  },
];
