export function ChatInfoSidebar() {
  return (
    <div className="border-l bg-white p-6 overflow-hidden">
      <div className="space-y-6">
        {/* Model Info */}
        <div>
          <img
            src="/gpt4-icon.png"
            alt="GPT-4o Model"
            className="w-12 h-12 rounded-full mb-3"
          />
          <h3 className="font-medium text-lg mb-1">GPT 4o Model</h3>
          <p className="text-sm text-gray-600 mb-4">
            The latest GPT-4 model with improved instruction following, JSON
            mode, reproducible outputs, parallel function calling, and more...
          </p>

          {/* Model Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Context Window</p>
              <p className="font-medium">128,000 tokens</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Training Data</p>
              <p className="font-medium">Up to Apr 2023</p>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          <div className="p-3 bg-green-50/50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Searched for: spaces and special characters...
            </div>
          </div>
          <div className="p-3 bg-green-50/50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Successfully generated responses
            </div>
          </div>
        </div>

        {/* Token Usage Info */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            Token usage in language models explains how text is processed
          </h4>
          <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
            <li>
              Tokens are the basic units of text that language models process,
              typically representing parts of words or punctuation
            </li>
            <li>
              Models count tokens in both input and output, with each token
              roughly corresponding to 4 characters of English text
            </li>
            <li>
              Advanced tracking systems use timestamps and session IDs to
              monitor interactions and improve response relevance
            </li>
          </ol>
        </div>

        {/* External Links */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
          >
            <img src="/google-icon.png" alt="Google" className="w-4 h-4" />
            <span className="text-sm">google.com</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
          >
            <img src="/medium-icon.png" alt="Medium" className="w-4 h-4" />
            <span className="text-sm">medium.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
