import { create } from "zustand";

interface EmbeddedWidgetState {
  theme: "light" | "dark";
  heading: string;
  title: string;
  subTitle: string;
  color: string;
  selectedPrompts: any[];
  shareToken: string;
  setTheme: (theme: "light" | "dark") => void;
  setHeading: (heading: string) => void;
  setTitle: (title: string) => void;
  setSubTitle: (subTitle: string) => void;
  setColor: (color: string) => void;
  setSelectedPrompts: (prompts: any[]) => void;
  setShareToken: (token: string) => void;
}

export const useEmbeddedWidgetStore = create<EmbeddedWidgetState>((set) => ({
  theme: "light",
  heading: "",
  title: "",
  subTitle: "",
  color: "#6366F1",
  showColorPicker: false,
  selectedPrompts: [],
  shareToken: "",
  setTheme: (theme) => set({ theme }),
  setHeading: (heading) => set({ heading }),
  setTitle: (title) => set({ title }),
  setSubTitle: (subTitle) => set({ subTitle }),
  setColor: (color) => set({ color }),
  setSelectedPrompts: (selectedPrompts) => set({ selectedPrompts }),
  setShareToken: (shareToken) => set({ shareToken }),
}));
