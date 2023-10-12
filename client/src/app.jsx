import Navbar from './components/Navbar/navbar';
import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/landingPage';
import Login from './components/Login/loginPage';
import Signup from './components/Signup/signupPage';
import Dashboard from './components/Dashboard/dashboard';
import ScorecardForm from './components/ScorecardForms/scorecardForm';
import Scorecard from './components/Scorecard/scorecard';
import NotFound from './components/NotFound/notFound';

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
            <Route
              path="/scorecard/:id"
              element={
                user ? (
                  <Scorecard />
                ) : (
                  <>
                    <Navigate to="/login" />
                    <Login />
                  </>
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
