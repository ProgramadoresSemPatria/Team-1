import { Route, Routes } from 'react-router-dom';
import App from '../App';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
