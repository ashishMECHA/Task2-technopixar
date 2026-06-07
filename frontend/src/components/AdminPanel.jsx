import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import StatCard from './StatCard';

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SparkIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SortIcon = () => (
  <svg className="ml-1 inline h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toISOString().split('T')[0];
};

const formatUserId = (id) => {
  if (!id) return '—';
  return `USR-${String(id).slice(-6).toUpperCase()}`;
};

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const RoleBadge = ({ role }) => {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isAdmin ? 'bg-purple-50 text-purple-700' : 'bg-sky-50 text-sky-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-sky-500'}`} />
      {isAdmin ? 'Admin' : 'User'}
    </span>
  );
};

const AdminPanel = ({ search = '' }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersRes, statsRes] = await Promise.all([
          api.get('/users'),
          api.get('/users/stats'),
        ]);
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load dashboard data';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (filter !== 'all' && user.role !== filter) return false;
      if (!search.trim()) return true;
      const query = search.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        formatUserId(user.id).toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'admin', label: 'Admin' },
    { key: 'user', label: 'User' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 h-6 w-48 rounded bg-slate-200" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-3 h-12 rounded bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Unable to load dashboard</h2>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor accounts, roles, and platform access across your organization.
          </p>
        </div>
        <button type="button" className="btn-primary shrink-0">
          + Invite User
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats?.total ?? 0}
          icon={<UsersIcon />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
        />
        <StatCard
          label="Administrators"
          value={stats?.admins ?? 0}
          icon={<ShieldIcon />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          label="Standard Users"
          value={stats?.users ?? 0}
          icon={<UserIcon />}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
        />
        <StatCard
          label="New This Month"
          value={stats?.newThisMonth ?? 0}
          icon={<SparkIcon />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-4">
          <span className="text-sm font-medium text-slate-500">Filter:</span>
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filter === key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-900">No users found</p>
            <p className="mt-1 text-sm text-slate-500">
              {search || filter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'Registered users will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-5 py-3.5 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('id')}
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
                    >
                      User ID
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('name')}
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
                    >
                      User
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('createdAt')}
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
                    >
                      Joined
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('role')}
                      className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
                    >
                      Role
                      <SortIcon />
                    </button>
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-sm font-semibold text-primary-600">
                        {formatUserId(user.id)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="User actions"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
