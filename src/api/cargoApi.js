import { apiClient } from './client';
import { ENDPOINTS } from '../constants/api';

/**
 * Cargo scan API - uploads cargo image for AI scanning
 * @param {Object} imageFile - Image file object from ImageCropPicker
 * @param {string} imageFile.path - File path
 * @param {string} imageFile.mime - MIME type
 * @param {string} imageFile.filename - File name
 * @returns {Promise<Object>} Scan result from API
 */
const cargoScan = async (imageFile) => {
  try {
    const formData = new FormData();

    // Prepare image for upload
    const imageData = {
      uri: imageFile.path,
      type: imageFile.mime || 'image/jpeg',
      name: imageFile.filename || `cargo_${Date.now()}.jpg`,
    };

    console.log('📦 Preparing cargo scan upload:');
    console.log('  - Image URI:', imageData.uri);
    console.log('  - Image Type:', imageData.type);
    console.log('  - Image Name:', imageData.name);

    // FastAPI UploadFile - standard field name is 'file'
    // Backend endpoint: POST /api/User/jobs/cargo-scan
    // Backend expects: file: UploadFile
    formData.append('file', imageData);

    console.log('📤 FormData field name: "file" (FastAPI UploadFile)');
    console.log('📤 Sending cargo scan request to:', ENDPOINTS.cargoScan);

    // Use apiClient.upload which handles auth automatically
    const data = await apiClient.upload(ENDPOINTS.cargoScan, formData);

    console.log('✅ Cargo Scan Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Cargo Scan Error:', error.message);
    console.error('❌ Error details:', error);
    throw error;
  }
};

export const cargoApi = {
  scan: cargoScan,
};
