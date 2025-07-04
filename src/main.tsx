import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import { Login } from './pages/Login.tsx';
import { Admin } from './pages/Admin.tsx';
import { AllImages } from './pages/AllImages.tsx';
import { PrivateRoute } from './components/Privateroute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <div className='p-10'>
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/admin'
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route
              path='/all-images'
              element={
                <PrivateRoute>
                  <AllImages />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </div>
);
