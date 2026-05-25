import { BrowserRouter as Router, NavLink, Routes, Route } from 'react-router-dom';
import './App.css';
import octofitLogo from './octofitapp-small.svg';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="app-shell">
      <Router>
        <div className="container py-4">
          <div className="app-topbar">
            <div className="card app-welcome-card shadow-sm">
              <div className="card-body">
                <h1 className="h3 mb-2">OctoFit Tracker</h1>
                <p className="text-muted mb-0">
                  A clean React frontend connected to the Django REST API. Use the navigation menu to explore activities, leaderboard, teams, users, and workouts.
                </p>
              </div>
            </div>
          </div>

          <nav className="navbar navbar-expand-lg navbar-light bg-gradient rounded shadow-sm mb-4 border border-white">
            <div className="container-fluid px-3 py-2 align-items-center">
              <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" to="/">
                <img src={octofitLogo} alt="OctoFit" className="brand-logo" />
                <span>OctoFit</span>
              </NavLink>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  {['activities', 'leaderboard', 'teams', 'users', 'workouts'].map((route) => (
                    <li className="nav-item" key={route}>
                      <NavLink
                        to={`/${route}`}
                        className={({ isActive }) =>
                          isActive ? 'nav-link active' : 'nav-link'
                        }
                      >
                        {route.charAt(0).toUpperCase() + route.slice(1)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Activities />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
