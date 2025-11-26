import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { callSearchService } from "../utils/searchService";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSearch(event) {
    event.preventDefault();
    console.log("Searching for: " + keyword);
    setError(null);
    setLoading(true);
    try {
      const resp = await callSearchService(keyword);
      // Navigate to results page and pass results via location state
      navigate("/results", { state: { results: resp, keyword } });
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
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
            {loading ? "Searching..." : "Search"}
          </Button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </Form>
      </div>
    </Container>
  );
}

export default Search;
