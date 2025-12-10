// utils/storage/deleteImages.ts
import fs from 'fs';
import path from 'path';

export const deleteImageFiles = (imagePaths: string[]) => {
  try {
    imagePaths.forEach((imagePath) => {
      // Remove the leading slash if present
      const relativePath = imagePath.startsWith('/') 
        ? imagePath.substring(1) 
        : imagePath;
      
      const fullPath = path.join(process.cwd(), relativePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted image: ${fullPath}`);
      } else {
        console.log(`Image not found: ${fullPath}`);
      }
    });
  } catch (error) {
    console.error('Error deleting image files:', error);
  }
};