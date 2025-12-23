import { File, Directory, Paths } from "expo-file-system";
import { Project } from "@/types/project";

// Images directory in the app's document storage
const getImagesDir = () => new Directory(Paths.document, "images");

// Ensure the images directory exists
async function ensureImagesDir(): Promise<Directory> {
  const imagesDir = getImagesDir();
  if (!imagesDir.exists) {
    await imagesDir.create();
  }
  return imagesDir;
}

/**
 * Save an image to the app's document directory
 * @param sourceUri The source URI of the image (could be from camera roll or temp)
 * @returns The permanent URI in the app's storage
 */
export async function saveImage(sourceUri: string): Promise<string> {
  const imagesDir = await ensureImagesDir();

  const filename = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
  const sourceFile = new File(sourceUri);
  const destFile = new File(imagesDir, filename);

  await sourceFile.copy(destFile);

  return destFile.uri;
}

/**
 * Delete an image from storage
 */
export async function deleteImage(uri: string): Promise<void> {
  try {
    const file = new File(uri);
    if (file.exists) {
      await file.delete();
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

/**
 * Read an image as base64
 */
export async function readImageAsBase64(uri: string): Promise<string> {
  try {
    const file = new File(uri);
    const base64 = await file.base64();
    return base64;
  } catch (error) {
    console.error("Error reading image as base64:", error);
    throw error;
  }
}

/**
 * Get file info
 */
export function getImageInfo(uri: string) {
  const file = new File(uri);
  return {
    exists: file.exists,
    uri: file.uri,
    size: file.size,
  };
}

/**
 * Clean up orphaned images (images not referenced by any project)
 */
export async function cleanupOrphanedImages(projects: Project[]): Promise<void> {
  try {
    const imagesDir = await ensureImagesDir();

    // Get all image URIs from projects
    const usedUris = new Set<string>();
    projects.forEach((project) => {
      usedUris.add(project.referenceImage.uri);
      project.attempts.forEach((attempt) => {
        usedUris.add(attempt.imageUri);
      });
    });

    // List all files in the images directory
    const files = await imagesDir.list();

    // Delete any files not in use
    for (const file of files) {
      if (file instanceof File && !usedUris.has(file.uri)) {
        await file.delete();
        console.log("Cleaned up orphaned image:", file.uri);
      }
    }
  } catch (error) {
    console.error("Error cleaning up orphaned images:", error);
  }
}
