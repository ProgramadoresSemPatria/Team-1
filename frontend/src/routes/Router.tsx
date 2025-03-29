import { Route, Routes } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { LandingPage } from '@/pages/LandingPage';
import { AuthGuard } from '@/layouts/AuthGuard';
import { Upload } from '@/pages/Upload';
import AuthProvider from '@/context';

export function Router() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AuthGuard isPrivate={true} />}> 
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
