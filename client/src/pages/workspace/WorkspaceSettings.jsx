import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import { Input, Select } from '../../components/common/FormControls';
import Loader from '../../components/common/Loader';
import {
  fetchCurrentWorkspace,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMember
} from '../../redux/slices/workspaceSlice';

const WorkspaceSettings = () => {
  const dispatch = useDispatch();
  const { workspace, loading, saving } = useSelector((state) => state.workspace);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'workspace_member'
  });

  useEffect(() => {
    dispatch(fetchCurrentWorkspace());
  }, [dispatch]);

  const handleInvite = async (event) => {
    event.preventDefault();
    const result = await dispatch(inviteWorkspaceMember(form));

    if (inviteWorkspaceMember.fulfilled.match(result)) {
      toast.success('Member added');
      setForm({ name: '', email: '', password: '', role: 'workspace_member' });
    } else {
      toast.error(result.payload || 'Unable to add member');
    }
  };

  const handleRoleChange = async (memberId, role) => {
    const result = await dispatch(updateWorkspaceMember({ memberId, payload: { role } }));
    if (updateWorkspaceMember.fulfilled.match(result)) toast.success('Member updated');
    else toast.error(result.payload || 'Unable to update member');
  };

  const handleSuspendToggle = async (member) => {
    const result = await dispatch(
      updateWorkspaceMember({
        memberId: member._id,
        payload: { isSuspended: !member.isSuspended }
      })
    );
    if (updateWorkspaceMember.fulfilled.match(result)) toast.success('Member status updated');
    else toast.error(result.payload || 'Unable to update member status');
  };

  const handleRemove = async (memberId) => {
    const result = await dispatch(removeWorkspaceMember(memberId));
    if (removeWorkspaceMember.fulfilled.match(result)) toast.success('Member removed');
    else toast.error(result.payload || 'Unable to remove member');
  };

  if (loading) {
    return <Loader label="Loading workspace settings" />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="glass-panel rounded-[30px] p-6">
        <p className="eyebrow">Workspace Settings</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{workspace?.name || 'Workspace'}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Manage team membership directly inside the product. This adds the missing collaboration layer that turns the app into a more complete SaaS workspace.
        </p>

        <form onSubmit={handleInvite} className="mt-6 space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="New teammate"
          />
          <Input
            label="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="teammate@company.com"
          />
          <Input
            label="Temporary Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Create an initial password"
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          >
            <option value="workspace_member">Workspace Member</option>
            <option value="workspace_admin">Workspace Admin</option>
          </Select>
          <Button type="submit" loading={saving}>
            <FiUserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </form>
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <p className="eyebrow">Members</p>
        <h2 className="mt-3 text-2xl font-bold text-white">Team directory</h2>
        <div className="mt-6 space-y-4">
          {(workspace?.members || []).map((member) => (
            <div key={member._id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{member.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{member.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {member.role} {member.isSuspended ? '• suspended' : ''}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Select value={member.role} onChange={(event) => handleRoleChange(member._id, event.target.value)}>
                    <option value="workspace_member">Workspace Member</option>
                    <option value="workspace_admin">Workspace Admin</option>
                  </Select>
                  <Button variant="secondary" loading={saving} onClick={() => handleSuspendToggle(member)}>
                    {member.isSuspended ? 'Activate' : 'Suspend'}
                  </Button>
                  <Button variant="danger" loading={saving} onClick={() => handleRemove(member._id)}>
                    <FiTrash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WorkspaceSettings;
