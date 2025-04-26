import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const STATUS = ['Not Started','In Progress','Completed','On Hold'];

export default function ProjectFormPage() {
  const { id } = useParams();
  const nav    = useNavigate();
  const edit   = Boolean(id);
  const [form, setForm] = useState({
    title:'',stack:'',details:'',githubLink:'',
    assignedUsers:'', assignedBy:'', status:STATUS[0]
  });
  const [file, setFile] = useState();

  useEffect(()=>{
    if(edit){
      API.get(`/projects/${id}`).then(r=>{
        const p=r.data;
        setForm({
          title: p.title,
          stack: p.stack,
          details: p.details,
          githubLink: p.githubLink,
          assignedUsers: p.assignedUsers.map(u=>u.id).join(','),
          assignedBy: p.assignedBy.id,
          status: p.status
        });
      });
    }
  },[id,edit]);

  const change=e=>{
    const { name,value }=e.target;
    setForm(f=>({...f,[name]:value}));
  };

  const submit=async e=>{
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k,v])=>data.append(k,v));
    if (file) data.append('file', file);

    if(edit) await API.put(`/projects/${id}`, data);
    else     await API.post('/projects', data);

    nav('/projects');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card p-4">
          <h3>{edit?'Edit':'New'} Project</h3>
          <form onSubmit={submit} encType="multipart/form-data">
            {['title','stack','githubLink','assignedBy'].map(key=>(
              <div className="mb-3" key={key}>
                <label className="form-label">
                  {key.charAt(0).toUpperCase()+key.slice(1)}
                </label>
                <input
                  name={key}
                  className="form-control"
                  value={form[key]}
                  onChange={change}
                  required
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Details</label>
              <textarea
                name="details"
                className="form-control"
                rows="4"
                value={form.details}
                onChange={change}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Assigned Users (comma-sep IDs)</label>
              <input
                name="assignedUsers"
                className="form-control"
                value={form.assignedUsers}
                onChange={change}
                placeholder="e.g. 60af…1,60af…2"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={change}
              >
                {STATUS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">File</label>
              <input
                type="file"
                className="form-control"
                onChange={e=>setFile(e.target.files[0])}
              />
            </div>
            <button className="btn btn-primary">
              {edit?'Update':'Create'} Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
