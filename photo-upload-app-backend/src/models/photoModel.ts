/**
 * Represents a photo object.
 */
export interface Photo {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  url: string;
  description: string; // Add the description property
}