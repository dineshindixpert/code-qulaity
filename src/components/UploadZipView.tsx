import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileArchive, 
  Check, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  FolderGit2
} from 'lucide-react';
import { Project, Run } from '../types';

interface UploadZipViewProps {
  project: Project;
  onCompleteUpload: (newRun: Run) => void;
  onCancel: () => void;
}

export const UploadZipView: React.FC<UploadZipViewProps> = ({
  project,
  onCompleteUpload,
  onCancel
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedRun, setCompletedRun] = useState<Run | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndScan = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate progress
    const timer1 = setTimeout(() => setUploadProgress(45), 500);
    const timer2 = setTimeout(() => setUploadProgress(85), 1100);
    const timer3 = setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);

      const newRun: Run = {
        id: `run-${Math.floor(Math.random() * 800) + 100}`,
        project_id: project.id,
        project_name: project.name,
        repository: `archive://${selectedFile.name}`,
        branch: 'archive-snapshot',
        score: 84,
        findings_count: 22,
        status: 'completed',
        started_at: 'Just now',
        completed_at: 'Just now',
        duration_seconds: 14,
        source_type: 'ZIP Archive',
        rules_count: 18,
        files_analyzed: 88,
        severity_counts: {
          critical: 0,
          high: 4,
          medium: 15,
          low: 3
        }
      };

      setCompletedRun(newRun);
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Project
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Upload Source Code ZIP</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Project: <span className="font-semibold text-slate-200">{project.name}</span>
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500">
          POST /api/upload/zip
        </span>
      </div>

      {!completedRun ? (
        <div className="cqt-card p-6 space-y-6">
          {/* Drag & Drop Box */}
          <div className="border-2 border-dashed rounded-lg p-10 text-center border-slate-700 hover:border-indigo-500 bg-[#0c1017] transition-colors">
            <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">
              {selectedFile ? selectedFile.name : "Upload your source code ZIP"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Supported format: <span className="font-mono text-indigo-300">.zip</span> (Max size: 50MB)
            </p>

            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
              id="zipFileInputMain"
              disabled={isUploading}
            />
            <label
              htmlFor="zipFileInputMain"
              className="cqt-btn cqt-btn-outline cqt-btn-sm inline-flex cursor-pointer"
            >
              Browse Local ZIP
            </label>
          </div>

          {/* Selected File Details */}
          {selectedFile && (
            <div className="p-4 rounded bg-[#0f141d] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileArchive className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-sm font-medium text-white">{selectedFile.name}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <span className="cqt-badge cqt-badge-neutral text-xs">Ready for analysis</span>
            </div>
          )}

          {/* Progress Bar when uploading */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  Uploading archive and parsing AST...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={isUploading}
              className="cqt-btn cqt-btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadAndScan}
              disabled={!selectedFile || isUploading}
              className="cqt-btn cqt-btn-primary"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <div className="cqt-card p-6 border-emerald-800/80 bg-[#0d161a] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ZIP Source Code Analyzed</h3>
              <p className="text-xs text-slate-300">
                Completed analysis across 88 source files with CQT engine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded bg-[#090f14] border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-500">Run ID</span>
              <div className="text-white font-bold mt-1">#{completedRun.id}</div>
            </div>
            <div>
              <span className="text-slate-500">Quality Score</span>
              <div className="text-emerald-400 font-bold mt-1">{completedRun.score} / 100</div>
            </div>
            <div>
              <span className="text-slate-500">Total Findings</span>
              <div className="text-amber-400 font-bold mt-1">{completedRun.findings_count}</div>
            </div>
            <div>
              <span className="text-slate-500">Status</span>
              <div className="text-white font-bold mt-1 capitalize">{completedRun.status}</div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onCompleteUpload(completedRun)}
              className="cqt-btn cqt-btn-primary"
            >
              <span>View Results in Run Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
