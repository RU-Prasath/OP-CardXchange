import { FolderOpen } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No files yet",
  description = "Upload your first file to get started.",
}) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default EmptyState;