import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginAndSaveToken } = useAuth();
  const navigate = useNavigate();
  
  const submit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      loginAndSaveToken(response.data.data.access_token);
      navigate('/');
    } catch (error) {
      if (error?.response) {
        setErrorMessage(error.response.data.message);
      }
      setError(true);
    }
    // alert(`Email: ${email}, Pass: ${password}`);
    // loginAndSaveToken('Test');
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 5000);
    }
  }, [isError]);
  return (
    <>
      <div
        style={{
          height: '800px',
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "400px", backgroundColor: "white", paddingTop: '20px', paddingBottom: '20px', paddingRight: '35px', paddingLeft: '35px' }}>
          <Typography
            variant="h4"
            textAlign={"center"}
            mb={2}
            sx={{ marginBottom: 4 }}
          >
            Welcome, to the M-Apps
          </Typography>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <div
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            <Box sx={{width: '100%'}}>
              <Box sx={{width: '100%'}}>
                <TextField
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="email"
                  sx={{width: '100%'}}
                ></TextField>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="password"
                  type="password"
                  sx={{width: '100%'}}
                ></TextField>
              </Box>
              <Box
                display={"flex"}
                sx={{ mt: 2, alignItems: 'end', justifyContent: "space-between" }}
              >
                <Typography fontSize={12}>Doesn't have acocunt? <Link style={{cursor: 'pointer'}} to="/register">Register here</Link> </Typography>
                <Button variant="contained" onClick={submit}>
                  Login
                </Button>
              </Box>
            </Box>
          </div>
        </Box>
      </div>
    </>
  );
};

export default Login;
