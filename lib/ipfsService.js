import { create } from 'ipfs-http-client';

const client = create('https://ipfs.io');

export async function uploadModel(file) {
  const added = await client.add(file);
  return added.path;
}

export async function uploadMetadata(metadata) {
  const added = await client.add(JSON.stringify(metadata));
  return added.path;
}

export async function downloadModel(ipfsHash) {
  const url = `https://ipfs.io/ipfs/${ipfsHash}`;
  const response = await fetch(url);
  return response.blob();
}
