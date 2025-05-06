// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // استيراد Toaster
import "./index.css";

// إنشاء QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center" // مكان الإشعار
        toastOptions={{
          duration: 3000, // مدة الإشعار (3 ثواني)
          style: {
            fontFamily: "Changa, sans-serif",
            fontSize: "16px",
          },
          success: {
            style: {
              background: "#4caf50",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#f44336",
              color: "#fff",
            },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
