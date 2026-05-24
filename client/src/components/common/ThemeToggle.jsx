import { FiMoon, FiSun } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/uiSlice';
import Button from './Button';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative overflow-hidden"
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <FiSun className="h-5 w-5 text-amber-300" /> : <FiMoon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
