import { FiLogOut, FiMenu } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={onMenuClick} aria-label="Open menu">
          <FiMenu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-950">Workspace</p>
          <p className="hidden text-xs text-slate-500 sm:block">Plan, track, and ship focused work</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Logout"
        >
          <FiLogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
