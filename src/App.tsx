
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Nexus UI
import NexusApp from "./nexus/NexusApp";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to Nexus UI */}
          <Route path="/" element={<Navigate to="/nexus" replace />} />
          
          {/* All routes handled by Nexus UI */}
          <Route path="/nexus/*" element={<NexusApp />} />
          
          {/* Catch all - redirect to Nexus */}
          <Route path="*" element={<Navigate to="/nexus" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
};

export default App;
