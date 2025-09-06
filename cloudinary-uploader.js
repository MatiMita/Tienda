import { cloudinaryConfig } from './cloudinary-config.js';

class CloudinaryUploader {
    constructor() {
        this.cloudName = cloudinaryConfig.cloudName;
        this.uploadPreset = cloudinaryConfig.uploadPreset;
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);

        try {
            console.log('Iniciando subida a Cloudinary...');
            const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                publicId: data.public_id
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

export const cloudinaryUploader = new CloudinaryUploader();
