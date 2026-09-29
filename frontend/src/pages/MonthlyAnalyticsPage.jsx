import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';
import CategoryPie from '../components/analytics/CategoryPie';
import StatCard from '../components/common/StatCard';
import { PieChart, Calendar, Award, Zap, Sparkles } from 'lucide-react';

export default function MonthlyAnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState(null);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMonthly = async (y, m) => {
    setLoading(true);
    setError('');
    try {
      const [monthRes, catRes] = await Promise.allSettled([
        analyticsApi.getMonthly(y, m),
        analyticsApi.getCategories(),
      ]);

      if (monthRes.status === 'fulfilled' && monthRes.value.data) {
        setMonthlyData(monthRes.value.data);
      }
      if (catRes.status === 'fulfilled' && catRes.value.data) {
        setCategories(catRes.value.data);
      }
    } catch (err) {
      setError('Failed to fetch monthly analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthly(year, month);
  }, [year, month]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Monthly Analytics & Categorization
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Category distribution and 30-day activity points for {monthNames[month - 1]} {year}
          </p>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.875rem' }}
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.875rem' }}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Monthly Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Active Days This Month"
          value={`${monthlyData?.activeDays || 0} / ${monthlyData?.totalDays || 30}`}
          subtext={`${Math.round(((monthlyData?.activeDays || 0) / (monthlyData?.totalDays || 30)) * 100)}% adherence rate`}
          icon={Calendar}
          color="var(--color-primary)"
        />
        <StatCard
          title="Total Month Activity Points"
          value={monthlyData?.totalActivityPoints || 0}
          subtext="Cumulative points forged"
          icon={Zap}
          color="#f59e0b"
        />
        <StatCard
          title="Task Categories"
          value={categories?.tasksByCategory?.length || 0}
          subtext="Distinct domains of action"
          icon={PieChart}
          color="#10b981"
        />
        <StatCard
          title="Habit Categories"
          value={categories?.habitsByCategory?.length || 0}
          subtext="Habit routine groupings"
          icon={Award}
          color="#ec4899"
        />
      </div>

      {/* Donut Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', width: '100%' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Completed Tasks by Category
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Distribution across Coding, Study, Health, Work, and General
          </p>
          <CategoryPie data={categories?.tasksByCategory || []} />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Habits Logged by Category
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Routine completions classified by focus area
          </p>
          <CategoryPie data={categories?.habitsByCategory || []} />
        </div>
      </div>
    </div>
  );
}
