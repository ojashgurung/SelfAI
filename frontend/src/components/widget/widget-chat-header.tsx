"use client";

interface WidgetChatHeaderProps {
  title?: string;
  onMinimize?: () => void;
}

export function WidgetChatHeader({
  title = "Chat with AI",
  onMinimize,
}: WidgetChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b bg-white px-3 py-2">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {onMinimize && (
        <button
          onClick={onMinimize}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
