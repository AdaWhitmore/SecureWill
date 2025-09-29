import { useState } from 'react';
import { Header } from './Header';
import { WillWrite } from './WillWrite';
import { WillView } from './WillView';
import '../styles/Will.css';

export function WillApp() {
  const [active, setActive] = useState<'write' | 'view'>('write');

  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="tabs">
          <button className={`tab ${active === 'write' ? 'active' : ''}`} onClick={() => setActive('write')}>Write Will</button>
          <button className={`tab ${active === 'view' ? 'active' : ''}`} onClick={() => setActive('view')}>View Will</button>
        </div>
        {active === 'write' ? <WillWrite /> : <WillView />}
        <div className="info" style={{marginTop: '1rem'}}>
          <h3>How To Use</h3>
          <ul>
            <li>Prepare three addresses. They serve as your decryption keys.</li>
            <li>Your will text is encrypted in your browser using those addresses.</li>
            <li>We store the encrypted text on-chain and the three addresses encrypted with Zama FHE.</li>
            <li>To read the will, you must provide the same three addresses (manually or by decrypting via Zama).</li>
            <li>Keep your three addresses safe. Anyone with all three can decrypt your will.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
