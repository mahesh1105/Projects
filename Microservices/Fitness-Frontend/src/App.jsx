// import './App.css'

import { Box, Button } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-oauth2-code-pkce"
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import { Navigate, Route, Routes } from "react-router";
import ActivityDetails from "./components/ActivityDetails";

const ActivitiesPage = () => {
  return (
    <Box sx={{ p: 2, border: '1px dashed grey'}}>
      <ActivityForm onActivitiesAdded = { () => window.location.reload()}/>
      <ActivityList />
    </Box>
  );
}

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [ authReady, setAuthReady ] = useState(false);

  useEffect(() => {
    if(token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <>
      {!token ? (
      <Button 
        variant="contained"
        onClick={() => {logIn();}}
      >
        LOGIN
      </Button>
      ) : (
        <div>
          <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
            <Button variant="contained" onClick={logOut}>
              LOGOUT
            </Button>

            <Routes>
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetails />} />
              <Route path="/" element={token ? <Navigate to="/activities" replace /> :
                                    <div>Welcome! Please Login</div>} />
            </Routes>
          </Box>
        </div>
      )}
    </>
  )
}

export default App
