"use client";

interface WidgetChatInboxProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export function WidgetChatInbox({
  inputMessage,
  onInputChange,
  onSendMessage,
  isLoading,
}: WidgetChatInboxProps) {
  return (
    <div className="flex items-center space-x-2 p-2">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
        disabled={isLoading}
      />
      <button
        onClick={onSendMessage}
        disabled={isLoading || !inputMessage.trim()}
        className="rounded-md bg-indigo-600 px-2 py-1 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
