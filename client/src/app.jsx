import Navbar from './components/Navbar/navbar';
import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './components/LandingPage/landingPage';
import Login from './components/Login/loginPage';
import Signup from './components/Signup/signupPage';
import Dashboard from './components/Dashboard/dashboard';
import Sidebar from './components/Sidebar/sidebar';
import ScorecardForm from './components/ScorecardForms/scorecardForm';
import Scorecard from './components/Scorecard/scorecard';
import NotFound from './components/NotFound/notFound';
import AllScorecards from './components/AllScorecards/AllScorecards';
import AllFriends from './components/AllFriends/AllFriends';
import FriendProfile from './components/FriendProfile/FriendProfile';
import AllCourses from './components/AllCourses/allCourses';
import MyStats from './containers/myStats';
import LoadingScreen from './components/Loading/loadingScreen';

export default function App() {
  const { user, isLoading } = useAuthContext();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar toggleSidebar={toggleSidebar} isSideBarOpen={isSideBarOpen} />
        <div className="flex flex-row w-screen min-h-screen">
          {user && <Sidebar />}
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
            <Route
              path="/scorecards"
              element={
                user ? (
                  <AllScorecards />
                ) : (
                  <>
                    <Navigate to="/login" />
                    <Login />
                  </>
                )
              }
            />
            <Route
              path="/friends"
              element={
                user ? (
                  <AllFriends />
                ) : (
                  <>
                    <Navigate to="/login" />
                    <Login />
                  </>
                )
              }
            />
            <Route
              path="/friends/:id"
              element={
                user ? (
                  <FriendProfile />
                ) : (
                  <>
                    <Navigate to="/login" />
                    <Login />
                  </>
                )
              }
            />
            <Route
              path="/courses"
              element={
                user ? (
                  <AllCourses />
                ) : (
                  <>
                    <Navigate to="/login" />
                    <Login />
                  </>
                )
              }
            />
            <Route
              path="/mystats"
              element={
                user ? (
                  <MyStats />
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
