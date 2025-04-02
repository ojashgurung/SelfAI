"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HexColorPicker } from "react-colorful";
import { Check } from "lucide-react";
import { useWidgetStore } from "@/context/use-widget-context";
import { widgetPrompts } from "@/config/widget-prompts";
import { useRouter } from "next/navigation";

export default function ConfigurationPage() {
  const {
    theme,
    color,
    showColorPicker,
    selectedPrompts,
    setTheme,
    setHeading,
    setTitle,
    setSubTitle,
    setColor,
    setShowColorPicker,
    setSelectedPrompts,
  } = useWidgetStore();

  const router = useRouter();

  const presetColors = [
    "#6366F1", // Indigo
    "#3B82F6", // Blue
    "#06B6D4", // Cyan
    "#10B981", // Green
    "#FBBF24", // Yellow
    "#F97316", // Orange
    "#EF4444", // Red
    "#EC4899", // Pink
  ];

  const handleGenerateEmbedCode = () => {
    router.push("/dashboard/widget/add-to-website");
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Widget Configuration</h1>

      <div className="rounded-lg p-8 xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto">
        <h2 className="mb-6 text-2xl font-semibold">Pick theme and color</h2>

        <div className="space-y-8">
          <div className="flex gap-4 max-w-xs">
            <div
              className={`flex-1 cursor-pointer rounded-lg border p-4 ${
                theme === "light" ? "border-indigo-500" : "border-gray-200"
              }`}
              onClick={() => setTheme("light")}
            >
              <div className="h-20 rounded-md bg-gray-100"></div>
              <p className="mt-2 text-sm font-medium">Light</p>
            </div>
            <div
              className={`flex-1 cursor-pointer rounded-lg border p-4 ${
                theme === "dark" ? "border-indigo-500" : "border-gray-200"
              }`}
              onClick={() => setTheme("dark")}
            >
              <div className="h-20 rounded-md bg-gray-800"></div>
              <p className="mt-2 text-sm font-medium">Dark</p>
            </div>
          </div>

          <div className="w-full">
            <label className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-900">
                Widget Heading <span className="text-red-500">*</span>
              </span>
            </label>
            <div>
              <Input
                type="text"
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Chat with AI"
                className="w-full bg-white border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-6"
              />
              <p className="mt-2 text-xs text-gray-500">
                This will be displayed as the heading in your widget
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Pick Color</label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`h-8 w-8 rounded-full ${
                    color === presetColor ? "ring-2 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span className="text-xl text-black/20">+</span>
              </button>
            </div>
            {showColorPicker && (
              <div className="mt-2">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Widget Title <span className="text-red-500">*</span>
                </span>
              </label>
              <div>
                <Input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Curious about my work or thoughts?"
                  className="w-full bg-white border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-6"
                />
                <p className="mt-2 text-xs text-gray-500">
                  This will be displayed as the body title in your widget
                </p>
              </div>
            </div>

            <div className="w-full">
              <label className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Widget Sub-Title <span className="text-red-500">*</span>
                </span>
              </label>
              <div>
                <Input
                  type="text"
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="e.g. Let's chat about it"
                  className="w-full bg-white border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-6"
                />
                <p className="mt-2 text-xs text-gray-500">
                  This will be displayed as the body title in your widget
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col mb-4">
              <label className="block text-sm font-medium">
                Choose upto 3 quick prompts
              </label>
              <p className="mt-2 text-xs text-gray-500">
                3 quick prompts are selected by default. You can change and add
                upto 3 prompts.
              </p>
            </div>
            <div className="space-y-2">
              {widgetPrompts.map((prompt) => (
                <div
                  key={prompt.title}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:bg-gray-50 ${
                    selectedPrompts.some((p) => p.title === prompt.title)
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-gray-200"
                  } ${
                    selectedPrompts.length >= 3 &&
                    !selectedPrompts.some((p) => p.title === prompt.title)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (selectedPrompts.some((p) => p.title === prompt.title)) {
                      setSelectedPrompts(
                        selectedPrompts.filter((p) => p.title !== prompt.title)
                      );
                    } else {
                      if (selectedPrompts.length >= 3) {
                        setSelectedPrompts([
                          ...selectedPrompts.slice(1),
                          {
                            title: prompt.title,
                            content: prompt.content,
                            icon: prompt.icon,
                          },
                        ]);
                      } else {
                        setSelectedPrompts([
                          ...selectedPrompts,
                          {
                            title: prompt.title,
                            content: prompt.content,
                            icon: prompt.icon,
                          },
                        ]);
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200">
                      <prompt.icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{prompt.title}</p>
                      <p className="text-xs text-gray-500">{prompt.content}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {selectedPrompts.some((p) => p.title === prompt.title) ? (
                        <Check className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleGenerateEmbedCode}
            >
              Generate Embed Code
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
