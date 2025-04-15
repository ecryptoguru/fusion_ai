// lib/ipfsService.js

import { create as createIpfsClient } from 'ipfs-http-client';

// Configure the IPFS client to use Infura's gateway
const ipfs = createIpfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

/**
 * Upload a file (e.g., model weights) to IPFS.
 * @param {File|Buffer|Blob} file - The file to upload.
 * @returns {Promise<string>} - The IPFS hash (CID).
 */
export async function uploadModel(file) {
  try {
    const result = await ipfs.add(file, { pin: true });
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS uploadModel error:', error);
    throw new Error('Failed to upload model to IPFS');
  }
}

/**
 * Upload model metadata to IPFS.
 * @param {string} name
 * @param {string} description
 * @param {string|number} price
 * @param {string} ipfsHash - CID of the model file
 * @param {number} totalCopies
 * @param {string|number} subPrice
 * @param {string|number} subDuration
 * @returns {Promise<string>} - The IPFS hash (CID) of the metadata JSON.
 */
export async function uploadMetadata(name, description, price, ipfsHash, totalCopies, subPrice, subDuration) {
  const metadata = {
    name,
    description,
    price,
    ipfsHash,
    totalCopies,
    subPrice,
    subDuration,
    timestamp: Date.now(),
  };
  try {
    const result = await ipfs.add(JSON.stringify(metadata), { pin: true });
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS uploadMetadata error:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Download a file from IPFS by its hash (CID).
 * @param {string} ipfsHash - The IPFS hash (CID) of the file.
 * @returns {Promise<Buffer>} - The file as a Buffer (Node.js). For browser, convert to Blob/URL as needed.
 */
export async function downloadModel(ipfsHash) {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(ipfsHash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('IPFS downloadModel error:', error);
    throw new Error('Failed to download model from IPFS');
  }
}
