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
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-[#1e293b] dark:bg-[#09090b]">
      {/* Workspace identity */}
      <div className="flex h-14 items-center gap-3 border-b border-slate-100 px-5 dark:border-[#1e293b]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <img src="/logo.png" alt="JiraLite logo" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-slate-900">JiraLite</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Agile Workspace</p>
        </div>
        <button
          className="ml-auto rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.04] md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive && label !== 'Activity'
                  ? 'bg-slate-100 text-slate-900 dark:bg-white/[0.06] dark:text-white'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.03] dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && label !== 'Activity' && (
                  <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600" />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Workspace info */}
      <div className="mx-3 mb-3 rounded-lg border border-slate-100 px-3 py-2.5 dark:border-[#1e293b]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        <p className="mt-0.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">MERN Assessment</p>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-100 px-3 py-2 dark:border-[#1e293b]">
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.03] dark:hover:text-slate-200"
        >
          <FiLogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:block">{content}</div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 md:hidden">
            <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Close overlay" />
            <motion.div initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="relative h-full">
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
