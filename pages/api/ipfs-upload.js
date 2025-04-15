// pages/api/ipfs-upload.js
// Next.js API route for uploading models and metadata to IPFS

import formidable from 'formidable';
import fs from 'fs';
import { uploadModel, uploadMetadata } from '../../lib/ipfsService';

export const config = {
  api: {
    bodyParser: false, // Disables Next.js body parser for file uploads
  },
};

/**
 * API endpoint to upload a model file and metadata to IPFS.
 * Accepts multipart/form-data with fields: file, name, description, price, totalCopies, subPrice, subDuration
 * Returns: { modelCid, metadataCid }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Form parsing error' });
      return;
    }
    try {
      // Validate file type and size (max 100MB)
      const file = files.file;
      if (!file) throw new Error('No file uploaded');
      if (file.size > 100 * 1024 * 1024) throw new Error('File too large (max 100MB)');
      // Optionally check file.mimetype or file.originalFilename for allowed types
      const fileBuffer = fs.readFileSync(file.filepath);
      const modelCid = await uploadModel(fileBuffer);
      const metadataCid = await uploadMetadata(
        fields.name,
        fields.description,
        fields.price,
        modelCid,
        fields.totalCopies,
        fields.subPrice,
        fields.subDuration
      );
      res.status(200).json({ modelCid, metadataCid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
