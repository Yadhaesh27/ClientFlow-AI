import React, { useState, useEffect } from 'react';
import { FolderGit2, Upload, FileText, Download, Clock, History, CheckCircle2, AlertTriangle } from 'lucide-react';
import { filesApi, projectsApi, approvalsApi } from '../services/api';
import { ProjectFile, Project } from '../types';
import { useAuth } from '../context/AuthContext';

interface FilesPageProps {
  projectId?: string;
}

export const FilesPage: React.FC<FilesPageProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderFilter, setFolderFilter] = useState('ALL');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState('Deliverables');
  const [uploadComment, setUploadComment] = useState('');
  const [requestApproval, setRequestApproval] = useState(true);

  // Version modal state
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedFileForVer, setSelectedFileForVer] = useState<ProjectFile | null>(null);

  useEffect(() => {
    const init = async () => {
      const pList = await projectsApi.list();
      setProjects(pList);
      if (pList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(pList[0].id);
      }
    };
    init();
  }, []);

  const loadFiles = async (pId: string) => {
    if (!pId) return;
    setLoading(true);
    try {
      const list = await filesApi.list(pId);
      setFiles(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadFiles(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleUploadFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !selectedProjectId) return;

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('folder', uploadFolder);
    formData.append('comment', uploadComment || 'Initial upload v1');

    try {
      const uploaded = await filesApi.upload(selectedProjectId, formData);

      if (requestApproval) {
        const proj = projects.find((p) => p.id === selectedProjectId);
        await approvalsApi.create({
          project_id: selectedProjectId,
          file_id: uploaded.id,
          title: `Verification Request: ${uploaded.filename}`,
          description: uploadComment || 'New deliverable uploaded for client/admin sign-off.',
          requested_by_user_id: user?.id || 'usr_dev',
          requested_by_name: user?.name ? `${user.name} (${user.role})` : 'Aarav Sharma (Developer)',
          requested_by_role: user?.role || 'TEAM_MEMBER',
          target_recipient: 'EVERYONE',
          requested_from_user_id: proj?.client_user_id || 'usr_client',
        });
      }

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadComment('');
      loadFiles(selectedProjectId);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredFiles = files.filter(f => folderFilter === 'ALL' || f.folder === folderFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" /> Files & Deliverable Versioning
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage project deliverables, version history (v1, v2) and approval markers</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 font-bold focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Upload File
          </button>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['ALL', 'Deliverables', 'Design', 'Docs', 'General'].map((folder) => (
          <button
            key={folder}
            onClick={() => setFolderFilter(folder)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              folderFilter === folder
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {folder}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading project files...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-3xl text-slate-500 text-xs">
          No files uploaded in this folder category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-5 rounded-3xl glass-card border border-slate-200/80 space-y-3 shadow-sm hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate max-w-[160px]">{file.filename}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{file.folder} • {(file.size_bytes / 1024).toFixed(0)} KB</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[10px]">
                  v{file.current_version} Latest
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-600 font-medium flex items-center gap-1">
                  Status:
                  {file.approval_status === 'APPROVED' ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : file.approval_status === 'PENDING' ? (
                    <span className="text-amber-700 font-extrabold flex items-center gap-0.5">
                      <Clock className="w-3.5 h-3.5" /> Pending Review
                    </span>
                  ) : file.approval_status === 'CHANGES_REQUESTED' ? (
                    <span className="text-rose-700 font-extrabold flex items-center gap-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Revisions Needed
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">Standard File</span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-2.5 text-[11px]">
                <button
                  onClick={() => {
                    setSelectedFileForVer(file);
                    setShowVersionModal(true);
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold"
                >
                  <History className="w-3.5 h-3.5" /> Versions ({file.versions?.length || 1})
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const proj = projects.find((p) => p.id === selectedProjectId);
                      await approvalsApi.create({
                        project_id: selectedProjectId,
                        file_id: file.id,
                        title: `Verification Request: ${file.filename}`,
                        description: `Developer request for verification of deliverable ${file.filename}`,
                        requested_by_user_id: user?.id || 'usr_dev',
                        requested_by_name: user?.name ? `${user.name} (${user.role})` : 'Aarav Sharma (Developer)',
                        requested_by_role: user?.role || 'TEAM_MEMBER',
                        target_recipient: 'EVERYONE',
                        requested_from_user_id: proj?.client_user_id || 'usr_client',
                      });
                      alert(`Verification request sent for ${file.filename}!`);
                      loadFiles(selectedProjectId);
                    }}
                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded-lg text-[10px] font-black transition-all"
                  >
                    + Request Verification
                  </button>

                  <a
                    href={file.storage_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-extrabold"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleUploadFileSubmit}
            className="glass-panel border border-white/90 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-extrabold text-lg text-slate-900">Upload New Deliverable</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Select File</label>
              <input
                type="file"
                required
                onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Folder Category</label>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 focus:outline-none"
              >
                <option value="Deliverables">Deliverables</option>
                <option value="Design">Design</option>
                <option value="Docs">Docs</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Version Comment / Notes</label>
              <input
                type="text"
                value={uploadComment}
                onChange={(e) => setUploadComment(e.target.value)}
                placeholder="e.g. Updated dark mode layout based on client request"
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="reqApp"
                checked={requestApproval}
                onChange={(e) => setRequestApproval(e.target.checked)}
                className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-0"
              />
              <label htmlFor="reqApp" className="text-xs text-slate-700 font-semibold">
                Request client approval in Action Center
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md"
              >
                Upload & Register Version
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionModal && selectedFileForVer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel border border-white/90 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-lg text-slate-900">
              Version History: {selectedFileForVer.filename}
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedFileForVer.versions?.map((ver) => (
                <div key={ver.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-extrabold text-slate-900">
                    <span>Version v{ver.version_number}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{new Date(ver.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 font-medium">{ver.comment || 'No release note provided.'}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
