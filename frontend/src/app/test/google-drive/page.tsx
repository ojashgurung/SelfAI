"use client";

export default function GoogleDriveIntegrationTest() {
  const startGoogleDriveIntegration = () => {
    // Just hit your backend API
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/graph/integrations/google-drive/login`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Google Drive Integration Test</h1>

      <button
        onClick={startGoogleDriveIntegration}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Connect Google Drive
      </button>
    </div>
  );
}
