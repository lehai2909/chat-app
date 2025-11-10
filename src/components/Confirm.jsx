// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {confirmSignUp} from "../utils/authService";
import "./Confirm.css";

const Confirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);
      alert("Account confirmed successfully!\nSign in on next page.");
      navigate("/login");
    } catch (error) {
      alert(`Failed to confirm account: ${error}`);
    }
  };

  return (
    <Container fluid className="form-signin">
      <div className="login-container">
        <div className="login-header">
          <h2>Verify Your Email</h2>
          <p>Enter the verification code sent to {email || "your email"}</p>
        </div>
        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicCode">
            <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type="text"
              placeholder="Enter verification code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
              required
              maxLength={6}
          />
            <Form.Text className="text-muted">
              Check your email for the 6-digit verification code
            </Form.Text>
        </Form.Group>

          <Button variant="primary" type="submit" className="btn-primary">
            Verify Email
        </Button>
      </Form>
      </div>
    </Container>
  );
};

export default Confirm;
