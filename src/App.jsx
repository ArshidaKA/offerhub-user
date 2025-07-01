import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/error/ErrorFallback";

function App() {
  useEffect(() => {
    Aos.init({
      offset: 50,
      // duration: 1000,
      // easing: "ease-in-sine",
      // delay: 100,
    });
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
      onError={(error, info) => {
        // Log the error
        console.error("Error caught by boundary:", error, info);
      }}
    >
      <div className="app-container">
        <RouterProvider router={router} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
