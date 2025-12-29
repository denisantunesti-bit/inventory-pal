import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { MovementProvider } from "@/contexts/MovementContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Inventario from "./pages/Inventario";
import Estoque from "./pages/Estoque";
import Cadastro from "./pages/Cadastro";
import Historico from "./pages/Historico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MovementProvider>
          <InventoryProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Index />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventario"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Inventario />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/estoque"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Estoque />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cadastro"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Cadastro />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/historico"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Historico />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </InventoryProvider>
        </MovementProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
