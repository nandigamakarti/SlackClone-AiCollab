import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MessageProvider } from "@/contexts/MessageContext";
import Index from "./pages/Index";
import WorkspacesPage from "./pages/WorkspacesPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/landing/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('ProtectedRoute check:', { isAuthenticated, isLoading });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 relative">
              <svg 
                className="w-8 h-8 text-white opacity-50"
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.8 7.6L21 8.4L16.5 12.8L17.6 19L12 16.1L6.4 19L7.5 12.8L3 8.4L9.2 7.6L12 2Z" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="white" 
                />
              </svg>
              <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Loading
            </h1>
            <p className="text-sm text-gray-500">
              Please wait while we prepare your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route 
        path="/workspaces" 
        element={
          <ProtectedRoute>
            <WorkspacesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <MessageProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </MessageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
