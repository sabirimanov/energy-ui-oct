import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { I18nProvider } from "@/contexts/i18n";
import { SettingsProvider } from "@/contexts/settings";
import { DataProvider } from "@/contexts/data";
import Header from "@/components/Header";
import SectionPage from "@/pages/Section";
import SearchPage from "@/pages/Search";
import ArticlePage from "@/pages/Article";
import SubPage from "@/pages/SubPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <I18nProvider>
        <SettingsProvider>
          <DataProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/section/:id" element={<SectionPage />} />
                <Route
                  path="/section/:id/article/:articleId"
                  element={<ArticlePage />}
                />
                <Route
                  path="/section/:id/page/:pageId"
                  element={<SubPage />}
                />
                <Route path="/page/:pageId" element={<SubPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </SettingsProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
