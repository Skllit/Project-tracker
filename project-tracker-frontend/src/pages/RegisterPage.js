import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [f, setF] = useState({u:'',e:'',p:'',c:''}), [err, setErr] = useState('');
  const change = e1=>setF(f=>({...f,[e1.target.name]:e1.target.value}));
  const submit = async e1 => {
    e1.preventDefault(); setErr('');
    if (f.p!==f.c) return setErr("Passwords don't match");
    try { await register({username:f.u,email:f.e,password:f.p}); }
    catch(x){ setErr(x.message); }
  };
  return (
    <form onSubmit={submit} className="mx-auto" style={{maxWidth:400}}>
      <h4 className="text-center mb-3">Register</h4>
      {err&&<div className="alert alert-danger">{err}</div>}
      {['u','e','p','c'].map((name, i)=>(
        <div className="mb-3" key={name}>
          <label>{
            name==='u'?'Username':
            name==='e'?'Email':
            name==='p'?'Password':'Confirm Password'
          }</label>
          <input
            name={name}
            type={name.includes('p')?'password': name==='e'?'email':'text'}
            className="form-control"
            value={f[name]}
            onChange={change}
            required
          />
        </div>
      ))}
      <button className="btn btn-success w-100">Register</button>
    </form>
  );
}
