// src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching admin stats:', error));
  }, []);

  if (!stats) return <div>Loading...</div>;

  const statusLabels = stats.statusCounts.map(item => item._id);
  const statusData = stats.statusCounts.map(item => item.count);

  const userLabels = stats.users.map(user => user.username);
  const userProjectCounts = stats.users.map(user => user.projectCount || 0);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Project Status Distribution</h5>
          <Doughnut
            data={{
              labels: statusLabels,
              datasets: [{
                data: statusData,
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
              }],
            }}
          />
        </div>
        <div className="col-md-6">
          <h5>Projects per User</h5>
          <Bar
            data={{
              labels: userLabels,
              datasets: [{
                label: 'Number of Projects',
                data: userProjectCounts,
                backgroundColor: '#4BC0C0',
              }],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
