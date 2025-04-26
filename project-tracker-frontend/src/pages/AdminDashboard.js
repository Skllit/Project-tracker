

import React, { useEffect, useState } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  BarController,
  LineController,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js';
import API from '../api';

// Register everything needed for Bar, Line, and Doughnut
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  BarController,
  LineController,
  DoughnutController,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [tab, setTab]           = useState('status');

  useEffect(() => {
    API.get('/projects').then(r => setProjects(r.data));
    API.get('/users').then(r => setUsers(r.data));
  }, []);

  // Build data for each view
  const statusCounts = projects.reduce((a, p) => {
    a[p.status] = (a[p.status] || 0) + 1;
    return a;
  }, {});
  const stackCounts = projects.reduce((a, p) => {
    a[p.stack] = (a[p.stack] || 0) + 1;
    return a;
  }, {});

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
  });
  const monthly = months.map(m => 0);
  projects.forEach(p => {
    const d = new Date(p.createdAt);
    const label = d.toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
    const idx = months.indexOf(label);
    if (idx >= 0) monthly[idx]++;
  });

  const contrib = users.map(u => ({
    user: u.username,
    count: projects.filter(p => p.assignedBy === u.username).length
  }));

  return (
    <>
      <h2>Admin Dashboard</h2>
      <ul className="nav nav-pills mb-3">
        {['status', 'stack', 'monthly', 'users'].map(t => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <div className="card p-4">
        {tab === 'status' && (
          <Doughnut
            data={{
              labels: Object.keys(statusCounts),
              datasets: [
                {
                  data: Object.values(statusCounts),
                  backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0'
                  ]
                }
              ]
            }}
          />
        )}
        {tab === 'stack' && (
          <Bar
            data={{
              labels: Object.keys(stackCounts),
              datasets: [
                {
                  label: 'Projects',
                  data: Object.values(stackCounts),
                  backgroundColor: '#4BC0C0'
                }
              ]
            }}
          />
        )}
        {tab === 'monthly' && (
          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: 'Created',
                  data: monthly,
                  fill: false
                }
              ]
            }}
          />
        )}
        {tab === 'users' && (
          <Bar
            data={{
              labels: contrib.map(c => c.user),
              datasets: [
                {
                  label: 'Created By',
                  data: contrib.map(c => c.count),
                  backgroundColor: '#FFCE56'
                }
              ]
            }}
            options={{
              indexAxis: 'y',
              scales: { x: { beginAtZero: true } }
            }}
          />
        )}
      </div>
    </>
  );
}
