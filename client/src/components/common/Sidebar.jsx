import { NavLink } from 'react-router-dom';
import { FiBriefcase, FiGrid, FiLayers, FiLogOut, FiSettings, FiShield } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import Button from './Button';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isPlatformAdmin = user?.role === 'platform_admin';
  const isWorkspaceAdmin = user?.role === 'workspace_admin';
  const items = [
    { to: isPlatformAdmin ? '/admin-console' : '/', label: isPlatformAdmin ? 'Admin Console' : 'Overview', icon: isPlatformAdmin ? FiShield : FiGrid },
    ...(!isPlatformAdmin ? [{ to: '/projects', label: 'Projects', icon: FiBriefcase }] : []),
    ...(!isPlatformAdmin ? [{ to: '/tasks', label: 'Tasks', icon: FiLayers }] : []),
    ...(isWorkspaceAdmin ? [{ to: '/settings', label: 'Workspace Settings', icon: FiSettings }] : [])
  ];

  return (
    <aside className="glass-panel flex h-full w-full max-w-[290px] flex-col rounded-[28px] p-5">
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-300">
            <FiGrid className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">JiraLite</p>
            <p className="mt-1 text-lg font-bold text-white">Workspace OS</p>
          </div>
        </div>
        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Signed in as</p>
          <p className="mt-2 text-sm font-semibold text-white">{user?.name}</p>
          <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Button variant="secondary" className="w-full justify-start" onClick={() => dispatch(logout())}>
        <FiLogOut className="h-4 w-4" />
        Sign out
      </Button>
    </aside>
  );
};

export default Sidebar;
