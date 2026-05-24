import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <main className="min-h-screen bg-slate-50">
    <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-4 py-10">
        <Outlet />
      </section>
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-lg font-bold">JiraLite</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
            A focused agile command center for projects, priorities, and delivery flow.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-wide text-blue-200">Sprint health</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['Backlog', 'Active', 'Shipped'].map((item, index) => (
              <div key={item} className="rounded-lg bg-white/10 p-4">
                <p className="text-2xl font-bold">{[18, 9, 24][index]}</p>
                <p className="mt-1 text-xs text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default AuthLayout;
