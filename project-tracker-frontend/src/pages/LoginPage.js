import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [u, setU] = useState(''),
        [p, setP] = useState(''),
        [err, setErr] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    try { await login(u, p); }
    catch (e) { setErr(e.message); }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4">
          <h4 className="mb-3 text-center">Login</h4>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input className="form-control" value={u} onChange={e=>setU(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={p} onChange={e=>setP(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
