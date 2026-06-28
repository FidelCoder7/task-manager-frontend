import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.href = "/"}>
            Go to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
