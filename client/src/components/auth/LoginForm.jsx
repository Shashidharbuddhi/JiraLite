import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiShield, FiUsers } from 'react-icons/fi';
import { loginUser } from '../../redux/slices/authSlice';
import Button from '../common/Button';
import { Input, errorClass, fieldClass, labelClass } from '../common/FormControls';

const roles = {
  member: {
    label: 'Member Login',
    portal: 'workspace',
    icon: FiUsers,
    eyebrow: 'Workspace access',
    title: 'Log in as a member',
    copy: 'Use this if you are a workspace member or workspace admin joining your team workspace.',
    submit: 'Enter workspace'
  },
  admin: {
    label: 'Admin Login',
    portal: 'admin',
    icon: FiShield,
    eyebrow: 'Platform control',
    title: 'Log in as an admin',
    copy: 'Use this only for the seeded platform admin account that manages the whole JiraLite platform.',
    submit: 'Enter admin console'
  }
};

const LoginForm = ({ defaultRole = 'member' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/';
  const config = useMemo(() => roles[selectedRole], [selectedRole]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser({ ...values, portal: config.portal }));

    if (loginUser.fulfilled.match(result)) {
      toast.success(selectedRole === 'admin' ? 'Admin access granted' : 'Welcome back');
      navigate(from, { replace: true });
      return;
    }

    toast.error(result.payload || 'Login failed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel w-full max-w-[560px] rounded-[32px] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-white">{config.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{config.copy}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
          <config.icon className="h-7 w-7 text-cyan-300" />
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {Object.entries(roles).map(([key, role]) => {
          const Icon = role.icon;
          const active = selectedRole === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedRole(key)}
              className={`rounded-[24px] border p-4 text-left transition-all ${
                active
                  ? 'border-cyan-300/70 bg-cyan-400/10 shadow-[0_16px_36px_rgba(34,211,238,0.12)]'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-2xl p-2 ${active ? 'bg-cyan-300/20 text-cyan-200' : 'bg-white/8 text-slate-300'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{role.label}</p>
                  <p className="text-xs text-slate-400">{key === 'member' ? 'Members and workspace admins' : 'Platform owner only'}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder={selectedRole === 'admin' ? 'admin@company.com' : 'member@company.com'}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Enter a valid email'
            }
          })}
        />

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`${fieldClass} pr-12`}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition-colors hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <div className="rounded-[24px] border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <FiLock className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Password recovery is available.</p>
              <p className="mt-1 text-amber-100/80">
                Password recovery is now available from the reset flow below. Use the right portal before requesting the reset.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            {config.submit}
            <FiArrowRight className="h-4 w-4" />
          </Button>

          <Link
            to="/forgot-password"
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04]"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>Need a new workspace?</span>
        <div className="flex flex-wrap gap-3">
          <Link to="/register" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
            Create workspace
          </Link>
          <Link to="/admin/login" className="font-semibold text-slate-300 transition-colors hover:text-white">
            Open admin-first view
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
