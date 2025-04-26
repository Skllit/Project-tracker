
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


import { useAuth } from '../context/AuthContext';
import API from '../api';

-// Register only what we need for a Doughnut
-ChartJS.register(ArcElement, Tooltip, Legend);
+// Register only what we need for a Doughnut
+ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get('/projects').then(({ data }) => {
      const mine = data.filter(p =>
        p.assignedUsers.includes(user.username)
      );
      setProjects(mine);
    });
  }, [user.username]);

  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="text-center">
      <h1>Welcome, {user.username}!</h1>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Total Projects</h5>
            <h2>{projects.length}</h2>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-3">
            <h5>Your Projects by Status</h5>
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
          </div>
        </div>
      </div>
    </div>
  );
}
