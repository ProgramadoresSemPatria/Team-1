import { Route, Routes } from 'react-router-dom';
import App from '../App';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { AuthGuard } from '@/layouts/AuthGuard';
import { Upload } from '@/pages/Upload';
import AuthProvider from '@/context';

export function Router() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AuthGuard isPrivate={true} />}>
          <Route path="/" element={<App />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
