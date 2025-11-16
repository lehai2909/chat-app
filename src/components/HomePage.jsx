import naza from "/naza.jpeg";
import "./HomePage.css";
import { Link } from "react-router";
import Button from "react-bootstrap/Button";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Amazing Chat App by Hai</h1>
        <p className="home-subtitle">
          Connect with friends and family in real-time. Secure, fast, and
          beautiful messaging experience.
        </p>

        <div className="logo-container">
          <img src={naza} alt="Naza" className="logo" />
        </div>

        <div className="home-actions">
          <Button as={Link} to="/login" className="btn">
            Get Started
          </Button>
          <Button
            as={Link}
            to="/search"
            variant="outline-light"
            className="btn btn-link"
          >
            Search
          </Button>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-title">Real-time Chat</div>
            <div className="feature-description">
              Instant messaging with your contacts
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-title">Secure</div>
            <div className="feature-description">
              End-to-end encryption for privacy
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Fast</div>
            <div className="feature-description">
              Lightning-fast message delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
