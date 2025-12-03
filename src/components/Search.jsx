import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "../utils/jwtDecode";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // results from Google Custom Search
  const [results, setResults] = useState([]);

  async function handleSearch(event) {
    event.preventDefault();
    const user = await jwtDecode(
      import.meta.env.VITE_USERPOOL_ID,
      import.meta.env.VITE_CLIENT_ID
    );

    setError(null);
    setLoading(true);

    //Fetch from Google Custom Search API
    try {
      const url = "https://www.googleapis.com/customsearch/v1";
      const params = {
        key: import.meta.env.VITE_SEARCH_API_KEY,
        cx: import.meta.env.VITE_SEARCH_CX,
        q: keyword,
      };

      const resp = await axios.get(url, { params });
      // resp.data.items follows the provided sample at test/custom-search-data.json
      setResults(resp.data.items || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error?.message || err.message || String(err)
      );
    } finally {
      setLoading(false);
    }

    //Update DB for user search history
    try {
      const response = await axios.post(
        "https://ty9n22xoea.execute-api.ap-southeast-1.amazonaws.com/dev/api/writedb",
        {
          username: user,
          query: keyword,
        }
      );
      console.log("Search history updated:", response.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error?.message || err.message || String(err)
      );
    }
  }

  return (
    <Container fluid className="form-signin">
      <div className="login-container">
        <div className="login-header">
          <h2>🔍 Search</h2>
          <p>Basically search for anything you like</p>
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
          </Form.Group>

          <Button variant="primary" type="submit" className="btn-primary">
            {loading ? "Searching..." : "Search"}
          </Button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </Form>

        <div style={{ marginTop: 24 }}>
          <h3>Results</h3>
          {loading && <div>Loading results…</div>}
          {!loading && results.length === 0 && (
            <div style={{ color: "#666" }}>No results to show</div>
          )}
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
            {results.map((item, idx) => (
              <li
                key={item.link || idx}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 16, fontWeight: 600, color: "#007bff" }}
                >
                  {item.title}
                </a>
                <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
                  {item.snippet}
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                  {item.displayLink || item.formattedUrl}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}

export default Search;
