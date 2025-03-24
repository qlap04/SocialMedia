import cloudinary from '../../../../shared/config/cloudinary.config';
import fs from 'fs/promises';

export const uploadToCloudinary = async (filePath: string): Promise<string> => {
    try {
        console.log('Uploading file:', filePath);
        await fs.access(filePath);

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'social-media/uploads',
            resource_type: 'auto',
        });

        if (!result || !result.secure_url) {
            throw new Error('Failed to upload to Cloudinary: No secure_url returned');
        }

        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload to Cloudinary: ' + (error.message || 'Unknown error'));
    }
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
    try {
        const publicId = url.split('/').slice(-1)[0].split('.')[0];
        const folderPath = 'social-media/uploads';
        await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};