import { createImage, getRadianAngle } from './utils';

export default function getCroppedImg(imageSrc, crop, rotation = 0) {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Ajusta el tamaño del canvas al área recortada
      canvas.width = crop.width;
      canvas.height = crop.height;

      // Mueve el punto de rotación al centro del recorte
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Dibuja la imagen recortada y rotada
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      // Exporta a blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar el blob'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    };

    image.onerror = (error) => reject(error);
  });
}
