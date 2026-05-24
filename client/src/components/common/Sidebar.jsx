import { NavLink } from 'react-router-dom';
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
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <p className="text-lg font-bold text-slate-950">JiraLite</p>
          <p className="text-xs text-slate-500">Agile workspace</p>
        </div>
        <button className="rounded-md p-2 text-slate-500 md:hidden" onClick={onClose} aria-label="Close sidebar">
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive && label !== 'Activity'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-slate-950/40" onClick={onClose} aria-label="Close overlay" />
          <div className="relative h-full">{content}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
