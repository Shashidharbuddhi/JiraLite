import { motion } from 'framer-motion';
import { FiArrowRight, FiLayers, FiTrello, FiZap } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';

const features = [
  {
    icon: FiZap,
    title: 'Lightning Fast',
    desc: 'JWT auth, instant CRUD, and real-time updates'
  },
  {
    icon: FiTrello,
    title: 'Kanban Workflow',
    desc: 'Drag-and-drop board with smart status tracking'
  },
  {
    icon: FiLayers,
    title: 'Sprint Planning',
    desc: 'Organize work into projects with deadlines and priorities'
  }
];

const AuthLayout = () => (
  <main className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b]">
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel — immersive brand experience */}
      <section className="relative hidden overflow-hidden bg-[#0a0a0f] lg:block">
        {/* Layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative flex h-full flex-col justify-between px-12 py-12">
          {/* Top — Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl ">
                <img src="/logo.png" alt="JiraLite logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-heading text-lg font-bold text-white">JiraLite</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-16"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Agile Workspace</p>
              <h1 className="mt-4 max-w-md font-heading text-[40px] font-extrabold leading-[1.1] text-white">
                Ship faster.<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Stay focused.
                </span>
              </h1>
              <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-400">
                The modern project management workspace built for developers who care about velocity and clarity.
              </p>
            </motion.div>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="mt-10 space-y-3"
            >
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-blue-400">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{feature.title}</p>
                    <p className="mt-0.5 text-[12px] leading-5 text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom — Stats bar + social proof */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Mini stats */}
            <div className="flex items-center gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
              {[
                { value: '24', label: 'Shipped', color: 'text-emerald-400' },
                { value: '9', label: 'In flight', color: 'text-blue-400' },
                { value: '18', label: 'Backlog', color: 'text-slate-400' },
                { value: '94%', label: 'Velocity', color: 'text-violet-400' }
              ].map((stat) => (
                <div key={stat.label} className="flex-1 text-center">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500'].map((bg, i) => (
                  <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full ${bg} text-[9px] font-bold text-white ring-2 ring-[#0a0a0f]`}>
                    {['S', 'A', 'R', 'M'][i]}
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-slate-500">Built for teams that ship</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Right panel — Form */}
      <section className="flex items-center justify-center px-6 py-12">
        <Outlet />
      </section>
    </div>
  </main>
);

export default AuthLayout;
