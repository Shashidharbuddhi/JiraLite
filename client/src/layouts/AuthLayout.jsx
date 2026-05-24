import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.36),transparent_32rem)]" />
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/30">
            JL
          </div>
          <h1 className="mt-8 max-w-lg text-4xl font-bold leading-tight">Plan focused sprints with a dashboard that feels production-ready.</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            JiraLite brings projects, Kanban flow, and activity into a clean workspace built for modern agile teams.
          </p>
          <div className="mt-8 space-y-3">
            {['Fast JWT authentication', 'Project and task CRUD', 'Premium Kanban workflow'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <FiCheckCircle className="h-5 w-5 text-blue-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Sprint snapshot</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['Backlog', 'Active', 'Shipped'].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-bold">{[18, 9, 24][index]}</p>
                <p className="mt-1 text-xs text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <Outlet />
      </section>
    </div>
  </main>
);

export default AuthLayout;
