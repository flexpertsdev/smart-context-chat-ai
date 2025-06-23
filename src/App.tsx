
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ContextLibrary from "./pages/ContextLibrary";
import CreateContext from "./pages/CreateContext";
import ContextDetails from "./pages/ContextDetails";
import Settings from "./pages/Settings";
import TagManagement from "./pages/TagManagement";
import NotFound from "./pages/NotFound";

// Mobile pages
import MobileChatList from "./mobile/pages/MobileChatList";
import MobileChat from "./mobile/pages/MobileChat";
import MobileSettings from "./mobile/pages/MobileSettings";
import UISelector from "./pages/UISelector";

// Nexus UI
import NexusShowcase from "./nexus/NexusShowcase";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Standalone pages */}
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Main app pages */}
            <Route path="/" element={<UISelector />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="contexts" element={<ContextLibrary />} />
            <Route path="contexts/new" element={<CreateContext />} />
            <Route path="contexts/:contextId" element={<ContextDetails />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/tags" element={<TagManagement />} />
            
            {/* Legacy route redirect */}
            <Route path="tag-management" element={<TagManagement />} />
            
            {/* Mobile routes */}
            <Route path="mobile" element={<MobileChatList />} />
            <Route path="mobile/chat/:chatId" element={<MobileChat />} />
            <Route path="mobile/contexts" element={<ContextLibrary />} />
            <Route path="mobile/settings" element={<MobileSettings />} />
            
            {/* Nexus UI routes */}
            <Route path="nexus" element={<NexusShowcase />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
};

export default App;
