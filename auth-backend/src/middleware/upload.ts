// // middleware/upload.ts
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// // Ensure upload folder exists
// const uploadPath = path.join(process.cwd(), "uploads/profile");
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//         cb(null, uniqueName);
//     }
// });

// // Allow only image formats
// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any) => {
//     const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

//     if (!allowed.includes(file.mimetype)) {
//         return cb(new Error("Only image files are allowed!"), false);
//     }

//     cb(null, true);
// };

// export const uploadProfile = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 2 * 1024 * 1024 } // 2MB max
// });
