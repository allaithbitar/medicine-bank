import { Component, type ReactNode } from "react";
import FallbackUI from "./fallback-ui.component";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorStack: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
      errorStack: "",
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
      errorStack: JSON.stringify(error.stack || "No stack available"),
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackUI
          errorMessage={this.state.errorMessage}
          // errorStack={this.state.errorStack}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
