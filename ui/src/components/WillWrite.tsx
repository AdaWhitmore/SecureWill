import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Contract } from 'ethers';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { encryptWillText } from '../utils/crypto';

export function WillWrite() {
  const { address } = useAccount();
  const { instance, isLoading: zamaLoading, error } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const [willText, setWillText] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [addr3, setAddr3] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    if (!address || !instance) return alert('Connect wallet and wait for Zama init');
    if (!signerPromise) return alert('No signer');
    if (!willText || !addr1 || !addr2 || !addr3) return alert('Fill all fields');

    try {
      setBusy(true);
      // Client-side reversible encryption with 3 addresses
      const C = encryptWillText(willText, addr1, addr2, addr3);

      // Encrypt three addresses with Zama and submit
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.addAddress(addr1);
      input.addAddress(addr2);
      input.addAddress(addr3);
      const encrypted = await input.encrypt();

      const signer = await signerPromise;
      if (!signer) throw new Error('Missing signer');

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.submitWill(C, encrypted.handles[0], encrypted.handles[1], encrypted.handles[2], encrypted.inputProof);
      await tx.wait();
      setOk('Submitted');
      setWillText('');
      setAddr1('');
      setAddr2('');
      setAddr3('');
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Submit failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>Write Will</h2>
      <p className="mono" style={{marginTop: '.25rem', marginBottom: '.75rem'}}>
        Enter your will text and three addresses. The will is encrypted locally using the three lawyer addresses and then submitted with the addresses encrypted using Zama FHE.
      </p>
      <form onSubmit={submit} className="form">
        <label>Will Text</label>
        <textarea value={willText} onChange={(e) => setWillText(e.target.value)} rows={6} className="input" required />

        <label>Lawyer Address #1</label>
        <input value={addr1} onChange={(e) => setAddr1(e.target.value)} className="input" placeholder="0x..." required />
        <label>Lawyer Address #2</label>
        <input value={addr2} onChange={(e) => setAddr2(e.target.value)} className="input" placeholder="0x..." required />
        <label>Lawyer Address #3</label>
        <input value={addr3} onChange={(e) => setAddr3(e.target.value)} className="input" placeholder="0x..." required />

        <button className="btn" disabled={busy || zamaLoading || !address}>{busy ? 'Submitting...' : 'Submit Will'}</button>
        {zamaLoading && <p className="loading">Initializing encryption...</p>}
        {error && <p className="error">{error}</p>}
        {ok && <p className="success">Will submitted successfully!</p>}
      </form>
    </div>
  );
}
