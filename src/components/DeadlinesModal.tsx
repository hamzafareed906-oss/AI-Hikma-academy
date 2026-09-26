import React, { useState } from 'react';
import {
  X,
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { DeadlineItem } from '../types';

interface DeadlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadlines: DeadlineItem[];
  onToggleComplete: (id: string) => void;
  onAddDeadline: (item: Omit<DeadlineItem, 'id' | 'completed'>) => void;
}

export const DeadlinesModal: React.FC<DeadlinesModalProps> = ({
  isOpen,
  onClose,
  deadlines,
  onToggleComplete,
  onAddDeadline,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science & Coding');
  const [newDueDate, setNewDueDate] = useState('');
  const [newType, setNewType] = useState<DeadlineItem['type']>('Homework');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;

    onAddDeadline({
      title: newTitle,
      subject: newSubject,
      dueDate: newDueDate,
      type: newType,
      notes: newNotes,
    });

    setNewTitle('');
    setNewDueDate('');
    setNewNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Upcoming Academic Deadlines & Notifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track homework, quiz dates, and coding milestones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seamless Update Status Banner */}
        <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Automated Background Sync Active (Zero Interruption)</span>
          </div>
          <span className="font-mono text-[11px] font-semibold">v2.4 Live</span>
        </div>

        {/* Deadlines List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {deadlines.map((item) => {
            const isOverdue = new Date(item.dueDate) < new Date() && !item.completed;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 text-xs ${
                  item.completed
                    ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : isOverdue
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-1">
                    <span
                      className={`font-bold text-sm block ${
                        item.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>{item.subject}</span>
                      <span>•</span>
                      <span className="font-semibold">{item.type}</span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`font-semibold ${
                      item.completed
                        ? 'text-slate-400'
                        : isOverdue
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    Due: {item.dueDate}
                  </div>
                  {isOverdue && !item.completed && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold">
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {showAddForm && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Add New Academic Deadline</h4>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Calculus Midterm Exam Prep"
                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <option>Computer Science & Coding</option>
                    <option>Mathematics</option>
                    <option>Islamic Studies & History</option>
                    <option>Natural Sciences</option>
                    <option>Languages & Literature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deadline</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
