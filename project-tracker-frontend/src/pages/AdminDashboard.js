// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import API from '../api';
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
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Register all chart elements/renderers/controllers you need
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
    API.get('/projects').then(res => setProjects(res.data));
    API.get('/users').then(res => setUsers(res.data));
  }, []);

  // Build project‐status counts
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  // Build tech‐stack counts
  const stackCounts = projects.reduce((acc, p) => {
    acc[p.stack] = (acc[p.stack] || 0) + 1;
    return acc;
  }, {});

  // Last 6 months creation trend
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', { month: 'short', year: 'numeric' });
  });
  const monthly = months.map(() => 0);
  projects.forEach(p => {
    const lbl = new Date(p.createdAt)
      .toLocaleString('default', { month: 'short', year: 'numeric' });
    const idx = months.indexOf(lbl);
    if (idx >= 0) monthly[idx]++;
  });

  // Projects created by each user
  const contrib = users.map(u => ({
    user: u.username,
    count: projects.filter(p => p.assignedBy === u.username).length
  }));

  return (
    <>
      <h2>Admin Dashboard</h2>

      <ul className="nav nav-pills mb-3">
        {['status','stack','monthly','users'].map(key => (
          <li className="nav-item" key={key}>
            <button
              className={`nav-link ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="card p-4">
        {tab === 'status' && (
          <Doughnut
            data={{
              labels: Object.keys(statusCounts),
              datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#36A2EB','#FF6384','#FFCE56','#4BC0C0']
              }]
            }}
          />
        )}

        {tab === 'stack' && (
          <Bar
            data={{
              labels: Object.keys(stackCounts),
              datasets: [{
                label: 'Projects by Stack',
                data: Object.values(stackCounts),
                backgroundColor: '#4BC0C0'
              }]
            }}
          />
        )}

        {tab === 'monthly' && (
          <Line
            data={{
              labels: months,
              datasets: [{
                label: 'Projects Created',
                data: monthly,
                borderColor: '#FF6384',
                fill: false
              }]
            }}
          />
        )}

        {tab === 'users' && (
          <Bar
            data={{
              labels: contrib.map(c => c.user),
              datasets: [{
                label: 'Projects Created By',
                data: contrib.map(c => c.count),
                backgroundColor: '#FFCE56'
              }]
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
