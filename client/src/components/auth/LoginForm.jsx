import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '../../redux/slices/authSlice';
import Button from '../common/Button';
import { Input, fieldClass, errorClass, labelClass } from '../common/FormControls';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-[400px]"
    >
      {/* Mobile brand — only on small screens */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <img src="/logo.png" alt="JiraLite logo" className="h-full w-full object-contain" />
        </div>
        <span className="font-heading text-base font-bold text-slate-900 dark:text-white">JiraLite</span>
      </div>

      <div>
        <p className="text-sm font-semibold text-blue-600">Welcome back</p>
        <h1 className="mt-2 font-heading text-[28px] font-bold leading-tight text-slate-900 dark:text-white">
          Sign in to your<br />workspace
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-slate-400">
          Pick up where you left off. Your projects are waiting.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
          })}
        />

        <div>
          <div className="flex items-center justify-between">
            <label className={labelClass}>Password</label>
          </div>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`${fieldClass} pr-10`}
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5 text-sm">
          Sign in
          <FiArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-[#1e293b]" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="bg-[#f8fafc] px-3 text-slate-400 dark:bg-[#09090b]">New to JiraLite?</span>
          </div>
        </div>
        <Link
          to="/register"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-[#1e293b] dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-white/[0.03]"
        >
          Create an account
          <FiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginForm;
