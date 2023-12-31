import Navbar from './components/navbar';
import { useAuthContext } from './hooks/useAuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './containers/landingPage';
import Login from './containers/loginPage';
import Signup from './containers/signupPage';
import Dashboard from './containers/dashboard';
import Sidebar from './components/sidebar';
import ScorecardForm from './containers/scorecardForm';
import Scorecard from './containers/scorecard';
import NotFound from './components/notFound';
import AllScorecards from './containers/AllScorecards';
import AllFriends from './containers/AllFriends';
import FriendProfile from './containers/FriendProfile';
import AllCourses from './containers/allCourses';
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
        <Navbar
          toggleSidebar={toggleSidebar}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <div className="flex flex-row w-full min-h-screen">
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
              path="/scorecards/:id"
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
