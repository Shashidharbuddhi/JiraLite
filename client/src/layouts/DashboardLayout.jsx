import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = () => (
  <div className="min-h-screen">
    <div className="page-shell grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
      <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
        <Sidebar />
      </div>

      <div className="space-y-5">
        <Navbar />
        <main className="pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
