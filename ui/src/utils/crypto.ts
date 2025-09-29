import { keccak256, toUtf8Bytes, hexlify, getAddress } from 'ethers';

function deriveKey(addr1: string, addr2: string, addr3: string): string {
  const a1 = getAddress(addr1);
  const a2 = getAddress(addr2);
  const a3 = getAddress(addr3);
  // Deterministic key from three addresses
  return keccak256(toUtf8Bytes(`${a1.toLowerCase()}|${a2.toLowerCase()}|${a3.toLowerCase()}`));
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const len = clean.length;
  const out = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

function u8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToU8(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function prg(seed: string, length: number): Uint8Array {
  // Simple keccak-based stream generator (browser-friendly)
  const out = new Uint8Array(length);
  let i = 0;
  let counter = 0;
  while (i < length) {
    const block = keccak256(seed + hexlify(Uint8Array.from([counter])).slice(2));
    const bytes = hexToBytes(block);
    const take = Math.min(bytes.length, length - i);
    out.set(bytes.slice(0, take), i);
    i += take;
    counter = (counter + 1) & 0xff;
  }
  return out;
}

export function encryptWillText(plain: string, addr1: string, addr2: string, addr3: string): string {
  const key = deriveKey(addr1, addr2, addr3);
  const data = Uint8Array.from(toUtf8Bytes(plain));
  const mask = prg(key, data.length);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ mask[i];
  return u8ToBase64(out);
}

export function decryptWillText(cipherB64: string, addr1: string, addr2: string, addr3: string): string {
  const key = deriveKey(addr1, addr2, addr3);
  const data = base64ToU8(cipherB64);
  const mask = prg(key, data.length);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ mask[i];
  return new TextDecoder().decode(out);
}
