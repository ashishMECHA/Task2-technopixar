import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdminPanel from '../components/AdminPanel';

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const UserDashboard = ({ user, logout }) => (
  <div className="mx-auto max-w-3xl">
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white">
        <p className="text-sm font-medium text-primary-100">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold">{user.name}</h1>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium text-slate-900">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm text-slate-500">Account Role</p>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              {user.role}
            </span>
          </div>
          <button onClick={() => logout()} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar showSearch={isAdmin} search={search} onSearchChange={setSearch} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {isAdmin ? <AdminPanel search={search} /> : <UserDashboard user={user} logout={logout} />}
      </main>
    </div>
  );
};

export default Dashboard;
