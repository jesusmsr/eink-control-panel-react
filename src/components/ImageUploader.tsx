import { Button, Slider } from '@mui/material';
import { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { useCallback } from 'react';

export function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'cropped.png');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload-image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Upload response:', data);
      alert('✅ Imagen subida correctamente!');
    } catch (err) {
      console.error('Error uploading image', err);
      alert('❌ Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className='flex bg-gray-200 w-full items-center justify-center p-5'>
        {!imageSrc && (
          <div className='flex bg-gray-200  w-full items-center justify-center rounded-lg'>
            <label className='flex flex-col w-3/4 justify-center items-center rounded-xl bg-white  h-full cursor-pointer hover:bg-gray-100 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={3}
                stroke='currentColor'
                className='size-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
                />
              </svg>
              <h1 className='text-md mt-2'>SELECCIONA UNA FOTO</h1>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
        {imageSrc && (
          <>
            <div>
              <div className='relative w-full h-100 bg-gray-200 mt-4 rounded-lg'>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={480 / 800}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className='flex flex-col items-center space-y-2 mt-4 w-full'>
                <div className='flex flex-row gap-2 justify-center items-center w-2/3'>
                  <button
                    className='btn btn-primary'
                    onClick={() => setRotation(rotation - 90)}
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
                        d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
                      />
                    </svg>
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={() => setRotation(rotation + 90)}
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
                        d='m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3'
                      />
                    </svg>
                  </button>
                </div>
                <div className='flex gap-3 space-x-2'>
                  <button
                    disabled={uploading}
                    className='btn btn-primary'
                    onClick={handleUpload}
                  >
                    {uploading ? 'Subiendo...' : 'Subir Imagen'}
                  </button>
                  <button
                    disabled={uploading}
                    className='btn bg-red-500'
                    onClick={() => setImageSrc(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
