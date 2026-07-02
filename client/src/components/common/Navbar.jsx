import { useEffect, useState } from 'react';
import { FiBell, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { searchService } from '../../services/searchService';
import { formatDate, getErrorMessage } from '../../utils/formatters';

const formatRole = (role) =>
  role
    ?.split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Workspace Member';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const response = await searchService.search(query);
        setResults(response.results);
      } catch (error) {
        setResults({
          error: getErrorMessage(error, 'Search failed'),
          projects: [],
          tasks: [],
          activities: []
        });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workspace Command Center</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {user?.workspace?.name || 'JiraLite Workspace'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-400">
              <FiSearch className="h-4 w-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, tasks, activity"
                className="w-[280px] bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            {(loading || results) && (
              <div className="glass-panel absolute right-0 top-[calc(100%+12px)] w-[420px] rounded-[28px] p-4">
                {loading ? (
                  <p className="text-sm text-slate-300">Searching...</p>
                ) : results?.error ? (
                  <p className="text-sm text-rose-300">{results.error}</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Projects</p>
                      <div className="mt-2 space-y-2">
                        {results?.projects?.slice(0, 3).map((project) => (
                          <Link key={project._id} to={`/projects/${project._id}`} className="block rounded-2xl border border-white/10 p-3 hover:bg-white/[0.05]">
                            <p className="text-sm font-semibold text-white">{project.title}</p>
                            <p className="mt-1 text-xs text-slate-400">{project.description}</p>
                          </Link>
                        ))}
                        {!results?.projects?.length && <p className="text-sm text-slate-500">No projects found</p>}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tasks</p>
                      <div className="mt-2 space-y-2">
                        {results?.tasks?.slice(0, 4).map((task) => (
                          <div key={task._id} className="rounded-2xl border border-white/10 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">{task.title}</p>
                              <span className="text-xs text-slate-500">{task.status}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{task.projectId?.title || 'No project'}</p>
                          </div>
                        ))}
                        {!results?.tasks?.length && <p className="text-sm text-slate-500">No tasks found</p>}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Activity</p>
                      <div className="mt-2 space-y-2">
                        {results?.activities?.slice(0, 3).map((activity) => (
                          <div key={activity._id} className="rounded-2xl border border-white/10 p-3">
                            <p className="text-sm text-white">{activity.action}</p>
                            <p className="mt-1 text-xs text-slate-500">{formatDate(activity.createdAt)}</p>
                          </div>
                        ))}
                        {!results?.activities?.length && <p className="text-sm text-slate-500">No activity found</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <button type="button" className="rounded-full border border-white/10 bg-white/[0.03] p-3 text-slate-300">
            <FiBell className="h-4 w-4" />
          </button>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-right">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{formatRole(user?.role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
