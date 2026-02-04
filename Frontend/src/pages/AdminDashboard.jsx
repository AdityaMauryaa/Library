import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Loader2,
  Library,
  BookMarked,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          title: 'Total Books',
          value: stats.totalBooks,
          icon: BookOpen,
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
        },
        {
          title: 'Total Students',
          value: stats.totalStudents,
          icon: Users,
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          iconBg: 'bg-green-100',
        },
        {
          title: 'Issued Today',
          value: stats.booksIssuedToday,
          icon: Calendar,
          color: 'purple',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          iconBg: 'bg-purple-100',
        },
        {
          title: 'Overdue Books',
          value: stats.overdueBooks,
          icon: AlertTriangle,
          color: 'red',
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
          iconBg: 'bg-red-100',
        },
        {
          title: 'Currently Borrowed',
          value: stats.currentlyBorrowed,
          icon: BookMarked,
          color: 'indigo',
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-600',
          iconBg: 'bg-indigo-100',
        },
        {
          title: 'Fine Collected',
          value: `$${stats.totalFineCollected}`,
          icon: DollarSign,
          color: 'amber',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-600',
          iconBg: 'bg-amber-100',
        },
      ]
    : [];

  const quickActions = [
    {
      title: 'Manage Books',
      description: 'Add, edit, or remove books',
      icon: BookOpen,
      link: '/admin/books',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Manage Students',
      description: 'View and manage students',
      icon: Users,
      link: '/admin/students',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Issue Book',
      description: 'Issue a book to student',
      icon: BookMarked,
      link: '/admin/borrow/issue',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'View Borrowed',
      description: 'All borrowed books',
      icon: Library,
      link: '/admin/borrowed',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Overdue Books',
      description: 'Track overdue returns',
      icon: AlertTriangle,
      link: '/admin/overdue',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Manage Courses',
      description: 'Add or edit courses',
      icon: TrendingUp,
      link: '/admin/courses',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Library Management Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-gray-500 text-xs">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your library today.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className={`${card.bgColor} rounded-2xl p-6 border border-white/50`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                      <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-4 ${card.iconBg} rounded-2xl`}>
                      <card.icon className={`w-8 h-8 ${card.textColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Available Books */}
            {stats && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Available for Borrowing</p>
                    <p className="text-4xl font-bold mt-2">{stats.availableBooks}</p>
                    <p className="text-emerald-100 text-sm mt-1">copies currently in stock</p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-2xl">
                    <Library className="w-12 h-12" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-semibold text-gray-800 mt-4">{action.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
