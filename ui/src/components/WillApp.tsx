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
        <div className="info" style={{marginTop: '2rem'}}>
          <h3>🔒 How SecureWill Works</h3>
          <ul>
            <li><strong>Prepare three addresses:</strong> They serve as your decryption keys.</li>
            <li><strong>Client-side encryption:</strong> Your will text is encrypted in your browser using those addresses.</li>
            <li><strong>Blockchain storage:</strong> We store the encrypted text on-chain and the three addresses encrypted with Zama FHE.</li>
            <li><strong>Secure decryption:</strong> To read the will, you must provide the same three addresses (manually or by decrypting via Zama).</li>
            <li><strong>Security reminder:</strong> Keep your three addresses safe. Anyone with all three can decrypt your will.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
