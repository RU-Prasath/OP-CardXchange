import { useState, useEffect, useMemo } from "react";
import {
  Folder,
  Share2,
  RefreshCw,
  Activity,
  SearchX,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { fileService } from "../services/fileService.js";
import FileUpload from "../components/FileUpload.jsx";
import FileCard from "../components/FileCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ShareModal from "../components/ShareModal.jsx";
import ActivityLog from "../components/ActivityLog.jsx";
import StatsDashboard from "../components/StatsDashboard.jsx";
import FileFilters from "../components/FileFilters.jsx";
import { applyFilters } from "../utils/fileFilters.js";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-files");
  const [myFiles, setMyFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalFile, setShareModalFile] = useState(null);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  // Filter state — separate for each tab
  const [searchQuery, setSearchQuery] = useState("");
  const [fileType, setFileType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const refreshStats = () => setStatsRefreshKey((k) => k + 1);

  const fetchMyFiles = async () => {
    try {
      const { files } = await fileService.getMyFiles();
      setMyFiles(files);
    } catch (error) {
      toast.error("Failed to load your files");
    }
  };

  const fetchSharedFiles = async () => {
    try {
      const { files } = await fileService.getSharedWithMe();
      setSharedFiles(files);
    } catch (error) {
      toast.error("Failed to load shared files");
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchMyFiles(), fetchSharedFiles()]);
    refreshStats();
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Reset filters when switching tabs
  useEffect(() => {
    setSearchQuery("");
    setFileType("all");
    setSortBy("date-desc");
  }, [activeTab]);

  // Apply filters to the current tab's files
  const filteredMyFiles = useMemo(
    () => applyFilters(myFiles, { searchQuery, fileType, sortBy }),
    [myFiles, searchQuery, fileType, sortBy]
  );

  const filteredSharedFiles = useMemo(
    () => applyFilters(sharedFiles, { searchQuery, fileType, sortBy }),
    [sharedFiles, searchQuery, fileType, sortBy]
  );

  const handleDelete = (fileId) => {
    setMyFiles((prev) => prev.filter((f) => f._id !== fileId));
    refreshStats();
  };

  const handleShare = (file) => {
    setShareModalFile(file);
  };

  const handleUploadSuccess = () => {
    fetchMyFiles();
    refreshStats();
  };

  // Helper to render the file list section for a tab
  const renderFileList = (allFiles, filteredFiles, isShared) => {
    // Tab is completely empty (no files at all)
    if (allFiles.length === 0) {
      return isShared ? (
        <EmptyState
          icon={Share2}
          title="Nothing shared with you yet"
          description="When someone shares a file with you, it will appear here."
        />
      ) : (
        <EmptyState
          icon={Folder}
          title="No files yet"
          description="Upload your first file to see it here. All files are encrypted before storage."
        />
      );
    }

    // Has files, but filters returned nothing
    if (filteredFiles.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="No matching files"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            onDelete={!isShared ? handleDelete : undefined}
            onShare={!isShared ? handleShare : undefined}
            isShared={isShared}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">
              Dashboard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Your files are protected with end-to-end hybrid encryption.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-xs font-medium text-green-300">
            Zero-knowledge encryption active
          </span>
        </div>
      </div>

      {/* Stats dashboard */}
      <StatsDashboard refreshTrigger={statsRefreshKey} />

      {/* Upload section */}
      <div className="mb-8">
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-1 bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-1 shadow-lg shadow-black/10">
          <button
            onClick={() => setActiveTab("my-files")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === "my-files"
                ? "bg-linear-to-br from-slate-800 to-slate-800/60 text-white shadow-md ring-1 ring-slate-700/60"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Folder className="w-4 h-4" />
            My Files
            <span className="px-1.5 py-0.5 text-xs bg-slate-700 rounded">
              {myFiles.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === "shared"
                ? "bg-linear-to-br from-slate-800 to-slate-800/60 text-white shadow-md ring-1 ring-slate-700/60"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Share2 className="w-4 h-4" />
            Shared with me
            <span className="px-1.5 py-0.5 text-xs bg-slate-700 rounded">
              {sharedFiles.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === "activity"
                ? "bg-linear-to-br from-slate-800 to-slate-800/60 text-white shadow-md ring-1 ring-slate-700/60"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

        {activeTab !== "activity" && (
          <button
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-sm bg-slate-900/70 backdrop-blur-sm border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300 hover:text-white rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Filters — only show on file tabs that have files */}
      {activeTab === "my-files" && myFiles.length > 0 && (
        <FileFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          fileType={fileType}
          onFileTypeChange={setFileType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={myFiles.length}
          filteredCount={filteredMyFiles.length}
        />
      )}
      {activeTab === "shared" && sharedFiles.length > 0 && (
        <FileFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          fileType={fileType}
          onFileTypeChange={setFileType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={sharedFiles.length}
          filteredCount={filteredSharedFiles.length}
        />
      )}

      {/* Tab content */}
      {activeTab === "activity" ? (
        <ActivityLog />
      ) : loading ? (
        <div className="text-center py-16 text-slate-400">Loading files...</div>
      ) : activeTab === "my-files" ? (
        renderFileList(myFiles, filteredMyFiles, false)
      ) : (
        renderFileList(sharedFiles, filteredSharedFiles, true)
      )}

      <ShareModal
        isOpen={!!shareModalFile}
        onClose={() => setShareModalFile(null)}
        file={shareModalFile}
      />
    </div>
  );
};

export default Dashboard;