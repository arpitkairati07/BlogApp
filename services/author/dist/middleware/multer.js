import multer from 'multer';
const storage = multer.memoryStorage(); // If you want to save image on server we use diskstorage , or if on cloud then use memorystorage
const uploadFile = multer({ storage }).single("file");
export default uploadFile;
//# sourceMappingURL=multer.js.map