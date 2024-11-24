# Photo Upload App

This project is a simple photo upload application consisting of a backend built with Node.js and TypeScript and a frontend built using Expo with React Native and TypeScript. The app allows users to upload photos and browse the uploaded photos.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## Features

- **Photo Upload**: Users can upload photos from their device.
- **Photo Gallery**: Users can browse all the uploaded photos.
- **Photo Deletion**: Users can delete photos from the gallery.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm or pnpm for managing packages
- Expo CLI
- Git

## Getting Started

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/photo-upload-app.git
cd photo-upload-app
```

## Backend Setup

Navigate to the backend directory:

```bash
cd photo-upload-app-backend
```

Install the required dependencies:

```bash
pnpm install
```

Start the backend server:

```bash
pnpm start
```

The server will be running on [http://localhost:5000](http://localhost:5000).

The backend provides three API endpoints:

- `POST /api/photos/upload`: Uploads a photo to the server.
- `GET /api/photos/browse`: Retrieves a list of all uploaded photos.
- `DELETE /api/photos/:filename`: Deletes a photo by filename.

## Frontend Setup

Navigate to the frontend directory:

```bash
cd ../photo-upload-app-frontend
```

Install the required dependencies:

```bash
pnpm install
```

Start the Expo development server:

```bash
pnpm start
```

This will open the Expo Developer Tools in your browser. You can run the app on an iOS simulator, Android emulator, or a physical device using the Expo Go app.

## Usage

### Uploading a Photo

1. Launch the frontend app using the Expo CLI.
2. Click the "Pick an image from camera roll" button to choose an image from your device.
3. After selecting an image, click the "Upload Image" button to upload the photo to the server.
4. A success message will appear if the upload is successful.

### Browsing Photos

1. After uploading, navigate to the gallery section.
2. The app will fetch and display all uploaded photos.

### Deleting a Photo

1. In the gallery section, each photo will have a delete button.
2. Click the delete button to remove the photo from the server.
3. A success message will appear if the deletion is successful.

## Project Structure

```plaintext
photo-upload-app/
│
├── photo-upload-app-backend/      # Backend source code
│   ├── src/
│   │   ├── index.ts               # Entry point for the backend server
│   │   └── middleware.ts          # Middleware for handling CORS and errors
│   ├── uploads/                   # Uploaded photos
│   ├── package.json               # Backend dependencies and scripts
│   └── tsconfig.json              # TypeScript configuration
│
├── photo-upload-app-frontend/     # Frontend source code
│   ├── components/
│   │   ├── PhotoGallery.tsx       # Component for displaying photos
│   │   └── PhotoUpload.tsx        # Component for uploading photos
│   ├── App.tsx                    # Main entry point for the React Native app
│   ├── package.json               # Frontend dependencies and scripts
│   └── app.json                   # Expo configuration
│
└── README.md                      # Project documentation
```

## API Documentation

### Upload Photo

- **URL**: POST /api/photos/upload
- **Description**: Upload a photo to the server.
- **Request**:
  - **Body**: `multipart/form-data`
  - **Field Name**: `photo`
  - **Type**: file (image/jpeg or image/png)
- **Response**:
  - **Status**: 200 (OK) if successful
  - **Body**: `{"message": "Photo uploaded successfully!"}`

### Browse Photos

- **URL**: GET /api/photos/browse
- **Description**: Retrieve all uploaded photos.
- **Response**:
  - **Status**: 200 (OK) if successful
  - **Body**:
```json
{
  "photos": [
    {
      "filename": "example.jpg",
      "path": "path/to/photo",
      "mimetype": "image/jpeg",
      "size": 12345,
      "url": "http://localhost:5000/uploads/example.jpg"
    }
  ]
}
```

### Delete Photo

- **URL**: DELETE /api/photos/:filename
- **Description**: Delete a photo by filename.
- **Response**:
  - **Status**: 200 (OK) if successful
  - **Body**: `{"message": "File deleted successfully!"}`

## Troubleshooting

### Common Issues

- **CORS Errors**:
  - Ensure the backend server has CORS enabled and allows requests from [http://localhost:19006](http://localhost:19006) (Expo's default development server).
  - Check the middleware configuration in `photo-upload-app-backend/src/index.ts`.

- **Image Upload Fails**:
  - Double-check that the correct API endpoint is used in the frontend ([http://localhost:5000/api/photos/upload](http://localhost:5000/api/photos/upload)).
  - Ensure the server is running and the `/uploads` directory is writable.

- **Photos Not Displaying**:
  - Verify that the `GET /api/photos/browse` endpoint is correctly fetching the data.
  - Ensure the response from the server is in the expected format.

- **Photo Deletion Fails**:
  - Double-check that the correct API endpoint is used in the frontend ([http://localhost:5000/api/photos/:filename](http://localhost:5000/api/photos/:filename)).
  - Ensure the server is running and the file exists in the `/uploads` directory.

- **Expo Server Not Starting**:
  - Make sure all dependencies are installed correctly using `pnpm install`.
  - Restart the development server using `pnpm start`.

### Enabling CORS

To enable CORS and allow requests from `http://localhost:19006`, follow these steps:

1. Open the `photo-upload-app-backend/src/index.ts` file.
2. Update the CORS configuration to allow requests from `http://localhost:19006`:

```typescript
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:19006'
}));
```

3. Save the file and restart the backend server.
