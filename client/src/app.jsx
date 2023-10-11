import Navbar from './components/Navbar/navbar';
import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/landingPage';
import Login from './components/Login/loginPage';
import Signup from './components/Signup/signupPage';
import Dashboard from './components/Dashboard/dashboard';
import ScorecardForm from './components/ScorecardForms/scorecardForm';

export default function App() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
            <Route
              path="/login"
              element={
                user ? (
                  <>
                    <Navigate to="/" />
                    <Dashboard />
                  </>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <>
                    <Navigate to="/" />
                    <Dashboard />
                  </>
                ) : (
                  <Signup />
                )
              }
            />
            <Route
              path="/newround"
              element={
                user ? (
                  <ScorecardForm />
                ) : (
                  <>
                    <Navigate to="/login" />
                    <Login />
                  </>
                )
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
