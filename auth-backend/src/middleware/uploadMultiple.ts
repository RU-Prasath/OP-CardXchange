// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const uploadPath = path.join(process.cwd(), "uploads/cards");
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, uploadPath),
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
//   },
// });

// // allow images only
// const fileFilter = (
//   _req: Express.Request,
//   file: Express.Multer.File,
//   cb: any
// ) => {
//   const allowed = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "image/heic",
//     "image/heif",
//     "image/jfif",
//   ];

//   if (!allowed.includes(file.mimetype)) {
//     return cb(new Error("Only images allowed"), false);
//   }

//   cb(null, true);
// };

// export const uploadCards = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 3 * 1024 * 1024 }, // 3MB per file
// });
