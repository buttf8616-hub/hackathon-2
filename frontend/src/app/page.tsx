'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TaskCreate, TaskUpdate } from '@/types/task';
import { useTasksQuery, useCreateTask, useUpdateTask, useDeleteTask, useToggleTask } from '@/lib/hooks';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import FilterBar, { FilterState } from '@/components/FilterBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ToastContainer, { showToast } from '@/components/Toast';
import ChatPanel from '@/components/ChatPanel';

type SidebarView = 'all' | 'today' | 'upcoming' | 'completed' | 'high' | 'medium' | 'low';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>('all');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const queryClient = useQueryClient();

  const queryParams: Record<string, string> = {};
  if (filters.status) queryParams.status = filters.status;
  if (filters.priority) queryParams.priority = filters.priority;
  if (filters.tag) queryParams.tag = filters.tag;
  if (filters.search) queryParams.search = filters.search;
  queryParams.sort_by = filters.sort_by;
  queryParams.sort_order = filters.sort_order;

  const { data: tasks, isLoading, error } = useTasksQuery(queryParams);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();

  const hasActiveFilters = !!(filters.status || filters.priority || filters.tag || filters.search);

  const refreshTasks = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }, [queryClient]);

  useTasksQuery(queryParams, showChat ? 3000 : undefined);

  // Compute sidebar counts
  const counts = useMemo(() => {
    if (!tasks) return { all: 0, today: 0, upcoming: 0, completed: 0, high: 0, medium: 0, low: 0 };
    const today = new Date().toISOString().split('T')[0];
    return {
      all: tasks.length,
      today: tasks.filter(t => t.due_date === today && !t.completed).length,
      upcoming: tasks.filter(t => t.due_date && t.due_date > today && !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
      medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
      low: tasks.filter(t => t.priority === 'low' && !t.completed).length,
    };
  }, [tasks]);

  // Apply sidebar view as filter
  const handleSidebarClick = (view: SidebarView) => {
    setSidebarView(view);
    setMobileSidebar(false);
    const newFilters: FilterState = { sort_by: filters.sort_by, sort_order: filters.sort_order };
    if (view === 'completed') newFilters.status = 'completed';
    else if (view !== 'all') newFilters.status = 'active';
    if (view === 'high') newFilters.priority = 'high';
    else if (view === 'medium') newFilters.priority = 'medium';
    else if (view === 'low') newFilters.priority = 'low';
    setFilters(newFilters);
  };

  const handleCreate = (data: TaskCreate | TaskUpdate) => {
    createTask.mutate(data as TaskCreate, {
      onSuccess: () => {
        setShowForm(false);
        showToast('Task created successfully');
      },
      onError: (err) => {
        showToast(err.message || 'Failed to create task', 'error');
      },
    });
  };

  const handleUpdate = (id: number, data: TaskUpdate) => {
    updateTask.mutate(
      { id, data },
      {
        onSuccess: () => showToast('Task updated successfully'),
        onError: (err) => showToast(err.message || 'Failed to update task', 'error'),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteTask.mutate(id, {
      onSuccess: () => showToast('Task deleted successfully'),
      onError: (err) => showToast(err.message || 'Failed to delete task', 'error'),
    });
  };

  const handleToggle = (id: number) => {
    toggleTask.mutate(id, {
      onError: (err) => showToast(err.message || 'Failed to toggle task', 'error'),
    });
  };

  const taskCount = tasks?.length ?? 0;
  const completedCount = tasks?.filter(t => t.completed).length ?? 0;
  const activeCount = taskCount - completedCount;
  const progressPercent = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  const sidebarItems: { id: SidebarView; label: string; icon: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All Tasks', icon: 'inbox', count: counts.all },
    { id: 'today', label: 'Today', icon: 'today', count: counts.today, color: 'text-cyan-400' },
    { id: 'upcoming', label: 'Upcoming', icon: 'upcoming', count: counts.upcoming },
    { id: 'completed', label: 'Completed', icon: 'check', count: counts.completed, color: 'text-emerald-400' },
  ];

  const priorityItems: { id: SidebarView; label: string; count: number; dot: string }[] = [
    { id: 'high', label: 'High Priority', count: counts.high, dot: 'bg-red-500' },
    { id: 'medium', label: 'Medium Priority', count: counts.medium, dot: 'bg-amber-500' },
    { id: 'low', label: 'Low Priority', count: counts.low, dot: 'bg-cyan-500' },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'inbox':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />;
      case 'today':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case 'upcoming':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
      case 'check':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* AI Circuit Chip Background */}
      <div className="circuit-bg">
        {/* Grid pattern */}
        <div className="circuit-grid" />
        <div className="circuit-lines" />

        {/* Gradient orbs - more colorful */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-400/8 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-teal-500/8 rounded-full blur-[80px]" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-500/6 rounded-full blur-[80px]" />

        {/* Chip squares with pins */}
        <div className="chip-square" style={{ top: '6%', left: '12%', width: '90px', height: '90px' }}>
          <div className="chip-pin chip-pin-h" style={{ top: '20%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '50%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '80%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '20%', right: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '50%', right: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '80%', right: '-8px' }} />
        </div>
        <div className="chip-square" style={{ top: '60%', right: '8%', width: '110px', height: '70px' }}>
          <div className="chip-pin chip-pin-v" style={{ left: '25%', top: '-8px' }} />
          <div className="chip-pin chip-pin-v" style={{ left: '50%', top: '-8px' }} />
          <div className="chip-pin chip-pin-v" style={{ left: '75%', top: '-8px' }} />
          <div className="chip-pin chip-pin-v" style={{ left: '25%', bottom: '-8px' }} />
          <div className="chip-pin chip-pin-v" style={{ left: '75%', bottom: '-8px' }} />
        </div>
        <div className="chip-square" style={{ top: '30%', right: '22%', width: '70px', height: '70px' }} />
        <div className="chip-square" style={{ bottom: '12%', left: '28%', width: '80px', height: '80px' }}>
          <div className="chip-pin chip-pin-h" style={{ top: '30%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '70%', left: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '30%', right: '-8px' }} />
          <div className="chip-pin chip-pin-h" style={{ top: '70%', right: '-8px' }} />
        </div>
        <div className="chip-square" style={{ top: '45%', left: '4%', width: '55px', height: '55px' }} />
        <div className="chip-square" style={{ top: '18%', right: '38%', width: '100px', height: '55px' }} />

        {/* Hexagon shapes */}
        <div className="hex-shape" style={{ top: '15%', right: '15%' }}>
          <div className="hex-shape-inner" />
        </div>
        <div className="hex-shape" style={{ top: '55%', left: '18%' }}>
          <div className="hex-shape-inner" />
        </div>
        <div className="hex-shape" style={{ bottom: '25%', right: '30%' }}>
          <div className="hex-shape-inner" />
        </div>

        {/* Central orbit ring */}
        <div className="orbit-ring" style={{ top: '30%', left: '40%', width: '200px', height: '200px' }} />
        <div className="orbit-ring" style={{ top: '33%', left: '43%', width: '140px', height: '140px', animationDirection: 'reverse', animationDuration: '15s' }} />

        {/* Circuit traces with animated data pulses - both directions */}
        <div className="circuit-trace-h" style={{ top: '10%', left: '0', width: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '0s' }} />
          <div className="data-pulse" style={{ animationDelay: '3s' }} />
        </div>
        <div className="circuit-trace-h" style={{ top: '25%', left: '0', width: '100%' }}>
          <div className="data-pulse-reverse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="circuit-trace-h" style={{ top: '40%', left: '0', width: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '2s' }} />
          <div className="data-pulse-reverse" style={{ animationDelay: '5s' }} />
        </div>
        <div className="circuit-trace-h" style={{ top: '55%', left: '0', width: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '4s' }} />
        </div>
        <div className="circuit-trace-h" style={{ top: '70%', left: '0', width: '100%' }}>
          <div className="data-pulse-reverse" style={{ animationDelay: '1.5s' }} />
          <div className="data-pulse" style={{ animationDelay: '4.5s' }} />
        </div>
        <div className="circuit-trace-h" style={{ top: '85%', left: '0', width: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '3.5s' }} />
        </div>

        <div className="circuit-trace-v" style={{ left: '15%', top: '0', height: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="circuit-trace-v" style={{ left: '30%', top: '0', height: '100%' }}>
          <div className="data-pulse-reverse" style={{ animationDelay: '2.5s' }} />
        </div>
        <div className="circuit-trace-v" style={{ left: '50%', top: '0', height: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="data-pulse-reverse" style={{ animationDelay: '4s' }} />
        </div>
        <div className="circuit-trace-v" style={{ left: '70%', top: '0', height: '100%' }}>
          <div className="data-pulse" style={{ animationDelay: '3s' }} />
        </div>
        <div className="circuit-trace-v" style={{ left: '85%', top: '0', height: '100%' }}>
          <div className="data-pulse-reverse" style={{ animationDelay: '1.8s' }} />
        </div>

        {/* Large glowing nodes at key intersections */}
        <div className="circuit-node-lg node-breathe" style={{ top: '40%', left: '50%' }} />
        <div className="circuit-node-lg node-breathe" style={{ top: '10%', left: '30%', animationDelay: '2s' }} />
        <div className="circuit-node-lg node-breathe" style={{ top: '70%', left: '70%', animationDelay: '1s' }} />

        {/* Regular nodes */}
        <div className="circuit-node node-blink" style={{ top: '10%', left: '15%' }} />
        <div className="circuit-node node-blink" style={{ top: '10%', left: '50%', animationDelay: '1s' }} />
        <div className="circuit-node node-blink" style={{ top: '10%', left: '70%', animationDelay: '0.5s' }} />
        <div className="circuit-node node-blink" style={{ top: '10%', left: '85%', animationDelay: '2s' }} />
        <div className="circuit-node node-blink" style={{ top: '25%', left: '15%', animationDelay: '1.5s' }} />
        <div className="circuit-node node-blink" style={{ top: '25%', left: '50%', animationDelay: '0.8s' }} />
        <div className="circuit-node node-blink" style={{ top: '25%', left: '85%', animationDelay: '2.2s' }} />
        <div className="circuit-node node-blink" style={{ top: '40%', left: '15%', animationDelay: '1.2s' }} />
        <div className="circuit-node node-blink" style={{ top: '40%', left: '30%', animationDelay: '0.3s' }} />
        <div className="circuit-node node-blink" style={{ top: '40%', left: '70%', animationDelay: '1.8s' }} />
        <div className="circuit-node node-blink" style={{ top: '40%', left: '85%', animationDelay: '2.5s' }} />
        <div className="circuit-node node-blink" style={{ top: '55%', left: '30%', animationDelay: '0.6s' }} />
        <div className="circuit-node node-blink" style={{ top: '55%', left: '50%', animationDelay: '1.4s' }} />
        <div className="circuit-node node-blink" style={{ top: '55%', left: '85%', animationDelay: '2.8s' }} />
        <div className="circuit-node node-blink" style={{ top: '70%', left: '15%', animationDelay: '1.1s' }} />
        <div className="circuit-node node-blink" style={{ top: '70%', left: '30%', animationDelay: '0.4s' }} />
        <div className="circuit-node node-blink" style={{ top: '70%', left: '50%', animationDelay: '2.3s' }} />
        <div className="circuit-node node-blink" style={{ top: '70%', left: '85%', animationDelay: '0.9s' }} />
        <div className="circuit-node node-blink" style={{ top: '85%', left: '15%', animationDelay: '1.7s' }} />
        <div className="circuit-node node-blink" style={{ top: '85%', left: '50%', animationDelay: '0.7s' }} />
        <div className="circuit-node node-blink" style={{ top: '85%', left: '70%', animationDelay: '2.1s' }} />
        <div className="circuit-node node-blink" style={{ top: '85%', left: '85%', animationDelay: '1.3s' }} />

        {/* Corner brackets on chips */}
        <div className="corner-bracket corner-bracket-tl" style={{ top: '6%', left: '12%' }} />
        <div className="corner-bracket corner-bracket-br" style={{ top: 'calc(6% + 70px)', left: 'calc(12% + 70px)' }} />
        <div className="corner-bracket corner-bracket-tl" style={{ top: '60%', right: 'calc(8% + 90px)' }} />
        <div className="corner-bracket corner-bracket-br" style={{ top: 'calc(60% + 50px)', right: '8%' }} />

        {/* AI text labels - brighter ones */}
        <div className="ai-label-bright" style={{ top: '8%', left: '22%' }}>neural net</div>
        <div className="ai-label-bright" style={{ top: '38%', left: '52%' }}>ai core</div>
        <div className="ai-label-bright" style={{ top: '68%', left: '72%' }}>deep learn</div>

        {/* Regular labels */}
        <div className="ai-label" style={{ top: '23%', left: '17%' }}>transformer</div>
        <div className="ai-label" style={{ top: '53%', left: '32%' }}>attention</div>
        <div className="ai-label" style={{ top: '83%', left: '22%' }}>tensor</div>
        <div className="ai-label" style={{ top: '18%', right: '10%' }}>inference</div>
        <div className="ai-label" style={{ bottom: '15%', left: '55%' }}>gpu cluster</div>
        <div className="ai-label" style={{ top: '45%', left: '6%' }}>llm</div>
        <div className="ai-label" style={{ bottom: '30%', right: '15%' }}>weights</div>
        <div className="ai-label" style={{ top: '35%', right: '5%' }}>embedding</div>

        {/* Binary streams */}
        <div className="binary-stream" style={{ top: '5%', left: '60%', transform: 'rotate(90deg)' }}>01001010 11010010</div>
        <div className="binary-stream" style={{ bottom: '8%', left: '10%' }}>10110100 01101001 11010010</div>
        <div className="binary-stream" style={{ top: '50%', right: '3%', transform: 'rotate(90deg)' }}>11001010 01010110</div>
      </div>

      <ToastContainer />

      <div className="flex min-h-screen relative z-10">

        {/* Sidebar overlay */}
        {mobileSidebar && <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setMobileSidebar(false)} />}

        {/* ===== SIDEBAR - Toggle with Menu button ===== */}
        <aside className={`flex flex-col w-64 border-r border-gray-800/80 bg-[#0c0c14]/90 backdrop-blur-xl fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${mobileSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Logo + Close */}
          <div className="px-5 py-5 border-b border-gray-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <svg className="w-5 h-5 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">Todo App</h1>
                  <p className="text-[10px] text-cyan-400/70 font-medium tracking-wider uppercase">AI Powered</p>
                </div>
              </div>
              <button onClick={() => setMobileSidebar(false)} className="text-gray-500 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress card */}
          <div className="px-4 py-4">
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
                <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2.5 text-[11px]">
                <span className="text-gray-500"><span className="text-cyan-400 font-semibold">{activeCount}</span> active</span>
                <span className="text-gray-500"><span className="text-emerald-400 font-semibold">{completedCount}</span> done</span>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-3 flex-1 overflow-y-auto">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Tasks</p>
            <div className="space-y-0.5">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSidebarClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    sidebarView === item.id
                      ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <svg className={`w-4.5 h-4.5 ${sidebarView === item.id ? 'text-cyan-400' : item.color || 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {renderIcon(item.icon)}
                  </svg>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className={`text-xs font-semibold min-w-[20px] text-center px-1.5 py-0.5 rounded-md ${
                      sidebarView === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="h-px bg-gray-800/60 my-4 mx-3" />

            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Priority</p>
            <div className="space-y-0.5">
              {priorityItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSidebarClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    sidebarView === item.id
                      ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className={`text-xs font-semibold min-w-[20px] text-center px-1.5 py-0.5 rounded-md ${
                      sidebarView === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom: AI Assistant button */}
          <div className="px-4 py-4 border-t border-gray-800/60">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                showChat
                  ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {showChat ? 'Close AI Chat' : 'AI Assistant'}
            </button>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className={`flex-1 transition-all duration-300 ${showChat ? 'mr-[420px]' : ''}`}>
          {/* Header */}
          <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-gray-800/50">
            <div className="max-w-4xl mx-auto px-4 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Menu toggle button */}
                  <button
                    onClick={() => setMobileSidebar(!mobileSidebar)}
                    className={`px-3 py-2 rounded-xl transition-all text-sm font-semibold ${
                      mobileSidebar
                        ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 ring-1 ring-gray-700'
                    }`}
                  >
                    Menu
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {sidebarItems.find(i => i.id === sidebarView)?.label || priorityItems.find(i => i.id === sidebarView)?.label || 'All Tasks'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {taskCount === 0 ? 'No tasks' : `${taskCount} task${taskCount !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* AI Assistant button */}
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
                      showChat
                        ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {showChat ? 'Close AI' : 'AI Assistant'}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
                      showForm
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 ring-1 ring-gray-700'
                        : 'bg-cyan-500 text-[#0a0a0f] hover:bg-cyan-400 shadow-lg shadow-cyan-500/25'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {showForm ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Task
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="max-w-4xl mx-auto px-4 py-6">
            {showForm && (
              <div className="mb-6 animate-fade-in-up">
                <TaskForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowForm(false)}
                  isLoading={createTask.isPending}
                />
              </div>
            )}

            <div className="mb-6">
              <FilterBar filters={filters} onFilterChange={setFilters} />
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-red-500/20 backdrop-blur-sm">
                <div className="text-4xl mb-3">&#x26A0;</div>
                <p className="text-red-400 font-medium mb-2">Failed to load tasks</p>
                <p className="text-sm text-gray-500 mb-4">{(error as Error).message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            ) : (
              <TaskList
                tasks={tasks ?? []}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAddClick={() => setShowForm(true)}
                isSearching={hasActiveFilters}
              />
            )}
          </main>
        </div>

        {/* Chat panel */}
        {showChat && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowChat(false)}
            />
            <div className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-[#0d0d14] border-l border-cyan-500/10 shadow-2xl shadow-black/50 z-50 flex flex-col animate-slide-in-right">
              <ChatPanel onClose={() => setShowChat(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
