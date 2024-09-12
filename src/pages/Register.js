import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { loginAndSaveToken } = useAuth();
  
  const submit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username,
          email,
          password,
        }
      );

      setSuccessMessage('Account registered successfully!');
      setTimeout(() => {
          navigate('/login')
      }, 5000)
    } catch (error) {
      if (error?.response) {
        setErrorMessage(error.response.data.message);
      }
      setError(true);
    }
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
          height: "800px",
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "400px", backgroundColor: "white" }}>
          <Typography
            variant="h4"
            textAlign={"center"}
            mb={2}
            sx={{ marginBottom: 4 }}
          >
            Register new Account
          </Typography>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <div
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            <Box sx={{ width: "100%" }}>
                <Box>
                <TextField
                  variant="outlined"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="username"
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="email"
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="password"
                  type="password"
                  sx={{ width: "100%" }}
                ></TextField>
              </Box>
              <Box
                display={"flex"}
                sx={{
                  mt: 2,
                  alignItems: "end",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize={12}>
                  Already have account?{" "}
                  <Link style={{ cursor: "pointer" }} to="/login">
                    Login here
                  </Link>{" "}
                </Typography>
                <Button variant="contained" onClick={submit}>
                  Register
                </Button>
              </Box>
            </Box>
          </div>
        </Box>
      </div>
    </>
  );
};

export default Register;
