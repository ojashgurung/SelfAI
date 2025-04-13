import { BrainCircuit, Link } from "lucide-react";
import { ChatSession } from "@/types/chat";

interface ChatInfoSidebarProps {
  isPublic?: boolean;
  session?: ChatSession;
}

export default function ChatInfoSidebar({
  isPublic,
  session,
}: ChatInfoSidebarProps) {
  const initials =
    session?.owner?.fullname
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "AI";
  return (
    <div className="border-l bg-white p-6 overflow-hidden">
      <div className="space-y-6">
        {/* Model Info */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-full bg-indigo-200 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">{initials}</span>
          </div>
          <h3 className="font-medium text-lg mb-1">
            {session?.owner?.fullname || "AI Assistant"}
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            {session?.owner?.personal_bio || "Personal AI Assistant"}
          </p>

          {/* Embeddings and RAG Stats */}
          <div className="grid grid-cols-2 gap-8">
            {/* TODO-  later */}
            {/* <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase">Embeddings</p>
              <p className="font-medium">1,234</p>
            </div> */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase">Documents</p>
              <p className="font-medium">
                {session?.owner?.documents?.length || 0}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-500 uppercase">
                Last Trained Data
              </p>
              <p className="font-medium">
                {session?.owner?.documents && session.owner.documents.length > 0
                  ? new Date(
                      session.owner.documents.reduce((max, doc) => {
                        const date = new Date(doc.created_at).getTime();
                        return date > max ? date : max;
                      }, 0)
                    ).toLocaleDateString()
                  : "No data"}
              </p>
            </div>
          </div>
        </div>

        {/* Current Search Context */}
        <div className="p-3 bg-indigo-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-medium">Current Context</h4>
          </div>
          <p className="text-sm text-gray-600">
            Using embeddings from:{" "}
            {session?.owner?.documents
              ?.map((doc) => doc.file_name)
              .join(", ") || "No documents available"}
          </p>
        </div>

        {/* Source References */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Link className="w-4 h-4 text-indigo-600" />
            Referenced Sources
          </h4>
          <div className="space-y-2">
            {session?.owner?.documents?.map((doc) => (
              <div key={doc.id} className="p-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">{doc.file_name}</p>
                <p className="text-xs text-gray-500">
                  Added: {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {/* <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Portfolio</p>
              <p className="text-xs text-gray-500">Confidence: 95%</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">GitHub Profile</p>
              <p className="text-xs text-gray-500">Confidence: 92%</p>
            </div> */}
          </div>
        </div>

        {/* External Links */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-2 gap-2 items-center">
            {session?.owner?.github_url || (
              <a
                href={session?.owner?.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 rounded-full w-fit px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-700">
                    <path
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  <span className="text-sm">GitHub</span>
                  <span className="text-gray-400">↗</span>
                </div>
              </a>
            )}
            {session?.owner?.linkedin_url || (
              <a
                href={session?.owner?.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2 rounded-full w-fit px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0A66C2]">
                    <path
                      fill="currentColor"
                      d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                    />
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                  <span className="text-gray-400">↗</span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          <div className="p-2 bg-green-50/50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Searched for:{" "}
              <span className="font-semibold">
                {session?.owner?.fullname}.........
              </span>
            </div>
          </div>
          <div className="p-2 bg-green-50/50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Using namespace:{" "}
              <span className="font-semibold">
                {session?.namespace.slice(0, 10)}......
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
