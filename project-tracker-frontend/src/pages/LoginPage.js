import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [u, setU] = useState(''), [p, setP] = useState(''), [e, setE] = useState('');
  const submit = async e1 => {
    e1.preventDefault();
    setE('');
    try { await login(u,p); }
    catch (x) { setE(x.message); }
  };
  return (
    <form onSubmit={submit} className="mx-auto" style={{maxWidth:400}}>
      <h4 className="text-center mb-3">Login</h4>
      {e&&<div className="alert alert-danger">{e}</div>}
      <div className="mb-3">
        <label>Username</label>
        <input value={u} onChange={e=>setU(e.target.value)} className="form-control" required/>
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input type="password" value={p} onChange={e=>setP(e.target.value)} className="form-control" required/>
      </div>
      <button className="btn btn-primary w-100">Login</button>
    </form>
  );
}
