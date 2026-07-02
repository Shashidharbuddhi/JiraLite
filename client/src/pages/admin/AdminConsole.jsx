import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiShield, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { changeWorkspaceStatus, destroyUser, destroyWorkspace, fetchAdminOverview } from '../../redux/slices/adminSlice';

const AdminConsole = () => {
  const dispatch = useDispatch();
  const { analytics, workspaces, users, loading, saving } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const handleStatusChange = async (workspaceId, status) => {
    const result = await dispatch(changeWorkspaceStatus({ workspaceId, status }));
    if (changeWorkspaceStatus.fulfilled.match(result)) toast.success('Workspace updated');
    else toast.error(result.payload || 'Unable to update workspace');
  };

  const handleDelete = async (workspaceId) => {
    const result = await dispatch(destroyWorkspace(workspaceId));
    if (destroyWorkspace.fulfilled.match(result)) toast.success('Workspace deleted');
    else toast.error(result.payload || 'Unable to delete workspace');
  };

  const handleDeleteUser = async (userId) => {
    const result = await dispatch(destroyUser(userId));
    if (destroyUser.fulfilled.match(result)) toast.success('User deleted');
    else toast.error(result.payload || 'Unable to delete user');
  };

  if (loading) {
    return <Loader label="Loading admin console" />;
  }

  const metricCards = [
    { label: 'Workspaces', value: analytics?.totalWorkspaces || 0 },
    { label: 'Users', value: analytics?.totalUsers || 0 },
    { label: 'Projects', value: analytics?.totalProjects || 0 },
    { label: 'Tasks', value: analytics?.totalTasks || 0 }
  ];

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-[30px] p-6 sm:p-8">
        <p className="eyebrow">Platform Admin</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white text-balance">Run JiraLite like a real SaaS control plane</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              This console gives platform-level visibility across tenants, including workspace lifecycle controls and account counts, so the project feels like a genuine multi-tenant product instead of only a task board.
            </p>
          </div>
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-cyan-100">
            <FiShield className="h-6 w-6" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <div key={card.label} className="metric-tile">
            <p className="text-sm font-medium text-slate-400">{card.label}</p>
            <p className="mt-6 text-4xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[30px] p-6">
          <div>
            <p className="eyebrow">Workspaces</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Tenant control</h2>
          </div>

          <div className="mt-6 space-y-4">
            {workspaces.map((workspace) => (
              <div key={workspace._id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{workspace.name}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Owner: {workspace.owner?.name || 'Unknown'} • {workspace.members?.length || 0} members
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{workspace.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      loading={saving}
                      onClick={() =>
                        handleStatusChange(
                          workspace._id,
                          workspace.status === 'active' ? 'suspended' : 'active'
                        )
                      }
                    >
                      {workspace.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </Button>
                    <Button variant="danger" loading={saving} onClick={() => handleDelete(workspace._id)}>
                      <FiTrash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[30px] p-6">
          <p className="eyebrow">User Directory</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Recent accounts</h2>
          <div className="mt-6 space-y-3">
            {users.slice(0, 10).map((user) => (
              <div key={user._id} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {user.role} • {user.workspaceId?.name || 'Platform'}
                    </p>
                  </div>
                  <Button variant="danger" size="sm" loading={saving} onClick={() => handleDeleteUser(user._id)}>
                    <FiTrash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminConsole;
