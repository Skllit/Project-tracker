import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({u:'', e:'', p:'', c:''});
  const [err, setErr] = useState('');

  const onChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const onSubmit = async e => {
    e.preventDefault();
    if (form.p !== form.c) return setErr("Passwords don't match");
    try {
      await register({ username: form.u, email: form.e, password: form.p });
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-4">
          <h4 className="mb-3 text-center">Register</h4>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={onSubmit}>
            {[
              {label:'Username', name:'u'},
              {label:'Email',    name:'e', type:'email'},
              {label:'Password', name:'p', type:'password'},
              {label:'Confirm',  name:'c', type:'password'},
            ].map(f=>(
              <div className="mb-3" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-control"
                  name={f.name}
                  type={f.type||'text'}
                  value={form[f.name]}
                  onChange={onChange}
                  required
                />
              </div>
            ))}
            <button className="btn btn-success w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
