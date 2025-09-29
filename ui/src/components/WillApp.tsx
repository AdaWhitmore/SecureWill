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
      </main>
    </div>
  );
}

