import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { MovementProvider } from "@/contexts/MovementContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Inventario from "./pages/Inventario";
import Estoque from "./pages/Estoque";
import Cadastro from "./pages/Cadastro";
import Historico from "./pages/Historico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MovementProvider>
        <InventoryProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/estoque" element={<Estoque />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </InventoryProvider>
      </MovementProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
