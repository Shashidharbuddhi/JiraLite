import { Outlet } from 'react-router-dom';

const signals = [
  'Admin and member access split clearly',
  'Workspace auth stays connected to the existing backend',
  'Forgot password is intentionally marked unavailable for now'
];

const AuthLayout = () => (
  <main className="relative min-h-screen overflow-hidden">
    <div className="mesh-overlay absolute inset-0 opacity-40" />
    <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_55%)]" />
    <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_45%)]" />

    <div className="relative mx-auto grid min-h-screen max-w-7xl items-stretch gap-8 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
      <section className="glass-panel hidden rounded-[36px] p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="eyebrow">JiraLite SaaS Frontend</p>
          <h1 className="mt-6 max-w-xl text-5xl font-bold leading-[0.95] text-white text-balance">
            Fresh workspace control, rebuilt from scratch.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
            This frontend now starts with identity first: choose whether you are logging in as a member or admin, then enter the workspace with a cleaner, more product-grade experience.
          </p>
        </div>

        <div className="space-y-4">
          {signals.map((signal) => (
            <div key={signal} className="soft-panel rounded-[24px] p-5 text-sm text-slate-200">
              {signal}
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center py-6 lg:py-10">
        <Outlet />
      </section>
    </div>
  </main>
);

export default AuthLayout;
