import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const STATUSES = ['Not Started','In Progress','Completed','On Hold'];

export default function ProjectFormPage() {
  const { id } = useParams();
  const nav    = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', stack: '', details: '', githubLink: '',
    assignedUsers: '', assignedBy: '', status: STATUSES[0]
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isEdit) {
      API.get(`/projects/${id}`).then(res => {
        const p = res.data;
        setForm({
          title: p.title,
          stack: p.stack,
          details: p.details,
          githubLink: p.githubLink,
          assignedUsers: p.assignedUsers.join(', '),
          assignedBy: p.assignedBy,
          status: p.status
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([k,v]) => payload.append(k, v));
    if (file) payload.append('file', file);

    if (isEdit) await API.put(`/projects/${id}`, payload);
    else        await API.post('/projects', payload);

    nav('/projects');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card p-4">
          <h3 className="mb-4">{isEdit ? 'Edit' : 'New'} Project</h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {['title','stack','githubLink','assignedBy'].map(field => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  className="form-control"
                  value={form[field]}
                  onChange={handleChange}
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
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Assigned Users</label>
              <input
                name="assignedUsers"
                className="form-control"
                value={form.assignedUsers}
                onChange={handleChange}
                placeholder="e.g. Alice, Bob"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Project File</label>
              <input
                type="file"
                className="form-control"
                onChange={e => setFile(e.target.files[0])}
              />
            </div>
            <button className="btn btn-primary">
              {isEdit ? 'Update' : 'Create'} Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
