/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { Image } from '../models/Image';
import { useNavigate } from 'react-router-dom';

export function AllImages() {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/all-images`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('No se pudieron cargar las imágenes');
      }

      const data = await response.json();
      setImages(data); // Suponiendo que tu API devuelve una lista de objetos DisplayRequest
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  async function deleteImage(id: number) {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/delete-image/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchImages();
    } else {
      alert('❌ Error al eliminar la imagen');
    }
  }

  if (loading) return <p>🔄 Cargando imágenes...</p>;
  if (error) return <p className='text-red-500'>❌ {error}</p>;

  return (
    <>
      <div className='flex flex-row gap-4'>
        <button className='btn btn-primary' onClick={() => navigate('/admin')}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
            />
          </svg>
        </button>

        <h1 className='text-2xl font-bold'>Todas las fotos</h1>
      </div>

      <div className='grid grid-cols-2 mt-10 md:grid-cols-4 gap-4'>
        {images.map((img) => (
          <div key={img.id} className='rounded border p-1'>
            <img
              src={img.image_path}
              alt={`Imagen subida el ${new Date(
                img.timestamp
              ).toLocaleString()}`}
              className='rounded shadow'
            />
            <div className='flex p-2'>
              <button
                className='btn bg-red-500'
                onClick={() => deleteImage(img.id)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
