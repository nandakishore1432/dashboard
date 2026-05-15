/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  auth, 
  googleProvider, 
  db, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  handleFirestoreError,
  OperationType,
  Timestamp
} from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Trophy, 
  Zap, 
  Clock, 
  BookOpen, 
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
  TrendingUp,
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  MoreVertical,
  Edit2,
  Trash2,
  GraduationCap,
  User,
  Users,
  Activity,
  ClipboardList,
  StickyNote,
  Calendar,
  Megaphone,
  SearchCode,
  MessagesSquare,
  Repeat,
  Coins,
  ShieldAlert,
  Moon,
  Sun,
  Hand,
  ArrowRight,
  MessageCircle,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

// --- Components ---

const MeshGradient = () => <div className="mesh-bg" />;

const SplashScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#030712]"
    >
      <MeshGradient />
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-8 max-w-md w-full px-6"
      >
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
          <Sparkles className="w-16 h-16 text-purple-400 relative" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Student <span className="text-purple-400">Aura</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Harness the power of hyper-focus. Elevate your learning velocity.
          </p>
        </div>

        <button 
          onClick={onLogin}
          className="w-full py-4 px-6 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 w-fit mx-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Cloud Auth Verified</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  isOpen, 
  onClose,
  onLogout 
}: { 
  currentView: string; 
  setCurrentView: (v: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout: () => void;
}) => {
  const links = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: ClipboardList, label: 'Assignments', id: 'assignments' },
    { icon: StickyNote, label: 'Notes', id: 'notes' },
    { icon: Calendar, label: 'Timetable', id: 'timetable' },
    { icon: Megaphone, label: 'Announcements', id: 'announcements' },
    { icon: SearchCode, label: 'Lost & Found', id: 'lostfound' },
    { icon: MessagesSquare, label: 'Chat', id: 'chat' },
    { icon: GraduationCap, label: 'Tutorials', id: 'tutorials' },
    { icon: Sparkles, label: 'Skill Exchange', id: 'skills' },
    { icon: Trophy, label: 'Rewards', id: 'rewards' },
    { icon: ShieldAlert, label: 'Admin Panel', id: 'admin' },
    { icon: Repeat, label: 'Manage Rewards', id: 'manage-rewards' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#09090b] border-r border-white/5 flex flex-col p-4 h-screen z-[70] transition-transform duration-300 transform lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Smart Hub</span>
          </div>
          <button onClick={onClose} className="p-2 lg:hidden text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-1 custom-scrollbar pb-6">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => { setCurrentView(link.id); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                currentView === link.id 
                ? 'text-violet-400 bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold' 
                : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              <link.icon className={`w-[18px] h-[18px] transition-transform group-hover:scale-110 ${currentView === link.id ? 'text-violet-400' : 'text-gray-500'}`} />
              <span className="text-[13px] font-medium">{link.label}</span>
              {currentView === link.id && (
                <motion.div layoutId="active-nav-dot" className="absolute left-0 w-1 h-4 bg-violet-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// --- Main App ---


interface Subtask {
  id: string | number;
  title: string;
  completed: boolean;
  createdAt?: any;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Subtask[];
  userId: string;
  createdAt: any;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [newSubtaskInputs, setNewSubtaskInputs] = useState<Record<string, string>>({});
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; taskId: string; subtaskId: string } | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<{ taskId: string; subtaskId: string; title: string } | null>(null);

  const [accentColor, setAccentColor] = useState('#a78bfa');
  const [userName, setUserName] = useState('New User');
  const [showMesh, setShowMesh] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isTaskCustomizing, setIsTaskCustomizing] = useState(false);
  const [showSubtaskCounts, setShowSubtaskCounts] = useState(true);

  const [currentView, setCurrentView] = useState('dashboard');
  const [isSmartBotOpen, setIsSmartBotOpen] = useState(false);

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLogged(!!user);
      setLoading(false);

      if (user) {
        // Fetch/Init Settings
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.userName || user.displayName || 'Alex');
            setAccentColor(data.accentColor || '#a78bfa');
            setShowMesh(data.showMesh ?? true);
            setShowSubtaskCounts(data.showSubtaskCounts ?? true);
          } else {
            // Initialize user doc
            const initialData = {
              userName: user.displayName || 'Alex',
              email: user.email,
              accentColor: '#a78bfa',
              showMesh: true,
              showSubtaskCounts: true,
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, initialData);
            setUserName(initialData.userName);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Tasks Subscription
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Task);
      });
      // Sort by creation date
      taskList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setTasks(taskList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle Login/Logout
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setTasks([]);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Sync Settings
  const syncSettings = async () => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        userName,
        accentColor,
        showMesh,
        showSubtaskCounts,
        updatedAt: serverTimestamp()
      });
      setIsCustomizing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const subtasksCount = tasks.reduce((acc, t) => acc + t.subtasks.length, 0);
    const subtasksCompleted = tasks.reduce((acc, t) => acc + t.subtasks.filter(s => s.completed).length, 0);
    
    const totalItems = total + subtasksCount;
    const completedItems = completedCount + subtasksCompleted;
    const rate = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    
    return { total, pending: total - completedCount, completed: completedCount, rate, notices: 0 };
  }, [tasks]);

  const completionData = [
    { name: 'Completed', value: stats.rate, color: accentColor },
    { name: 'Pending', value: 100 - stats.rate || 100, color: 'rgba(255, 255, 255, 0.05)' },
  ];

  const weeklyActivityData = [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ];

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !task.completed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string | number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !currentUser) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTaskInput,
        completed: false,
        subtasks: [],
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTaskInput('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    }
  };

  const addSubtask = async (taskId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = newSubtaskInputs[taskId];
    if (!input?.trim()) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtasks = [...task.subtasks, { id: Date.now(), title: input, completed: false }];
    
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: newSubtasks,
        updatedAt: serverTimestamp()
      });
      setNewSubtaskInputs(prev => ({ ...prev, [taskId]: '' }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string | number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const filteredSubtasks = task.subtasks.filter(s => s.id !== subtaskId);
    
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: filteredSubtasks,
        updatedAt: serverTimestamp()
      });
      setContextMenu(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const startEditingSubtask = (taskId: string, subtaskId: string | number, title: string) => {
    setEditingSubtask({ taskId, subtaskId: subtaskId.toString(), title });
    setContextMenu(null);
  };

  const saveSubtaskEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubtask || !editingSubtask.title.trim()) {
      setEditingSubtask(null);
      return;
    }

    const task = tasks.find(t => t.id === editingSubtask.taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(s => 
      s.id.toString() === editingSubtask.subtaskId ? { ...s, title: editingSubtask.title } : s
    );

    try {
      await updateDoc(doc(db, 'tasks', editingSubtask.taskId), {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp()
      });
      setEditingSubtask(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${editingSubtask.taskId}`);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTasks(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
      setIsProfileOpen(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const advisorMessage = useMemo(() => {
    if (stats.rate < 30) return { text: "Burnout Risk", sub: "Take a break, recharge your aura.", color: "text-red-400" };
    if (stats.rate < 60) return { text: "Focus Gaining", sub: "You're getting there. Keep pushing.", color: "text-amber-400" };
    if (stats.rate < 90) return { text: "Peak Performance", sub: "Incredible momentum. Stay sharp.", color: "text-blue-400" };
    return { text: "Pure Aura Flow", sub: "Hyper-focus achieved. Master status.", color: "text-purple-400" };
  }, [stats.rate]);

  // Chart Logic
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Learning Velocity',
        data: [45, 52, 48, 70, 85, 82, 95],
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: '#8b5cf6',
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        titleFont: { size: 14, weight: 'bold' as const },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#71717a' } }
    }
  };

  // Heatmap Data (GitHub style)
  const heatmapSquares = Array.from({ length: 98 }).map((_, i) => ({
    id: i,
    val: Math.random() > 0.5 ? Math.floor(Math.random() * 4) : 0
  }));

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Aura...</span>
      </div>
    </div>
  );

  if (!isLogged) return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-gray-900">Smart Student Hub</span>
        </div>
        <button 
          onClick={handleLogin}
          className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-violet-700 transition-all flex items-center gap-2 group"
        >
          Get Started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Powered by AI</span>
          </div>
          <h1 className="text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-8">
            Your campus. <br />
            <span className="text-violet-600">Reimagined.</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-12">
            Assignments, notes, schedules, AI tutoring, and a thriving student community — all in one beautifully crafted experience.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogin}
              className="bg-violet-600 text-white px-8 py-4 rounded-3xl font-bold text-lg hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/20 transition-all flex items-center gap-2"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={handleLogin} className="bg-white text-gray-900 px-8 py-4 rounded-3xl font-bold text-lg border border-gray-100 hover:bg-gray-50 transition-all">
              Sign In
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
          {[
            { label: 'Students', val: '10k+' },
            { label: 'Tutorials', val: '500+' },
            { label: 'Uptime', val: '99%' },
            { label: 'AI Support', val: '24/7' }
          ].map(stat => (
            <div key={stat.label} className="p-8 rounded-3xl bg-white border border-gray-50 shadow-sm text-center">
              <p className="text-4xl font-bold text-violet-600 mb-2">{stat.val}</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#030712] relative overflow-hidden text-gray-100">
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-md p-8 relative"
            >
              <button 
                onClick={() => setIsCustomizing(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Aura Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Accent Harmony</label>
                  <div className="flex gap-3">
                    {[ 
                      { name: 'Violet', color: '#a78bfa' }, 
                      { name: 'Azure', color: '#3b82f6' }, 
                      { name: 'Emerald', color: '#10b981' }, 
                      { name: 'Rose', color: '#f43f5e' }
                    ].map(theme => (
                      <button
                        key={theme.name}
                        onClick={() => setAccentColor(theme.color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${accentColor === theme.color ? 'scale-110 border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: theme.color }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-sm font-medium">Mesh Atmosphere</span>
                  </div>
                  <button 
                    onClick={() => setShowMesh(!showMesh)}
                    className={`w-12 h-6 rounded-full transition-all relative ${showMesh ? 'bg-violet-500' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showMesh ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

                      <button 
                        onClick={syncSettings}
                        className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Sync Calibration
                      </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --accent-primary: ${accentColor};
        }
        .text-purple-400, .text-purple-500, .text-violet-400 { color: ${accentColor} !important; }
        .bg-purple-500, .bg-violet-500 { background-color: ${accentColor} !important; }
        .border-purple-500, .border-violet-500 { border-color: ${accentColor} !important; }
        .bg-purple-500\\\\/10, .bg-violet-500\\\\/10 { background-color: ${accentColor}1a !important; }
      `}} />

      {showMesh && <MeshGradient />}

      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[200] glass min-w-[160px] p-1 shadow-2xl"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { toggleSubtask(contextMenu.taskId, contextMenu.subtaskId); setContextMenu(null); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Toggle Complete
            </button>
            <button 
              onClick={() => {
                const sub = tasks.find(t => t.id === contextMenu.taskId)?.subtasks.find(s => s.id === contextMenu.subtaskId);
                if (sub) startEditingSubtask(contextMenu.taskId, contextMenu.subtaskId, sub.title);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-blue-400" />
              Edit Subtask
            </button>
            <div className="h-px bg-white/5 my-1" />
            <button 
              onClick={() => deleteSubtask(contextMenu.taskId, contextMenu.subtaskId)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#030712]/50 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-500 lg:hidden"
            >
              <MessagesSquare className="w-5 h-5" />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Welcome back,</span>
              <span className="text-xs font-semibold text-gray-200">{userName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/20 mr-2">
              <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center ring-2 ring-violet-500/20">
                <Coins className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-violet-400">15</span>
            </div>
            
            <div className="h-9 w-48 bg-white/5 border border-white/10 rounded-xl px-3 flex items-center gap-2 group focus-within:border-violet-500/50 transition-all hidden sm:flex">
              <Search className="w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs text-gray-300 w-full" />
            </div>

            <button onClick={() => setIsCustomizing(true)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            </button>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-violet-500/20 ring-1 ring-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {userName.substring(0, 2).toUpperCase()}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 glass bg-[#09090b]/90 border-white/10 shadow-2xl z-[100] overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-semibold text-white mt-1 truncate">{userName}</p>
                    </div>

                    <div className="p-2">
                      {[
                        { icon: User, label: 'Your Profile', shortcut: '⌘P' },
                        { icon: ShieldCheck, label: 'Security', shortcut: '⌘S' },
                        { icon: Settings, label: 'Preferences', shortcut: '⌘,' },
                      ].map((item) => (
                        <button 
                          key={item.label}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400" />
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-600">{item.shortcut}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-2 border-t border-white/5">
                      <div className="px-3 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Cloud Session Active</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            className="h-full bg-violet-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-2 border-t border-white/5 bg-red-500/[0.02]">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                      >
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                        <span className="text-xs font-medium">Log out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <motion.div 
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {currentView === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    Good Evening, {userName} <motion.div animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Hand className="w-8 h-8 text-amber-300" /></motion.div>
                  </h1>
                  <p className="text-gray-500 mt-1">Here's what's happening with your studies today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total', value: stats.total, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Notices', value: stats.notices, icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/10' }
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-5 group flex items-center justify-between border-white/[0.03] hover:border-white/10 transition-all cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="glass-card p-8 flex flex-col items-center col-span-1">
                    <div className="w-full flex items-center gap-2 mb-8">
                      <TrendingUp className="w-4 h-4 text-violet-400" />
                      <h3 className="font-bold">Completion Rate</h3>
                    </div>
                    <div className="w-full h-[220px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={completionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                          >
                            {completionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{stats.rate}%</span>
                        <div className="h-1 w-16 bg-white/10 rounded-full mt-2" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-4 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                          <span className="text-xs text-gray-400 font-medium">Completed</span>
                        </div>
                        <span className="text-xs font-bold">{stats.completed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                          <span className="text-xs text-gray-400 font-medium">Pending</span>
                        </div>
                        <span className="text-xs font-bold">{stats.pending}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 col-span-2">
                    <div className="w-full flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold">Weekly Activity</h3>
                      </div>
                      <select className="bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-gray-500 rounded-lg px-2 py-1 outline-none">
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyActivityData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#71717a', fontSize: 10 }} 
                          />
                          <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fill: '#71717a', fontSize: 10 }} 
                          />
                          <RechartsTooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                          />
                          <Bar 
                            dataKey="value" 
                            fill={accentColor} 
                            radius={[4, 4, 0, 0]} 
                            barSize={32}
                            animationBegin={300}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-violet-400" />
                      <h3 className="font-bold">Smart Insight</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-emerald-400 font-bold text-lg">Outstanding! 🏆</p>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: '100%' }} />
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        You've completed 100% of your assignments. Amazing work — you're crushing it!
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                      <Calendar className="w-5 h-5" />
                      <h3 className="font-bold text-white">Upcoming Deadlines</h3>
                    </div>
                    <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
                      <Sparkles className="w-8 h-8 mb-2" />
                      <p className="text-sm font-bold">No upcoming deadlines 🥳</p>
                      <p className="text-xs">You're all clear - enjoy your day!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'assignments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <ClipboardList className="w-6 h-6 text-violet-400" />
                      Academic Assignments
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your active projects and learning checkpoints.</p>
                  </div>
                  <button 
                    onClick={() => setIsTaskCustomizing(true)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all border border-white/5"
                  >
                    View Settings
                  </button>
                </div>

                <form onSubmit={addTask} className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Plus className="w-5 h-5 text-gray-600 group-focus-within:text-violet-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Capture a new assignment or goal..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all backdrop-blur-md"
                  />
                </form>

                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`glass-card group overflow-hidden border-white/[0.03] ${task.completed ? 'opacity-60' : ''}`}
                      >
                        <div className="p-4 flex items-center gap-4">
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 hover:border-violet-500/50'}`}
                          >
                            {task.completed && <Check className="w-4 h-4 text-white" />}
                          </button>
                          
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(task.id)}>
                            <p className={`text-sm font-semibold truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                              {task.title}
                            </p>
                            {showSubtaskCounts && task.subtasks.length > 0 && (
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length} Milestones
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleExpand(task.id)}
                              className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500"
                            >
                              {expandedTasks.includes(task.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedTasks.includes(task.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 space-y-3"
                            >
                              <div className="pl-10 space-y-2 border-l-2 border-white/5 ml-3">
                                {task.subtasks.map((sub) => (
                                  <div 
                                    key={sub.id} 
                                    className="flex items-center gap-3 relative group/sub"
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      setContextMenu({ x: e.clientX, y: e.clientY, taskId: task.id, subtaskId: sub.id });
                                    }}
                                  >
                                    <CornerDownRight className="w-3.5 h-3.5 text-gray-700" />
                                    <button 
                                      onClick={() => toggleSubtask(task.id, sub.id)}
                                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${sub.completed ? 'bg-emerald-500/20 border-emerald-500/50' : 'border-white/10'}`}
                                    >
                                      {sub.completed && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                                    </button>
                                    
                                    {editingSubtask?.subtaskId === sub.id ? (
                                      <form onSubmit={saveSubtaskEdit} className="flex-1 flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-violet-500/30">
                                        <input
                                          autoFocus
                                          value={editingSubtask.title}
                                          onChange={(e) => setEditingSubtask(prev => prev ? { ...prev, title: e.target.value } : null)}
                                          className="bg-transparent text-xs py-1 px-2 w-full focus:outline-none text-white"
                                        />
                                        <div className="flex items-center gap-1 pr-1">
                                          <button 
                                            type="submit"
                                            className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400 transition-colors"
                                            title="Save Progress"
                                          >
                                            <Check className="w-3 h-3" />
                                          </button>
                                          <button 
                                            type="button"
                                            onClick={() => setEditingSubtask(null)}
                                            className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                            title="Discard"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <span className={`text-xs transition-colors ${sub.completed ? 'text-gray-600 line-through' : 'text-gray-400 group-hover/sub:text-gray-200'}`}>
                                        {sub.title}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                
                                <form 
                                  onSubmit={(e) => addSubtask(task.id, e)}
                                  className="flex items-center gap-3 pt-2"
                                >
                                  <CornerDownRight className="w-3.5 h-3.5 text-gray-700" />
                                  <input 
                                    placeholder="Add sub-checkpoint..."
                                    value={newSubtaskInputs[task.id] || ''}
                                    onChange={(e) => setNewSubtaskInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                                    className="bg-transparent border-none outline-none text-[11px] text-gray-600 focus:text-violet-400 transition-colors w-full"
                                  />
                                </form>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {currentView === 'admin' && (
              <div className="space-y-8 pb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <ShieldAlert className="w-8 h-8 text-red-400" />
                      Executive Control
                    </h2>
                    <p className="text-gray-500 mt-1">High-level system diagnostics and user management.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      System Online
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Active Users', val: '1', delta: 'Nominal', icon: Users },
                    { label: 'System Latency', val: '0ms', delta: 'Optimal', icon: Activity },
                    { label: 'Security Breaches', val: '0', delta: 'Secure', icon: ShieldCheck },
                  ].map((s) => (
                    <div key={s.label} className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-xl bg-white/5 text-gray-400">
                          <s.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold ${s.delta.startsWith('+') ? 'text-emerald-400' : s.delta.startsWith('-') ? 'text-blue-400' : 'text-gray-500'}`}>
                          {s.delta}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{s.val}</p>
                    </div>
                  ))}
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                       <User className="w-4 h-4 text-violet-400" />
                       User Management
                    </h3>
                    <button className="text-[10px] uppercase font-bold text-violet-400 hover:text-white transition-colors">Export DB</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Identity</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Access Level</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { name: userName, email: `${userName.toLowerCase()}@aura.hub`, status: 'Online', role: 'Root Admin', color: 'text-red-400' },
                        ].map((user) => (
                          <tr key={user.email} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px]">
                                  {user.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-200">{user.name}</p>
                                  <p className="text-[10px] text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                user.status === 'Online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                                user.status === 'Idle' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                'bg-white/5 border-white/10 text-gray-500'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              <span className={user.color}>{user.role}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                <Settings className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentView !== 'dashboard' && currentView !== 'assignments' && currentView !== 'admin' && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12">
                <Search className="w-16 h-16 text-gray-800 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
                <p className="text-gray-500 max-w-sm">This section is currently being calibrated with your neural aura. Please check back shortly.</p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Floating Chat Trigger */}
        <button 
          onClick={() => setIsSmartBotOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-violet-600 text-white rounded-2xl shadow-2xl shadow-violet-500/40 hover:scale-110 active:scale-95 transition-all z-50 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform" />
          <MessageCircle className="w-6 h-6 relative" />
        </button>

        {/* SmartBot Side Drawer */}
        <AnimatePresence>
          {isSmartBotOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#09090b] border-l border-white/5 z-[100] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-violet-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="flex items-center gap-4 relative">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">SmartBot</h3>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">AI Study Assistant</p>
                  </div>
                </div>
                <button onClick={() => setIsSmartBotOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white relative">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-8 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Hi {userName}! Ask me anything about your studies 📚</h4>
                  <div className="flex flex-col gap-2 mt-6">
                    {['What are my pending tasks?', 'Any deadlines today?', 'Give me study tips'].map(q => (
                      <button key={q} className="text-xs p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 text-gray-400 hover:text-violet-400 transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask SmartBot..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-violet-500/50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-violet-500 hover:text-violet-400">
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
