# Photo Upload App - Complete API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Frontend Components](#frontend-components)
3. [Backend API Endpoints](#backend-api-endpoints)
4. [Backend Controllers](#backend-controllers)
5. [Backend Middlewares](#backend-middlewares)
6. [Data Models](#data-models)
7. [Configuration](#configuration)
8. [Error Handling](#error-handling)
9. [Usage Examples](#usage-examples)

## Overview

The Photo Upload App is a fullstack application consisting of a React Native frontend (using Expo) and a Node.js/TypeScript backend. The application allows users to upload, browse, and manage photos with features like pagination, search, and deletion.

### Architecture
- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express and TypeScript
- **File Storage**: Local filesystem with multer
- **API**: RESTful API with JSON responses

---

## Frontend Components

### 1. PhotoUpload Component

**File**: `photo-upload-app-frontend/components/PhotoUpload.tsx`

A React Native component for single photo upload functionality.

#### Features
- Image selection from device gallery
- Upload confirmation dialog
- Progress tracking during upload
- Error and success state management

#### Props
This component doesn't accept any props (standalone component).

#### State Management
- `image`: Selected image URI
- `error`: Error message string
- `loading`: Loading state boolean
- `success`: Success message string
- `uploadProgress`: Upload progress percentage

#### Methods

##### `pickImage(): Promise<void>`
Opens the device image picker and allows user to select an image.

**Example:**
```javascript
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  // Handle result...
};
```

##### `uploadImage(): Promise<void>`
Uploads the selected image to the backend server.

**API Call:**
- **Method**: POST
- **URL**: `http://localhost:5000/api/photos/upload`
- **Content-Type**: `multipart/form-data`

**Example Usage:**
```jsx
import PhotoUpload from './components/PhotoUpload';

function App() {
  return <PhotoUpload />;
}
```

---

### 2. PhotoGallery Component

**File**: `photo-upload-app-frontend/components/PhotoGallery.tsx`

A React Native component for displaying photos in a grid layout with pagination and search functionality.

#### Features
- Grid layout photo display
- Pagination controls
- Search functionality
- Delete photo capability
- Loading states

#### State Management
- `photos`: Array of photo objects
- `error`: Error message string
- `loading`: Loading state boolean
- `page`: Current page number
- `limit`: Photos per page limit
- `total`: Total number of photos
- `searchQuery`: Search query string

#### Methods

##### `fetchPhotos(): Promise<void>`
Fetches photos from the backend with pagination.

**API Call:**
- **Method**: GET
- **URL**: `http://localhost:5000/api/photos/browse?page=${page}&limit=${limit}`

##### `deletePhoto(filename: string): Promise<void>`
Deletes a photo by filename.

**Parameters:**
- `filename` (string): The filename of the photo to delete

**API Call:**
- **Method**: DELETE
- **URL**: `http://localhost:5000/api/photos/${filename}`

##### `handleNextPage(): void`
Navigates to the next page of photos.

##### `handlePreviousPage(): void`
Navigates to the previous page of photos.

##### `handleSearch(query: string): void`
Handles search input changes.

**Example Usage:**
```jsx
import PhotoGallery from './components/PhotoGallery';

function App() {
  return <PhotoGallery />;
}
```

---

### 3. MultiplePhotoUpload Component

**File**: `photo-upload-app-frontend/components/MultiplePhotoUpload.tsx`

A React Native component for uploading multiple photos at once.

#### Features
- Multiple image selection
- Batch upload functionality
- Progress tracking
- Image preview grid

#### State Management
- `images`: Array of selected image URIs
- `error`: Error message string
- `loading`: Loading state boolean
- `success`: Success message string

#### Methods

##### `pickImages(): Promise<void>`
Opens the device image picker for multiple image selection.

##### `uploadImages(): Promise<void>`
Uploads all selected images to the backend.

**Example Usage:**
```jsx
import MultiplePhotoUpload from './components/MultiplePhotoUpload';

function App() {
  return <MultiplePhotoUpload />;
}
```

---

### 4. PhotoDetails Component

**File**: `photo-upload-app-frontend/components/PhotoDetails.tsx`

A React Native component for editing photo metadata.

#### Props

```typescript
interface PhotoDetailsProps {
  photo: {
    filename: string;
    description: string;
  };
  onSave: (updatedPhoto: { filename: string; description: string }) => void;
  onCancel: () => void;
}
```

#### Methods

##### `handleSave(): void`
Validates and saves the updated photo description.

**Example Usage:**
```jsx
import PhotoDetails from './components/PhotoDetails';

function App() {
  const photo = { filename: 'photo.jpg', description: 'A beautiful sunset' };
  
  const handleSave = (updatedPhoto) => {
    console.log('Updated photo:', updatedPhoto);
  };
  
  const handleCancel = () => {
    console.log('Cancelled editing');
  };

  return (
    <PhotoDetails 
      photo={photo} 
      onSave={handleSave} 
      onCancel={handleCancel} 
    />
  );
}
```

---

### 5. PhotoPreview Component

**File**: `photo-upload-app-frontend/components/PhotoPreview.tsx`

A React Native modal component for full-screen photo preview.

#### Props

```typescript
interface PhotoPreviewProps {
  visible: boolean;
  photoUrl: string;
  onClose: () => void;
}
```

**Example Usage:**
```jsx
import PhotoPreview from './components/PhotoPreview';

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const photoUrl = 'http://localhost:5000/uploads/photo.jpg';

  return (
    <PhotoPreview 
      visible={modalVisible}
      photoUrl={photoUrl}
      onClose={() => setModalVisible(false)}
    />
  );
}
```

---

### 6. App Component

**File**: `photo-upload-app-frontend/app/App.tsx`

The main application component that renders PhotoUpload and PhotoGallery components.

**Example:**
```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PhotoUpload from '../components/PhotoUpload';
import PhotoGallery from '../components/PhotoGallery';

export default function App() {
  return (
    <View style={styles.container}>
      <PhotoUpload />
      <PhotoGallery />
    </View>
  );
}
```

---

## Backend API Endpoints

### Base URL
`http://localhost:5000/api/photos`

### 1. Upload Photo

**Endpoint**: `POST /api/photos/upload`

Uploads a single photo to the server.

#### Request
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `photo` field containing the image file

#### Response

**Success (200):**
```json
{
  "message": "File uploaded successfully!",
  "photo": {
    "filename": "1638360000000-photo.jpg",
    "path": "/path/to/uploads/1638360000000-photo.jpg",
    "mimetype": "image/jpeg",
    "size": 1234567,
    "url": "http://localhost:5000/uploads/1638360000000-photo.jpg"
  }
}
```

**Error (400):**
```json
{
  "message": "No file uploaded!"
}
```

#### Example Usage

```javascript
const formData = new FormData();
formData.append('photo', {
  uri: imageUri,
  name: 'photo.jpg',
  type: 'image/jpeg',
});

const response = await fetch('http://localhost:5000/api/photos/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

#### cURL Example
```bash
curl -X POST \
  http://localhost:5000/api/photos/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'photo=@/path/to/your/photo.jpg'
```

---

### 2. Browse Photos

**Endpoint**: `GET /api/photos/browse`

Retrieves a paginated list of uploaded photos with optional search functionality.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of photos per page (default: 10)
- `search` (optional): Search query to filter photos by filename

#### Response

**Success (200):**
```json
{
  "photos": [
    {
      "filename": "1638360000000-photo1.jpg",
      "path": "/path/to/uploads/1638360000000-photo1.jpg",
      "mimetype": "image/jpeg",
      "size": 1234567,
      "url": "http://localhost:5000/uploads/1638360000000-photo1.jpg"
    },
    {
      "filename": "1638360001000-photo2.jpg",
      "path": "/path/to/uploads/1638360001000-photo2.jpg",
      "mimetype": "image/jpeg",
      "size": 2345678,
      "url": "http://localhost:5000/uploads/1638360001000-photo2.jpg"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

**Error (500):**
```json
{
  "message": "Unable to scan directory!"
}
```

#### Example Usage

```javascript
// Basic request
const response = await fetch('http://localhost:5000/api/photos/browse');

// With pagination
const response = await fetch('http://localhost:5000/api/photos/browse?page=2&limit=5');

// With search
const response = await fetch('http://localhost:5000/api/photos/browse?search=sunset');
```

#### cURL Examples
```bash
# Basic request
curl http://localhost:5000/api/photos/browse

# With pagination
curl "http://localhost:5000/api/photos/browse?page=2&limit=5"

# With search
curl "http://localhost:5000/api/photos/browse?search=sunset"
```

---

### 3. Delete Photo

**Endpoint**: `DELETE /api/photos/:filename`

Deletes a photo by its filename.

#### URL Parameters
- `filename` (required): The filename of the photo to delete

#### Response

**Success (200):**
```json
{
  "message": "File deleted successfully!"
}
```

**Error (500):**
```json
{
  "message": "Unable to delete file!"
}
```

#### Example Usage

```javascript
const filename = '1638360000000-photo.jpg';
const response = await fetch(`http://localhost:5000/api/photos/${filename}`, {
  method: 'DELETE',
});
```

#### cURL Example
```bash
curl -X DELETE http://localhost:5000/api/photos/1638360000000-photo.jpg
```

---

## Backend Controllers

### File: `photo-upload-app-backend/src/controllers/photoController.ts`

### 1. uploadPhoto

```typescript
export const uploadPhoto = (req: Request, res: Response): void
```

Handles single photo upload requests.

**Parameters:**
- `req`: Express Request object containing the uploaded file
- `res`: Express Response object

**Functionality:**
- Validates that a file was uploaded
- Creates a photo object with metadata
- Returns success response with photo details

---

### 2. browsePhotos

```typescript
export const browsePhotos = async (req: Request, res: Response): Promise<void>
```

Handles photo browsing requests with pagination and search.

**Parameters:**
- `req`: Express Request object with query parameters
- `res`: Express Response object

**Query Parameters:**
- `page`: Page number for pagination
- `limit`: Number of photos per page
- `search`: Search query for filtering

**Functionality:**
- Reads the uploads directory
- Filters photos based on search query
- Implements pagination
- Returns paginated photo list with metadata

---

### 3. deletePhoto

```typescript
export const deletePhoto = (req: Request, res: Response): void
```

Handles photo deletion requests.

**Parameters:**
- `req`: Express Request object with filename parameter
- `res`: Express Response object

**Functionality:**
- Extracts filename from request parameters
- Deletes the file from the filesystem
- Returns success or error response

---

### 4. updatePhotoMetadata

```typescript
export const updatePhotoMetadata = (req: Request, res: Response): void
```

Handles photo metadata update requests.

**Parameters:**
- `req`: Express Request object with filename and description
- `res`: Express Response object

**Functionality:**
- Updates photo description metadata
- Returns updated photo object

---

### 5. uploadMultiplePhotos

```typescript
export const uploadMultiplePhotos = (req: Request, res: Response): void
```

Handles multiple photo upload requests.

**Parameters:**
- `req`: Express Request object containing multiple uploaded files
- `res`: Express Response object

**Functionality:**
- Validates that files were uploaded
- Creates photo objects for each file
- Returns success response with all photo details

---

## Backend Middlewares

### 1. Upload Middleware

**File**: `photo-upload-app-backend/src/middlewares/uploadMiddleware.ts`

```typescript
export const upload = multer({ storage, fileFilter });
```

Configures multer for file uploads with storage and filtering options.

**Features:**
- Saves files to `./uploads/` directory
- Generates unique filenames with timestamps
- Filters files to allow only images (.jpg, .jpeg, .png, .gif)

**Usage:**
```typescript
// Single file upload
router.post('/upload', upload.single('photo'), uploadPhoto);

// Multiple file upload
router.post('/upload-multiple', upload.array('photos'), uploadMultiplePhotos);
```

---

### 2. Validation Middleware

**File**: `photo-upload-app-backend/src/middlewares/validatePhoto.ts`

```typescript
export const validatePhoto = (req: Request, res: Response, next: NextFunction)
```

Validates that a photo file is present in the upload request.

**Functionality:**
- Checks if `req.file` exists
- Returns 400 error if no file is uploaded
- Calls `next()` if validation passes

---

### 3. Error Middleware

**File**: `photo-upload-app-backend/src/middlewares/errorMiddleware.ts`

```typescript
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction)
```

Global error handling middleware for the application.

**Functionality:**
- Logs error stack to console
- Returns 500 status with error message
- Handles all unhandled errors

---

### 4. Request Logger Middleware

**File**: `photo-upload-app-backend/src/middlewares/requestLogger.ts`

```typescript
export const requestLogger = (req: Request, res: Response, next: NextFunction)
```

Logs incoming HTTP requests.

**Functionality:**
- Logs HTTP method and URL
- Continues to next middleware

---

## Data Models

### Photo Interface

**File**: `photo-upload-app-backend/src/models/photo.ts`

```typescript
export interface Photo {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  url: string;
  description?: string; // Optional field for photo descriptions
}
```

**Fields:**
- `filename`: Original or generated filename
- `path`: Full filesystem path to the photo
- `mimetype`: MIME type of the image (e.g., 'image/jpeg')
- `size`: File size in bytes
- `url`: Full URL to access the photo
- `description`: Optional description for the photo

---

## Configuration

### Application Config

**File**: `photo-upload-app-backend/src/config/index.ts`

```typescript
export const config = {
  PORT: process.env.PORT || 5000,
};
```

**Environment Variables:**
- `PORT`: Server port (default: 5000)

### CORS Configuration

The application is configured to allow requests from the Expo development server:

```typescript
app.use(cors({
  origin: 'http://localhost:19006'
}));
```

---

## Error Handling

### Frontend Error Handling

All frontend components implement comprehensive error handling:

1. **Network Errors**: Handled in API calls with try-catch blocks
2. **Validation Errors**: Form validation for required fields
3. **User Feedback**: Error messages displayed to users
4. **Loading States**: Visual indicators during async operations

### Backend Error Handling

1. **Middleware Error Handler**: Global error handling middleware
2. **File System Errors**: Handled in controller functions
3. **Validation Errors**: Request validation middleware
4. **HTTP Status Codes**: Appropriate status codes for different scenarios

### Common Error Responses

```json
// Validation Error
{
  "message": "No file uploaded!"
}

// File System Error
{
  "message": "Unable to scan directory!"
}

// Deletion Error
{
  "message": "Unable to delete file!"
}
```

---

## Usage Examples

### Complete Upload Flow

```javascript
// Frontend: Select and upload photo
const uploadPhoto = async () => {
  try {
    // 1. Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // 2. Prepare form data
      const formData = new FormData();
      formData.append('photo', {
        uri: result.assets[0].uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      // 3. Upload to server
      const response = await fetch('http://localhost:5000/api/photos/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
      }
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Complete Browse Flow

```javascript
// Frontend: Browse photos with pagination
const browsePhotos = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/photos/browse?page=${page}&limit=${limit}`
    );
    
    if (response.ok) {
      const data = await response.json();
      setPhotos(data.photos);
      setTotal(data.total);
      setCurrentPage(data.page);
    }
  } catch (error) {
    console.error('Browse failed:', error);
  }
};
```

### Server Setup Example

```javascript
// Backend: Complete server setup
import express from 'express';
import photoRoutes from './routes/photoRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:19006' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/photos', photoRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
```

---

## Development Setup

### Frontend Setup

```bash
cd photo-upload-app-frontend
npm install
npx expo start
```

### Backend Setup

```bash
cd photo-upload-app-backend
npm install
npm start
```

### Required Dependencies

**Frontend:**
- expo
- expo-image-picker
- react-native

**Backend:**
- express
- multer
- cors
- typescript

---

This documentation covers all public APIs, functions, and components in the Photo Upload App. Each section includes detailed examples, parameter descriptions, and usage instructions to help developers understand and integrate with the application.