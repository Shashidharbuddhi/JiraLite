import { FiLogOut, FiMenu, FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75 md:px-6">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 md:hidden" onClick={onMenuClick} aria-label="Open menu">
          <FiMenu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-base font-bold text-slate-950">Welcome back, {user?.name?.split(' ')[0] || 'there'}</p>
          <p className="hidden text-xs font-medium text-slate-500 sm:block">Plan, track, and ship focused work</p>
        </div>
      </div>

      <div className="hidden min-w-0 max-w-md flex-1 lg:block">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:ring-blue-500/20"
            placeholder="Search projects, tasks, activity..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <ThemeToggle />
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/25">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Logout"
        >
          <FiLogOut className="h-5 w-5" />
        </button>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
