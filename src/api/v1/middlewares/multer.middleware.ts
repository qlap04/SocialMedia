import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'src/shared/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const uploadMulter = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024, files: 5 }, // Max: 50MB, 5 file
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4|mov/; // Support Image | Video
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, gif) and videos (mp4, mov) are allowed'));
    },
});

export default uploadMulter;