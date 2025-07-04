/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { isAuthenticated, login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        console.log('OK');
        navigate('/admin');
      } else {
        setError('❌ Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('❌ Error de conexión con el servidor');
    }
  };

  return (
    <>
      <h1 className='text-2xl font-bold'>Login</h1>
      <div className='w-full'>
        <div className='grid gap-3 mt-45'>
          <label htmlFor='input-with-label' className='label'>
            User
          </label>
          <input
            className='input'
            id='input-with-label'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='grid gap-3 mt-5'>
          <label htmlFor='input-with-label' className='label'>
            Password
          </label>
          <input
            className='input'
            id='input-with-label'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='grid gap-3 mt-5'>
          <button className='btn btn-primary' onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
