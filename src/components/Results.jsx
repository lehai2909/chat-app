import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Results.css";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, keyword } = location.state || {};

  useEffect(() => {
    if (!results) {
      // If user landed here without state, go back to search
      navigate("/search", { replace: true });
    }
  }, [results, navigate]);

  if (!results || !Array.isArray(results)) return null;

  // results is expected to be an array of hit objects (OpenSearch hits.hits)
  // Show only 20 items
  const displayHits = results.slice(0, 20);

  return (
    <Container fluid className="results-page">
      <div className="results-header">
        <h1>Results</h1>
        <p>
          Showing {displayHits.length} result
          {displayHits.length !== 1 ? "s" : ""}
          {keyword ? ` for "${keyword}"` : ""}
        </p>
      </div>

      <Row className="g-3 results-grid">
        {displayHits.map((hit, idx) => {
          const src = hit?._source ?? hit;
          const products = Array.isArray(src?.products) ? src.products : [];
          const productNames = products
            .map((p) => p.product_name)
            .filter(Boolean);
          const categoriesFromSource = Array.isArray(src?.category)
            ? src.category
            : [];
          const categoriesFromProducts = products
            .map((p) => p.category)
            .filter(Boolean);
          const uniqueCategories = Array.from(
            new Set([...categoriesFromSource, ...categoriesFromProducts])
          );
          // Use a static clothing image for all items
          const imageLabel = productNames[0] || "Product";
          const imageSrc =
            "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=300";

          return (
            <Col key={idx} xs={12} sm={6} md={4} lg={3} className="result-col">
              <div className="result-card">
                <img className="result-image" src={imageSrc} alt={imageLabel} />
                <div className="result-title">
                  {productNames.length > 0 ? (
                    <>
                      <strong>{productNames[0]}</strong>
                      {productNames.length > 1 && (
                        <div className="more">
                          +{productNames.length - 1} more
                        </div>
                      )}
                    </>
                  ) : (
                    <strong>Unnamed product</strong>
                  )}
                </div>

                <div className="result-meta">
                  {uniqueCategories.length > 0 ? (
                    uniqueCategories.map((c, i) => (
                      <span className="category-badge" key={i}>
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="category-badge muted">Unknown</span>
                  )}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
