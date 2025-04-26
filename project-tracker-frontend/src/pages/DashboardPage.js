import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as C, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import API from '../api';

C.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const params = user.role==='admin'
      ? {}
      : { assignedUser: user.id };
    API.get('/projects', { params })
       .then(r => setProjects(r.data));
  }, [user]);

  const counts = projects.reduce((a,p)=>{
    a[p.status]=(a[p.status]||0)+1; return a;
  }, {});

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card p-3 text-center">
            <h5>Total Projects</h5>
            <h1>{projects.length}</h1>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-3">
            <h5>Projects by Status</h5>
            <Doughnut
              data={{
                labels: Object.keys(counts),
                datasets:[{ data:Object.values(counts),
                  backgroundColor:['#36A2EB','#FF6384','#FFCE56','#4BC0C0']
                }]
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
