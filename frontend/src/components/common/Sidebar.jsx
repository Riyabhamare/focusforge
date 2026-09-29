import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  CalendarCheck,
  Flame,
  Clock,
  Calendar,
  BarChart2,
  TrendingUp,
  PieChart,
  Target,
  FileText,
  Award,
  User,
  Settings,
  Info,
  CalendarDays,
  PlusCircle,
  Activity,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Daily Core',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: "Today's Tasks", path: '/tasks/today', icon: CheckSquare },
      { name: 'Habits Tracker', path: '/habits', icon: CalendarCheck },
      { name: 'Streak Heatmap', path: '/streaks', icon: Flame },
    ],
  },
  {
    title: 'Forge Workspace',
    items: [
      { name: 'All Tasks', path: '/tasks/all', icon: ListTodo },
      { name: 'Add Task', path: '/tasks/new', icon: PlusCircle },
      { name: 'Weekly Timetable', path: '/timetable/view', icon: Clock },
      { name: 'Create Timetable', path: '/timetable/create', icon: CalendarDays },
      { name: 'Goals & Milestones', path: '/goals', icon: Target },
      { name: 'Goal Progress', path: '/goals/progress', icon: Activity },
      { name: 'Notes & Markdown', path: '/notes', icon: FileText },
      { name: 'Monthly Calendar', path: '/calendar', icon: Calendar },
    ],
  },
  {
    title: 'Analytics & RPG',
    items: [
      { name: 'Daily Analytics', path: '/analytics/daily', icon: BarChart2 },
      { name: 'Weekly Trends', path: '/analytics/weekly', icon: TrendingUp },
      { name: 'Monthly Breakdown', path: '/analytics/monthly', icon: PieChart },
      { name: 'Achievements & Badges', path: '/achievements', icon: Award },
      { name: 'Profile & XP Log', path: '/profile', icon: User },
      { name: 'Settings', path: '/settings', icon: Settings },
      { name: 'About & Guide', path: '/about', icon: Info },
    ],
  },
];

export default function Sidebar({ isCollapsed }) {
  return (
    <aside
      style={{
        width: isCollapsed ? '80px' : '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 250ms ease',
        height: 'calc(100vh - 68px)',
        position: 'sticky',
        top: '68px',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 40,
      }}
      className="desktop-sidebar"
    >
      <div style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-dim)',
                  padding: '0 0.75rem',
                  marginBottom: '0.35rem',
                }}
              >
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                    background: isActive ? 'var(--color-primary-light)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    transition: 'all 150ms ease',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                  })}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!isCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
export { NAV_GROUPS };
