import React, { PropsWithChildren } from 'react';

class ErrorBoundary extends React.Component<
  PropsWithChildren<{ message?: string }>
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.message || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
