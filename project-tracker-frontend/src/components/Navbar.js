import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Tracker</Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          {user && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/projects">Projects</NavLink></li>
              {user.role==='user' && (<li className="nav-item"><NavLink className="nav-link" to="/projects/new">New</NavLink></li>
               )}
              {user.role==='admin' && (
                <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>
              )}
            </ul>
          )}
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            ) : (
              <>
                <li className="nav-item nav-link">Hi, {user.username}</li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
