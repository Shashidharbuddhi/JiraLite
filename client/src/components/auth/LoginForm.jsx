import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser } from '../../redux/slices/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back');
      navigate(from, { replace: true });
      return;
    }

    toast.error(result.payload || 'Login failed');
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm font-semibold text-blue-700">JiraLite</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Sign in to your workspace</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="••••••••"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
          />
          {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        New to JiraLite?{' '}
        <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
