import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { decryptWillText } from '../utils/crypto';

export function WillView() {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const { data: hasRecord } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasWill',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: encryptedWill } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEncryptedWill',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!hasRecord },
  });

  const { data: encAddrs } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEncryptedAddresses',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!hasRecord },
  });

  const [dAddr1, setDAddr1] = useState<string | null>(null);
  const [dAddr2, setDAddr2] = useState<string | null>(null);
  const [dAddr3, setDAddr3] = useState<string | null>(null);
  const [manual1, setManual1] = useState('');
  const [manual2, setManual2] = useState('');
  const [manual3, setManual3] = useState('');
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const decryptAddresses = async () => {
    if (!instance || !address || !encAddrs || !signerPromise) return;
    setBusy(true);
    try {
      const keypair = instance.generateKeypair();
      const handles = [encAddrs[0], encAddrs[1], encAddrs[2]];
      const pairs = handles.map((h: any) => ({ handle: h, contractAddress: CONTRACT_ADDRESS }));
      const start = Math.floor(Date.now() / 1000).toString();
      const days = '7';
      const eip712 = instance.createEIP712(keypair.publicKey, [CONTRACT_ADDRESS], start, days);
      const signer = await signerPromise;
      if (!signer) throw new Error('No signer');
      const sig = await signer.signTypedData(eip712.domain, { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification }, eip712.message);
      const result = await instance.userDecrypt(pairs, keypair.privateKey, keypair.publicKey, sig.replace('0x',''), [CONTRACT_ADDRESS], address, start, days);
      const addr1 = result[encAddrs[0] as string];
      const addr2 = result[encAddrs[1] as string];
      const addr3 = result[encAddrs[2] as string];
      setDAddr1(addr1);
      setDAddr2(addr2);
      setDAddr3(addr3);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Decrypt failed');
    } finally {
      setBusy(false);
    }
  };

  const decryptWillNow = () => {
    const a1 = dAddr1 || manual1;
    const a2 = dAddr2 || manual2;
    const a3 = dAddr3 || manual3;
    if (!a1 || !a2 || !a3 || !encryptedWill) return alert('Provide three addresses');
    try {
      const pt = decryptWillText(encryptedWill as string, a1, a2, a3);
      setPlaintext(pt);
    } catch (e: any) {
      alert('Decryption failed');
    }
  };

  if (!address) return <div className="card"><p>Please connect wallet</p></div>;
  if (!hasRecord) return <div className="card"><p>No will on-chain for this address.</p></div>;

  return (
    <div className="card">
      <h2>Your Will</h2>
      <p className="mono">Encrypted Will: ***</p>

      <div className="row">
        <button className="btn" onClick={decryptAddresses} disabled={busy || !instance}>Decrypt 3 Addresses (Zama)</button>
      </div>
      <div className="grid">
        <div>
          <label>Lawyer Address #1</label>
          <input className="input" placeholder="0x..." value={dAddr1 ?? manual1} onChange={(e)=>{setDAddr1(null); setManual1(e.target.value);}}/>
        </div>
        <div>
          <label>Lawyer Address #2</label>
          <input className="input" placeholder="0x..." value={dAddr2 ?? manual2} onChange={(e)=>{setDAddr2(null); setManual2(e.target.value);}}/>
        </div>
        <div>
          <label>Lawyer Address #3</label>
          <input className="input" placeholder="0x..." value={dAddr3 ?? manual3} onChange={(e)=>{setDAddr3(null); setManual3(e.target.value);}}/>
        </div>
      </div>

      <div className="row">
        <button className="btn" onClick={decryptWillNow}>Decrypt Will Text</button>
      </div>

      {plaintext && (
        <div className="plaintext">
          <h3>Decrypted Will</h3>
          <pre>{plaintext}</pre>
        </div>
      )}
    </div>
  );
}

