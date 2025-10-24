// src/App.tsx (Corrected)

import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';

function App() {
  return (
    <div className="app-layout">
      <Topbar />
      <main className="main-content">
        {/* The Outlet will now correctly render the LoginPage by default */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;