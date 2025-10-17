
import { Outlet } from 'react-router-dom';
import { F0Sidebar } from './F0Sidebar';

export function F0PortalLayout() {
  return (
    <div className="flex h-screen bg-background">
      <F0Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
