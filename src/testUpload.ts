import cloudinary from './shared/config/cloudinary.config';
import path from 'path';

(async () => {
    try {
        // 'src/shared/uploads'
        const filePath = path.join(process.cwd(), 'src/shared/uploads', 'media-1742816343736-612964762.png');
        console.log('Test upload file:', filePath);

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'social-media/uploads',
            resource_type: 'auto',
        });
        console.log('Upload result:', result);
    } catch (error) {
        console.error('Error in test upload:', error);
    }
})();