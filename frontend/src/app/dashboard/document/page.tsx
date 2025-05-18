"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { DocumentService, Document } from "@/lib/service/document.service";
import { useAuth } from "@/hooks/use-auth";
import { ChatService } from "@/lib/service/chat.service";
import { UploadDialog } from "@/components/dialog/upload-dialog";
import { ShareDialog } from "@/components/dialog/share-dialog";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Trash2,
  Download,
  Folder,
  FileText,
  Plus,
  BrainCircuit,
  ArrowUpDown,
  Search,
  FilePlus,
  Share,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DocumentPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "documents" | "media" | "pdf"
  >("all");
  const { user } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      const documents = await DocumentService.getDocuments();
      setDocuments(documents);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = async () => {
    if (!user) {
      return;
    }
    try {
      setIsCreatingSession(true);
      const session = await ChatService.getMasterSession();

      setCurrentShareUrl(
        `${window.location.origin}/chat/public/${session?.share_token}`
      );
      setShareDialogOpen(true);
    } catch (error) {
      console.error("Failed to create chat session:", error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await DocumentService.deleteDocument(documentId);
      await loadDocuments();
      toast.success("Document deleted successfully.");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document.");
    }
  };

  return (
    <div className="max-h-full overflow-hidden ">
      <div className="p-8 mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Upload and Train Your Documents
        </h1>
        <div className="flex items-center justify-between mb-4">
          <p className="w-4/6 text-black/60">
            Upload your personal bios, resumes, articles, or notes. SelfAI will
            become an extension of your knowledge—ready to engage and respond.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleShareClick}
              disabled={isCreatingSession || documents.length === 0}
            >
              {isCreatingSession ? "Creating..." : "Share Link"}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">How it works</h2>
          {!documents || documents.length === 0 ? (
            <div className="flex gap-4">
              <button
                className="border-2 border-dashed border-indigo-200 p-6 rounded-xl cursor-pointer w-60 transition-all group relative overflow-hidden"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <FilePlus className="w-12 h-12 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Upload a document
                    </h3>
                    <p className="text-xs text-gray-500">
                      Start by uploading a file <br /> to train your SelfAI
                      chatbot.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">Upload File</span>
                  </div>
                </div>
              </button>
              <button
                className="border-2 border-dashed border-indigo-200 p-6 rounded-xl cursor-pointer w-60 transition-all group relative overflow-hidden"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <BrainCircuit className="w-10 h-10 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      SelfAI trains on your documents
                    </h3>
                    <p className="text-xs text-gray-500">
                      Upload files to teach your chatbot.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">Upload File</span>
                  </div>
                </div>
              </button>
              <button
                className="border-2 border-dashed border-indigo-200 p-6 rounded-xl cursor-pointer w-60 transition-all group relative overflow-hidden"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <Share className="w-10 h-10 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Share Your Chatbot
                    </h3>
                    <p className="text-xs text-gray-500">
                      Let others chat and learn about you.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">Upload File</span>
                  </div>
                </div>
              </button>
              <button
                className="border-2 border-dashed border-indigo-200 p-6 rounded-xl cursor-pointer w-60 transition-all group relative overflow-hidden"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <Plus className="w-6 h-6 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Add new file
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">Upload File</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="bg-indigo-50 p-6 w-52 rounded-xl space-y-2 cursor-pointer"
                >
                  <Folder className="w-6 h-6 text-indigo-500" />
                  <div>
                    <h3 className="font-medium text-sm">{doc.filename}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {doc.filesize}
                    </p>
                  </div>
                </div>
              ))}
              <button
                className="border-2 border-dashed border-indigo-200 p-6 rounded-xl cursor-pointer w-52 transition-all group relative overflow-hidden"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <Plus className="w-6 h-6 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Add new file
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm">Upload File</span>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setUploadOpen(true)}
          >
            <Plus className="w-3 h-3 mr-1" />
            New File
          </Button>

          {/* <Button size="sm" variant="outline" className="gap-1">
              <ArrowUpDown className="w-3 h-3" />
              Sort By: Latest
            </Button> */}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">All Files</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 mb-4 border-b">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "all"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                View all
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "documents"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "media"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Media files
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "pdf"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                PDFs
              </button>
            </div>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Find document"
                className="w-full px-4 py-2 text-sm border border-indigo-200 rounded-lg bg-gray-50/90 shadow-sm hover:shadow focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow divide-y divide-gray-200 h-">
            <div className="grid grid-cols-12 px-4 py-3 bg-gray-50/90">
              <div className="col-span-4 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Name <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Size <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Type <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="col-span-3 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Upload At <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="col-span-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Actions
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-200">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : documents.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No documents found
                </div>
              ) : (
                documents
                  .filter(
                    (doc) =>
                      activeTab === "all" ||
                      doc.filename.toLowerCase().endsWith(activeTab)
                  )
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="grid grid-cols-12 px-4 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {doc.filename}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          {doc.filesize}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          {doc.filename.split(".").pop()?.toUpperCase() ||
                            "Unknown"}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          {new Date(doc.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-center justify-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={currentShareUrl}
      />
    </div>
  );
}
