import { create } from "zustand";
import { WidgetPromptProps } from "@/types/widget";
import { widgetPrompts } from "@/config/widget-prompts";

interface WidgetStore {
  theme: "light" | "dark";
  heading: string;
  title: string;
  subTitle: string;
  color: string;
  showColorPicker: boolean;
  selectedPrompts: Array<WidgetPromptProps>;
  setTheme: (theme: "light" | "dark") => void;
  setHeading: (heading: string) => void;
  setTitle: (title: string) => void;
  setSubTitle: (subTitle: string) => void;
  setColor: (color: string) => void;
  setShowColorPicker: (show: boolean) => void;
  setSelectedPrompts: (prompts: Array<WidgetPromptProps>) => void;
}

export const useWidgetStore = create<WidgetStore>((set) => ({
  theme: "light",
  heading: "",
  title: "",
  subTitle: "",
  color: "#6366F1",
  showColorPicker: false,
  selectedPrompts: widgetPrompts.slice(0, 3),

  setTheme: (theme) => set({ theme }),
  setHeading: (heading) => set({ heading }),
  setTitle: (title) => set({ title }),
  setSubTitle: (subTitle) => set({ subTitle }),
  setColor: (color) => set({ color }),
  setShowColorPicker: (showColorPicker) => set({ showColorPicker }),
  setSelectedPrompts: (selectedPrompts) => set({ selectedPrompts }),
}));
