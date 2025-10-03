# Image Upload Guide for VPS Deployment

## Overview
The food truck marketplace now supports custom image uploads in the admin panel, making it perfect for VPS deployment instead of Vercel.

## Features Added

### 1. File Upload API (`/api/upload`)
- **POST**: Upload images (JPEG, PNG, WebP, SVG)
- **DELETE**: Remove uploaded images
- File size limit: 5MB
- Automatic unique filename generation
- Server-side file validation

### 2. Enhanced Admin Panel
- **Drag & Drop**: Upload images by dragging files
- **Click to Upload**: Traditional file picker
- **Progress Indicator**: Visual upload progress
- **Image Management**: View, remove uploaded images
- **Mixed Support**: Use both uploaded and predefined images

### 3. File Storage
- Uploads stored in: `public/uploads/foodtrucks/`
- Files excluded from git tracking
- Automatic directory creation

## How to Use

### For Administrators:
1. Go to Admin Panel → Products
2. Click "Ajouter un Food Truck" or edit existing truck
3. In the Images section:
   - **Upload Custom Images**: Drag & drop or click to upload
   - **Use Predefined Images**: Select from category-specific SVGs
   - **Mix Both**: Combine uploaded and predefined images
4. Save the food truck

### File Requirements:
- **Supported Formats**: JPEG, JPG, PNG, WebP, SVG
- **Maximum Size**: 5MB per file
- **Recommended**: High-quality images for best display

## VPS Deployment Benefits

### Why This Works Better on VPS:
1. **Persistent Storage**: Files stay on your server
2. **No External Dependencies**: No need for cloud storage services
3. **Full Control**: Manage your own file storage
4. **Cost Effective**: No per-upload charges
5. **Custom Domains**: Serve images from your domain

### Server Requirements:
- Node.js 18+ 
- File system write permissions
- Sufficient disk space for images
- Web server (nginx/apache) for serving static files

## File Management

### Automatic Cleanup:
- When removing images from food trucks, files are automatically deleted
- Orphaned files can be manually cleaned up from `public/uploads/foodtrucks/`

### Backup Considerations:
- Include `public/uploads/` in your backup strategy
- Consider automated backups for uploaded content

## Security Notes:
- File type validation on both client and server
- File size limits enforced
- Unique filenames prevent conflicts
- No executable files allowed

## Migration from Vercel:
1. Deploy to your VPS
2. Upload images through the admin panel
3. All existing predefined images continue to work
4. New uploads are stored locally on your server

This setup gives you complete control over your food truck images and eliminates dependency on external services.
