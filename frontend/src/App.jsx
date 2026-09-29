import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GamificationProvider } from './context/GamificationContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import MobileDrawer from './components/common/MobileDrawer';
import ToastContainer from './components/common/Toast';
import LevelUpModal from './components/common/LevelUpModal';

// 25 Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CreateTimetablePage from './pages/CreateTimetablePage';
import ViewTimetablePage from './pages/ViewTimetablePage';
import TodayTasksPage from './pages/TodayTasksPage';
import AllTasksPage from './pages/AllTasksPage';
import AddTaskPage from './pages/AddTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import HabitTrackerPage from './pages/HabitTrackerPage';
import AddHabitPage from './pages/AddHabitPage';
import StreaksPage from './pages/StreaksPage';
import DailyAnalyticsPage from './pages/DailyAnalyticsPage';
import WeeklyAnalyticsPage from './pages/WeeklyAnalyticsPage';
import MonthlyAnalyticsPage from './pages/MonthlyAnalyticsPage';
import GoalsPage from './pages/GoalsPage';
import GoalProgressPage from './pages/GoalProgressPage';
import NotesPage from './pages/NotesPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AchievementsPage from './pages/AchievementsPage';
import AboutPage from './pages/AboutPage';

// Authenticated Shell Layout Wrapper
function AuthenticatedShell({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="app-layout">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <main className="app-main">
            <div className="app-content">
              {children}
            </div>
          </main>
        </div>
      </div>

      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
      <ToastContainer />
      <LevelUpModal />
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'var(--bg-app)',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '3px solid var(--border-subtle)',
            borderTopColor: 'var(--color-primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Entering FocusForge Realm...
        </span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}

// Public Guard (redirect to /dashboard if logged in)
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GamificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected 25-Route Workspace */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timetable/create"
                element={
                  <ProtectedRoute>
                    <CreateTimetablePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timetable/view"
                element={
                  <ProtectedRoute>
                    <ViewTimetablePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/today"
                element={
                  <ProtectedRoute>
                    <TodayTasksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/all"
                element={
                  <ProtectedRoute>
                    <AllTasksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/new"
                element={
                  <ProtectedRoute>
                    <AddTaskPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditTaskPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <ProtectedRoute>
                    <HabitTrackerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habits/new"
                element={
                  <ProtectedRoute>
                    <AddHabitPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/streaks"
                element={
                  <ProtectedRoute>
                    <StreaksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/daily"
                element={
                  <ProtectedRoute>
                    <DailyAnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/weekly"
                element={
                  <ProtectedRoute>
                    <WeeklyAnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/monthly"
                element={
                  <ProtectedRoute>
                    <MonthlyAnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <GoalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals/progress"
                element={
                  <ProtectedRoute>
                    <GoalProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <AchievementsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </GamificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
