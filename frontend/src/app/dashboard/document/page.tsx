"use client";

import { useState, useEffect } from "react";
import { Document, DocumentService } from "@/lib/service/document.service";
import { UploadDialog } from "@/components/document/upload-dialog";
import { Button } from "@/components/ui/button";
import {
  Folder,
  FileText,
  Plus,
  Filter,
  ArrowUpDown,
  Search,
} from "lucide-react";

const recentFiles = [
  { name: "Analysis Data July", date: "Aug 5, 2023", size: "1.0 MB" },
  { name: "Q2 Results", date: "Jul 31, 2023", size: "2.5 MB" },
  { name: "Electrometer Data", date: "Jul 25, 2023", size: "1.9 MB" },
];

const allFiles = [
  {
    name: "Sequence Data",
    uploadedBy: "Cameron Williamson",
    type: "documents",
  },
  { name: "Q4 Results", uploadedBy: "Jenny Wilson", type: "pdf" },
  { name: "Analysis Data April", uploadedBy: "Floyd Miles", type: "documents" },
  { name: "Q2 Results", uploadedBy: "Kristin Watson", type: "pdf" },
];

export default function DocumentPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "documents" | "media" | "pdf"
  >("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await DocumentService.getDocuments();
      setDocuments(data.documents);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async () => {
    setUploadOpen(false);
    await loadDocuments();
  };

  return (
    <div className="max-h-full overflow-hidden ">
      <div className="p-8 py-6 space-y-6">
        <UploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onSuccess={handleUploadSuccess}
        />
        <h1 className="text-2xl font-semibold">Trained Documents</h1>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setUploadOpen(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              New
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Filter className="w-3 h-3" />
              Filters
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <ArrowUpDown className="w-3 h-3" />
              Sort By: Latest
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
          {!recentFiles || recentFiles.length === 0 ? (
            <button
              className="border-2 border-dashed border-purple-200 bg-purple-50/50 p-8 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors"
              onClick={() => setUploadOpen(true)}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <Plus className="w-8 h-8 text-purple-500" />
                <div className="text-center">
                  <h3 className="font-medium text-sm text-gray-700">
                    No files uploaded yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click to upload your first file
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {recentFiles.slice(0, 4).map((file) => (
                <div
                  key={file.name}
                  className="bg-purple-50 p-6 w-52 rounded-xl space-y-2 cursor-pointer"
                >
                  <Folder className="w-6 h-6 text-purple-500" />
                  <div>
                    <h3 className="font-medium text-sm">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {file.date} · {file.size}
                    </p>
                  </div>
                </div>
              ))}
              <button
                className="border-2 border-dashed border-purple-200 bg-purple-50/50 p-6 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <Plus className="w-8 h-8 text-purple-500" />
                  <div className="text-center">
                    <h3 className="font-medium text-sm text-gray-700">
                      Add new File
                    </h3>
                    <p className="text-sm text-gray-500">
                      Click to upload new file
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">All Files</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 mb-4 border-b">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "all"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                View all
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "documents"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "media"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                Media files
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "pdf"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                PDFs
              </button>
            </div>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Find document"
                className="w-full px-4 py-2 text-sm border border-purple-200 rounded-lg bg-gray-50/90 shadow-sm hover:shadow focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow divide-y divide-gray-200 h-">
            <div className="grid grid-cols-3 px-4 py-3 bg-gray-50/90">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Name <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Type <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                Upload By <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-200">
              {(activeTab === "all"
                ? allFiles
                : allFiles.filter((file) => file.type === activeTab)
              ).map((file, index) => (
                <div
                  key={file.name}
                  className="grid grid-cols-3 px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{file.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200" />
                    <span className="text-sm text-gray-700">
                      {file.uploadedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
