import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useAllTasks } from '../hooks/useTasks';
import { useBoards } from '../context/BoardsContext';
import { BarChart, BarDatum } from '../components/BarChart';
import { LineChart, LinePoint } from '../components/LineChart';
const TODAY = new Date('2023-10-26');
export function Analytics() {
  const { tasks, isLoading } = useAllTasks();
  const { boards } = useBoards();
  // Tasks completed over time — last 14 days
  const completionPoints: LinePoint[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const count = tasks.filter((t) => t.completedAt === dayStr).length;
    completionPoints.push({
      label: d.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric'
      }),
      value: count
    });
  }
  const totalCompleted14 = completionPoints.reduce((sum, p) => sum + p.value, 0);
  // Priority breakdown
  const priorityCounts = {
    High: tasks.filter((t) => t.priority === 'High').length,
    Medium: tasks.filter((t) => t.priority === 'Medium').length,
    Low: tasks.filter((t) => t.priority === 'Low').length
  };
  const priorityData: BarDatum[] = [
  {
    label: 'High',
    value: priorityCounts.High,
    color: 'bg-rose-400',
    glow: '0 0 8px rgba(251,113,133,0.4)'
  },
  {
    label: 'Medium',
    value: priorityCounts.Medium,
    color: 'bg-amber-400',
    glow: '0 0 8px rgba(251,191,36,0.4)'
  },
  {
    label: 'Low',
    value: priorityCounts.Low,
    color: 'bg-cyan-400',
    glow: '0 0 8px rgba(34,211,238,0.4)'
  }];

  // Column efficiency: % of tasks in each status across all boards
  const total = tasks.length || 1;
  const statusData: BarDatum[] = [
  {
    label: 'To Do',
    value: Math.round(
      tasks.filter((t) => t.status === 'To Do').length / total * 100
    ),
    color: 'bg-yellow-400',
    glow: '0 0 8px rgba(250,204,21,0.4)'
  },
  {
    label: 'In Progress',
    value: Math.round(
      tasks.filter((t) => t.status === 'In Progress').length / total * 100
    ),
    color: 'bg-cyan-400',
    glow: '0 0 8px rgba(34,211,238,0.4)'
  },
  {
    label: 'Done',
    value: Math.round(
      tasks.filter((t) => t.status === 'Done').length / total * 100
    ),
    color: 'bg-emerald-400',
    glow: '0 0 8px rgba(74,222,128,0.4)'
  }];

  // Board completion ranking
  const boardStats = boards.
  map((b) => {
    const bt = tasks.filter((t) => t.boardId === b.id);
    const done = bt.filter((t) => t.status === 'Done').length;
    return {
      board: b,
      total: bt.length,
      done,
      percent: bt.length === 0 ? 0 : Math.round(done / bt.length * 100)
    };
  }).
  sort((a, b) => b.percent - a.percent);
  const completed = tasks.filter((t) => t.status === 'Done').length;
  const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Analytics
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Productivity insights across all boards.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Total Tasks"
            value={isLoading ? '–' : tasks.length}
            trend="All boards"
            icon={<BarChart3 className="w-4 h-4" />} />
          
          <KpiCard
            label="Completed"
            value={isLoading ? '–' : completed}
            trend={`${completionRate}% rate`}
            icon={<PieChart className="w-4 h-4" />} />
          
          <KpiCard
            label="Last 14 days"
            value={isLoading ? '–' : totalCompleted14}
            trend="Tasks closed"
            icon={<Activity className="w-4 h-4" />} />
          
          <KpiCard
            label="Avg/Day"
            value={isLoading ? '–' : (totalCompleted14 / 14).toFixed(1)}
            trend="Last 14 days"
            icon={<TrendingUp className="w-4 h-4" />} />
          
        </div>

        {/* Completion over time */}
        <motion.div
          initial={{
            opacity: 0,
            y: 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="rounded-2xl bg-[#16161a] border border-white/5 p-5">
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-white">
                Completion over time
              </div>
              <div className="text-xs text-slate-500">
                Tasks marked Done — last 14 days
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              {totalCompleted14} closed
            </div>
          </div>
          <LineChart data={completionPoints} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Priority breakdown */}
          <motion.div
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.05
            }}
            className="rounded-2xl bg-[#16161a] border border-white/5 p-5">
            
            <div className="mb-4">
              <div className="text-sm font-semibold text-white">
                By priority
              </div>
              <div className="text-xs text-slate-500">
                Count of tasks per priority level
              </div>
            </div>
            <BarChart data={priorityData} />
          </motion.div>

          {/* Column efficiency */}
          <motion.div
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="rounded-2xl bg-[#16161a] border border-white/5 p-5">
            
            <div className="mb-4">
              <div className="text-sm font-semibold text-white">
                Column distribution
              </div>
              <div className="text-xs text-slate-500">
                % of total tasks in each workflow status
              </div>
            </div>
            <BarChart data={statusData} max={100} unit="%" />
          </motion.div>
        </div>

        {/* Board leaderboard */}
        <motion.div
          initial={{
            opacity: 0,
            y: 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.15
          }}
          className="rounded-2xl bg-[#16161a] border border-white/5 p-5">
          
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">
              Board completion
            </div>
            <div className="text-xs text-slate-500">Ranked by % complete</div>
          </div>
          <div className="flex flex-col gap-3">
            {boardStats.map((bs, i) =>
            <div key={bs.board.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs font-medium text-slate-400 flex-shrink-0">
                  {i + 1}
                </div>
                <span
                className={`w-2 h-2 rounded-full ${bs.board.color} flex-shrink-0`} />
              
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {bs.board.name}
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {bs.done}/{bs.total} · {bs.percent}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${bs.percent}%`
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + i * 0.05
                    }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                  
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>);

}
function KpiCard({
  label,
  value,
  trend,
  icon





}: {label: string;value: React.ReactNode;trend: string;icon: React.ReactNode;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 6
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="rounded-2xl bg-[#16161a] border border-white/5 p-4">
      
      <div className="flex items-center justify-between mb-2">
        <div className="w-7 h-7 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      <div className="text-[11px] text-slate-500 mt-1">{trend}</div>
    </motion.div>);

}