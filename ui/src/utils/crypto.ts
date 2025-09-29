import { keccak256, toUtf8Bytes, hexlify, getAddress } from 'ethers';

function deriveKey(addr1: string, addr2: string, addr3: string): string {
  const a1 = getAddress(addr1);
  const a2 = getAddress(addr2);
  const a3 = getAddress(addr3);
  // Deterministic key from three addresses
  return keccak256(toUtf8Bytes(`${a1.toLowerCase()}|${a2.toLowerCase()}|${a3.toLowerCase()}`));
}

function prg(seed: string, length: number): Uint8Array {
  // Simple keccak-based stream generator
  const out = new Uint8Array(length);
  let i = 0;
  let counter = 0;
  while (i < length) {
    const block = keccak256(seed + hexlify(Uint8Array.from([counter])).slice(2));
    const bytes = Uint8Array.from(Buffer.from(block.slice(2), 'hex'));
    const take = Math.min(bytes.length, length - i);
    out.set(bytes.slice(0, take), i);
    i += take;
    counter++;
  }
  return out;
}

export function encryptWillText(plain: string, addr1: string, addr2: string, addr3: string): string {
  const key = deriveKey(addr1, addr2, addr3);
  const data = Uint8Array.from(toUtf8Bytes(plain));
  const mask = prg(key, data.length);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ mask[i];
  return Buffer.from(out).toString('base64');
}

export function decryptWillText(cipherB64: string, addr1: string, addr2: string, addr3: string): string {
  const key = deriveKey(addr1, addr2, addr3);
  const data = Uint8Array.from(Buffer.from(cipherB64, 'base64'));
  const mask = prg(key, data.length);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ mask[i];
  return Buffer.from(out).toString('utf8');
}

