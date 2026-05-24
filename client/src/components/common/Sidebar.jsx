import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiActivity, FiCheckSquare, FiGrid, FiLogOut, FiX } from 'react-icons/fi';
import { GoProjectRoadmap } from 'react-icons/go';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const items = [
  { to: '/', label: 'Dashboard', icon: FiGrid },
  { to: '/projects', label: 'Projects', icon: GoProjectRoadmap },
  { to: '/tasks', label: 'Tasks', icon: FiCheckSquare },
  { to: '/', label: 'Activity', icon: FiActivity }
];

const Sidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const content = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-slate-950/50">
      <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/25">
            JL
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">JiraLite</p>
            <p className="text-xs font-medium text-slate-500">Agile Workspace</p>
          </div>
        </div>
        <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden" onClick={onClose} aria-label="Close sidebar">
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 ${
                isActive && label !== 'Activity'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950'
              }`
            }
          >
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/80">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">MERN Assessment</p>
      </div>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-950"
        >
          <FiLogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:block">{content}</div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 md:hidden">
            <button className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} aria-label="Close overlay" />
            <motion.div initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }} transition={{ duration: 0.24 }} className="relative h-full">
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
