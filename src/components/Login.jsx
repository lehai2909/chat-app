import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import "./Login.css";
import { useState } from "react";
import { signUp } from "../utils/authService";
import { Link, useNavigate } from "react-router";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("accessToken")
  );

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://ty9n22xoea.execute-api.ap-southeast-1.amazonaws.com/dev/api/auth",
        {
          username: email,
          password: password,
          clientId: import.meta.env.VITE_CLIENT_ID,
        }
      );

      if (response.data.auth) {
        sessionStorage.setItem("idToken", response.data.auth.IdToken || "");
        sessionStorage.setItem(
          "accessToken",
          response.data.auth.AccessToken || ""
        );
        sessionStorage.setItem(
          "refreshToken",
          response.data.auth.RefreshToken || ""
        );
        // Update state to trigger re-render and show welcome message
        setIsLoggedIn(true);
      } else {
        alert("Login failed: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();
    await signUp({
      username: email,
      password: password,
      clientId: import.meta.env.VITE_CLIENT_ID,
    });
    navigate("/confirm", { state: { email } });
  }

  return (
    <Container fluid className="form-signin">
      {!isLoggedIn ? (
        <div className="login-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your chat</p>
          </div>
          <Form
            className="login-form"
            onSubmit={isSignUp ? handleSignUp : handleLogin}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isSignUp) {
                      handleSignUp(e);
                    } else {
                      handleLogin(e);
                    }
                  }
                }}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isSignUp) {
                      handleSignUp(e);
                    } else {
                      handleLogin(e);
                    }
                  }
                }}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-primary">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </Form>
          <Button
            variant="link"
            className="btn-link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      ) : (
        <div className="logged-in-state">
          <h3>You're already signed in!</h3>
          <div className="logged-in-actions">
            <Button
              variant="primary"
              onClick={() => {
                // Ensure token is set before navigating
                if (sessionStorage.getItem("accessToken")) {
                  // Use window.location.href to force full page navigation
                  // This ensures the route guard properly checks authentication
                  window.location.href = "/chat";
                } else {
                  alert("Please login first");
                }
              }}
              className="btn-chat"
            >
              Let's Chat
            </Button>
            <Button
              variant="info"
              onClick={() => {
                sessionStorage.clear();
                setIsLoggedIn(false);
                window.location.href = "/login";
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Login;
