/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import Solution from './pages/Solution';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

import Patients from './pages/Patients';
import Professionals from './pages/Professionals';
import Agenda from './pages/Agenda';
import Financeiro from './pages/Financeiro';
import Servicos from './pages/Servicos';
import Comandas from './pages/Comandas';
import Caixa from './pages/Caixa';
import Precificacao from './pages/Precificacao';
import Desempenho from './pages/Desempenho';
import Mensagens from './pages/Mensagens';
import Subscription from './pages/dashboard/Subscription';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Main Website Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Solution />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/checkout" element={<Checkout />} />
            </Route>


            {/* Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="pacientes" element={<Patients />} />
                <Route path="profissionais" element={<Professionals />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="comandas" element={<Comandas />} />
                <Route path="caixa" element={<Caixa />} />
                <Route path="precificacao" element={<Precificacao />} />
                <Route path="desempenho" element={<Desempenho />} />
                <Route path="mensagens" element={<Mensagens />} />
                <Route path="financeiro" element={<Financeiro />} />
                <Route path="servicos" element={<Servicos />} />
                <Route path="assinatura" element={<Subscription />} />
                {/* Add more dashboard sub-routes here in the future */}
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

