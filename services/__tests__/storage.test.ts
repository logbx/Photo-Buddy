import * as FileSystem from 'expo-file-system';
import { saveImage, deleteImage, getImageInfo } from '../storage';

// Mock expo-file-system's new File/Directory API
jest.mock('expo-file-system', () => {
  class MockFile {
    uri: string;
    exists = true;
    size = 1024;

    constructor(path: string, filename?: string) {
      this.uri = filename ? `file:///mock/documents/${filename}` : path;
    }

    async copy(dest: any) {
      return Promise.resolve();
    }

    async delete() {
      return Promise.resolve();
    }

    async base64() {
      return Promise.resolve('mock-base64-data');
    }
  }

  class MockDirectory {
    exists = true;

    constructor(path: string, name: string) {}

    async create() {
      return Promise.resolve();
    }

    async list() {
      return Promise.resolve([]);
    }
  }

  return {
    File: MockFile,
    Directory: MockDirectory,
    Paths: {
      document: 'file:///mock/documents/',
    },
  };
});

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveImage', () => {
    it('should save an image and return a URI', async () => {
      const sourceUri = 'file:///temp/test.jpg';

      const result = await saveImage(sourceUri);

      expect(result).toContain('file:///mock/documents/');
      expect(result).toContain('.jpg');
    });
  });

  describe('deleteImage', () => {
    it('should delete an image without throwing', async () => {
      const uri = 'file:///mock/documents/images/test.jpg';

      await expect(deleteImage(uri)).resolves.not.toThrow();
    });
  });

  describe('getImageInfo', () => {
    it('should return file information', () => {
      const uri = 'file:///mock/documents/images/test.jpg';

      const info = getImageInfo(uri);

      expect(info).toHaveProperty('uri');
      expect(info).toHaveProperty('exists');
    });
  });
});
