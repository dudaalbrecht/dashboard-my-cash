import { Routes, Route, Navigate } from 'react-router-dom'
import { FinanceProvider } from './contexts/FinanceContext'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Cartoes from './pages/Cartoes'
import Transacoes from './pages/Transacoes'
import Objetivos from './pages/Objetivos'
import Perfil from './pages/Perfil'

function App() {
  return (
    <FinanceProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cartoes" element={<Cartoes />} />
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/objetivos" element={<Objetivos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </MainLayout>
    </FinanceProvider>
  )
}

export default App
