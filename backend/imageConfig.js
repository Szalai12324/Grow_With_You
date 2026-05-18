import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ide kerülnek a képek
  },
  filename: (req, file, cb) => {
    // Generálunk egy egyedi nevet: időbélyeg + eredeti kiterjesztés
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

export default upload;