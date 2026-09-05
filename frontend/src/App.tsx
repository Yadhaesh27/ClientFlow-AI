import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginPage } from './pages/LoginPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { DashboardPage } from './pages/DashboardPage';
import { ActionCenterPage } from './pages/ActionCenterPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { KanbanPage } from './pages/KanbanPage';
import { FilesPage } from './pages/FilesPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { MessagesPage } from './pages/MessagesPage';
import { CalendarPage } from './pages/CalendarPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ClientsPage } from './pages/ClientsPage';
import { TeamPage } from './pages/TeamPage';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // If unauthenticated, show dedicated Login screen
  if (!user) {
    return <LoginPage />;
  }

  const isClient = user.role === 'CLIENT';

  const handleNavigate = (path: string) => {
    setSelectedProjectId(null);
    setCurrentPath(path);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPath('/project-detail');
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-body)' }}
    >
      <Navbar onOpenSearch={() => setSearchOpen(true)} onNavigate={handleNavigate} />
      <div className="flex flex-1">
        <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {selectedProjectId && currentPath === '/project-detail' ? (
            <ProjectDetailPage
              projectId={selectedProjectId}
              onBack={() => setCurrentPath('/projects')}
            />
          ) : currentPath === '/clients' ? (
            <ClientsPage />
          ) : currentPath === '/team' ? (
            <TeamPage />
          ) : currentPath === '/action-center' ? (
            <ActionCenterPage />
          ) : currentPath === '/projects' ? (
            <ProjectsPage onSelectProject={handleSelectProject} />
          ) : currentPath === '/kanban' ? (
            <KanbanPage />
          ) : currentPath === '/files' ? (
            <FilesPage />
          ) : currentPath === '/approvals' ? (
            <ApprovalsPage />
          ) : currentPath === '/messages' ? (
            <MessagesPage />
          ) : currentPath === '/calendar' ? (
            <CalendarPage />
          ) : currentPath === '/ai-assistant' ? (
            <AiAssistantPage />
          ) : currentPath === '/reports' ? (
            <ReportsPage />
          ) : currentPath === '/settings' ? (
            <SettingsPage />
          ) : isClient ? (
            <ClientDashboard
              onSelectProject={handleSelectProject}
              onNavigate={handleNavigate}
            />
          ) : (
            <DashboardPage
              onSelectProject={handleSelectProject}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
