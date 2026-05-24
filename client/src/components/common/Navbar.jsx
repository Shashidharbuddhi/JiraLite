import { FiMenu, FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import ThemeToggle from './ThemeToggle';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Navbar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#09090b]/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.04] md:hidden" onClick={onMenuClick} aria-label="Open menu">
            <FiMenu className="h-[18px] w-[18px]" />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">{getGreeting()}, {firstName}</p>
            <p className="hidden text-[11px] text-slate-400 sm:block">Plan, track, and ship focused work</p>
          </div>
        </div>

        <div className="hidden min-w-0 max-w-xs flex-1 lg:block">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-[7px] pl-9 pr-12 text-[13px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-[#1e293b] dark:bg-[#111827] dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-[#18181b]"
              placeholder="Search..."
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-[#1e293b] dark:bg-[#18181b] sm:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
          <ThemeToggle />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
