import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import MainLayout from "./layouts/main-layout";    
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Todos from "./pages/Todos";                  

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected /todos, rendered inside MainLayout */}
          <Route path="/todos" element={<MainLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Todos />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
