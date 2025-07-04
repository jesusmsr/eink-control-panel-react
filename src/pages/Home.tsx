/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://eink-api.jsanr.dev/api/battery-latest'
        );
        setData(response.data);
        console.log(response.data); // 🔥 Muestra la respuesta en la consola
      } catch (err: any) {
        console.error('Error al traer datos', err);
        setError('Hubo un error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className='flex flex-row justify-between'>
        <h1 className='text-2xl font-bold'>Panel de control</h1>
        <button
          className='btn btn-primary'
          onClick={() => {
            navigate('/login');
          }}
        >
          Admin
        </button>
      </div>

      <div className='mt-8'>
        <span className='font-bold'>Batería:</span>
        <span>
          {' '}
          {data?.voltage_level}V a las {data?.timestamp}
        </span>
      </div>
      <hr className='border-t border-gray-300 my-4' />
      <h1 className='text-2xl font-bold'>Subir imagen</h1>
      <div className='mt-4'>
        <ImageUploader />
      </div>
    </div>
  );
}
