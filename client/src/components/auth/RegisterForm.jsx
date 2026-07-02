import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowRight, FiLayers, FiShield, FiUsers } from 'react-icons/fi';
import { registerUser } from '../../redux/slices/authSlice';
import Button from '../common/Button';
import { Input } from '../common/FormControls';

const perks = [
  {
    icon: FiShield,
    title: 'Workspace admin setup',
    copy: 'The account created here becomes the initial workspace admin for your team.'
  },
  {
    icon: FiUsers,
    title: 'Member onboarding ready',
    copy: 'After setup, members use the member login path from the same shared login screen.'
  },
  {
    icon: FiLayers,
    title: 'Projects and tasks live immediately',
    copy: 'You can start creating projects and sprint work as soon as the workspace is created.'
  }
];

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      workspaceName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    const result = await dispatch(registerUser(values));

    if (registerUser.fulfilled.match(result)) {
      toast.success('Workspace created');
      navigate('/', { replace: true });
      return;
    }

    toast.error(result.payload || 'Registration failed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glass-panel w-full max-w-[980px] rounded-[32px] p-6 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="eyebrow">New Workspace</p>
          <h1 className="text-4xl font-bold text-white text-balance">Build a fresh workspace with a clean start.</h1>
          <p className="max-w-md text-sm leading-7 text-slate-300">
            This registration flow is now centered around workspace creation, not just user signup. It creates the workspace and your first admin account together.
          </p>

          <div className="space-y-3 pt-3">
            {perks.map((perk) => (
              <div key={perk.title} className="soft-panel rounded-[24px] p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-cyan-400/10 p-2 text-cyan-300">
                    <perk.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{perk.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{perk.copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <Input
            label="Your Name"
            placeholder="Shashidhar"
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Enter at least 2 characters' }
            })}
          />

          <Input
            label="Workspace Name"
            placeholder="Acme Delivery Ops"
            error={errors.workspaceName?.message}
            {...register('workspaceName', {
              required: 'Workspace name is required',
              minLength: { value: 2, message: 'Enter at least 2 characters' }
            })}
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
          />

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
            The first user created here is treated as the workspace admin. Members should use the member login option on the shared login page after they are invited.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" loading={loading}>
              Create Workspace
              <FiArrowRight className="h-4 w-4" />
            </Button>

            <Link to="/login" className="text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
