import { useNavigate } from 'react-router-dom';

export function Admin() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className='text-2xl font-bold'>Admin</h1>
      <div className='mt-15 flex flex-col gap-3'>
        <button className='btn btn-primary' onClick={() => navigate('/')}>
          Subir nueva foto
        </button>
        <button
          className='btn btn-primary'
          onClick={() => navigate('/all-images')}
        >
          Ver todas las fotos
        </button>
        <button className='btn btn-primary'>Definir horarios</button>
      </div>
    </div>
  );
}
