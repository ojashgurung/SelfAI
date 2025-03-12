import { BrainCircuit, Link } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
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
          <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-purple-600 font-medium">{initials}</span>
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
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
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
            <Link className="w-4 h-4 text-purple-600" />
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
                  <FaGithub className="w-4 h-4 text-gray-700" size={16} />
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
                  <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />
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
