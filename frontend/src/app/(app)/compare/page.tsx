"use client";

import { useState } from "react";
import { ArrowUp, Sparkles, Bot, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo/Logo";

const MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
];

const SUGGESTED_PROMPTS = [
  "What are my strongest technical skills?",
  "What kind of jobs should I apply to?",
  "Tell me about my projects",
  "What is my background in AI?",
];

interface CompareResult {
  question: string;
  model: string;
  without_selfai: string;
  with_selfai: string;
}

export default function ComparePage() {
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/compare`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, model, top_k: 8 }),
        },
      );

      if (!response.ok) throw new Error("Failed to compare");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background:
          "linear-gradient(to top, rgba(233, 235, 252, 0.9) 0%, rgba(255, 255, 255, 0) 50%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">SelfAI Comparison</h1>
            <p className="text-xs text-gray-500">
              See how SelfAI personalizes responses
            </p>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Model:</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Empty State */}
        {!result && !isLoading && (
          <div className="max-w-3xl mx-auto mt-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                See the <span className="text-indigo-600">difference</span>
              </h2>
              <p className="text-gray-500">
                Ask anything and watch how SelfAI personalizes the response
                versus a generic AI answer.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <Card
                  key={prompt}
                  onClick={() => setQuestion(prompt)}
                  className="p-4 hover:bg-indigo-50 cursor-pointer transition-colors bg-white/95 rounded-2xl shadow-sm hover:shadow-md border border-gray-100"
                >
                  <p className="text-sm text-gray-700">{prompt}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              {["Without SelfAI", "With SelfAI"].map((label) => (
                <Card
                  key={label}
                  className="p-6 rounded-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  </div>
                  <p className="text-xs text-gray-400 mt-4 animate-pulse">
                    {label === "With SelfAI"
                      ? "Fetching your personal context..."
                      : "Getting generic response..."}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="max-w-5xl mx-auto">
            {/* Question badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-500">You asked:</span>
              <span className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-medium">
                {result.question}
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {MODELS.find((m) => m.value === result.model)?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Without SelfAI */}
              <Card className="p-6 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Without SelfAI
                    </p>
                    <p className="text-xs text-gray-400">Generic response</p>
                  </div>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    No context
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {result.without_selfai}
                </p>
              </Card>

              {/* With SelfAI */}
              <Card className="p-6 rounded-2xl border border-indigo-200 bg-white shadow-[0_0_20px_rgba(99,102,241,0.08)]">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-100">
                  <Logo withText={false} href="/context" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      With SelfAI
                    </p>
                    <p className="text-xs text-indigo-400">
                      Personalized response
                    </p>
                  </div>
                  <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                    Your context
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {result.with_selfai}
                </p>
              </Card>
            </div>

            {/* Try another */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >
                Try another question
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-3xl mx-auto mt-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-none p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100 shadow-lg p-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              type="text"
              placeholder="Ask anything to compare responses..."
              className="flex-1 ml-4 border-none outline-none bg-transparent text-base placeholder:text-gray-400"
            />
            <button
              onClick={handleCompare}
              disabled={!question.trim() || isLoading}
              className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
            >
              <ArrowUp className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
