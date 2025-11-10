import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import "./Login.css";
import { useState } from "react";
import { logService } from "../utils/logService";

function Search() {
  const [keyword, setKeyword] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    console.log("Searching for: " + keyword);
    logService();
    // TODO: Implement search functionality
  }

  return (
    <Container fluid className="form-signin">
      <div className="login-container">
        <div className="login-header">
          <h2>🔍 Search</h2>
          <p>Find messages, users, or conversations</p>
        </div>
        <Form onSubmit={handleSearch} className="login-form">
        <Form.Group className="mb-3" controlId="formBasicSearch">
            <Form.Label>Search Keyword</Form.Label>
          <Form.Control
            type="text"
              placeholder="Enter search keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
              required
          />
            <Form.Text className="text-muted">
              Search through your messages and contacts
            </Form.Text>
        </Form.Group>

          <Button variant="primary" type="submit" className="btn-primary">
          Search
        </Button>
      </Form>
      </div>
    </Container>
  );
}

export default Search;
