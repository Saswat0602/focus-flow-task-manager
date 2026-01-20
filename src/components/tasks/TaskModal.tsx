'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, TaskType } from '@/types';
import { WEEKS, STATUSES } from '@/lib/utils/constants';
import { Plus, X, Check } from 'lucide-react';
import { PriorityBadge } from '../ui/PriorityBadge';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Partial<Task>) => void;
    task?: Task | null;
    initialStatus?: TaskStatus;
    initialWeek?: number;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

const typeOptions: { value: TaskType; label: string }[] = [
    { value: 'feature', label: 'Feature' },
    { value: 'bug', label: 'Bug' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'research', label: 'Research' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'other', label: 'Other' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    task,
    initialStatus = 'todo',
    initialWeek = 1,
}) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        text: '',
        description: '',
        status: initialStatus,
        priority: 'medium',
        type: 'other',
        week: initialWeek,
        tags: [],
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (task) {
            setFormData(task);
        } else {
            setFormData({
                text: '',
                description: '',
                status: initialStatus,
                priority: 'medium',
                type: 'other',
                week: initialWeek,
                tags: [],
            });
        }
    }, [task, initialStatus, initialWeek]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text?.trim()) return;
        onSubmit(formData);
        onClose();
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), tagInput.trim()],
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter((t) => t !== tag) || [],
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[rgb(var(--color-bg-primary))] rounded-3xl md:rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-zoom-in border border-[rgb(var(--color-border-primary))] scrollbar-thin">
                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-bold">
                                {task ? 'Edit Task' : 'New Task'}
                            </h3>
                            <p className="text-xs md:text-sm text-[rgb(var(--color-text-tertiary))] mt-1">
                                {task ? 'Update task details' : 'Create a new task for your workflow'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-full transition-all ml-2"
                        >
                            <X size={20} className="text-[rgb(var(--color-text-tertiary))]" />
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5 md:space-y-6">
                        {/* Task Title */}
                        <div>
                            <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                Task Title
                            </label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g., Conduct user research"
                                className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))] transition-all font-semibold text-sm md:text-base"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                Description (Optional)
                            </label>
                            <textarea
                                placeholder="Add more details about this task..."
                                className="w-full px-4 md:px-5 py-3 md:py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))] transition-all font-medium resize-none text-sm md:text-base"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Week and Priority */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Week
                                </label>
                                <div className="space-y-2">
                                    {WEEKS.map((w) => (
                                        <button
                                            key={w.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, week: w.id })}
                                            className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-all ${formData.week === w.id
                                                    ? 'bg-[rgb(var(--color-primary))] text-white'
                                                    : 'bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{w.label}</span>
                                                {formData.week === w.id && <Check size={16} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Priority
                                </label>
                                <div className="space-y-2">
                                    {priorityOptions.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: p.value })}
                                            className={`w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-all ${formData.priority === p.value
                                                    ? 'bg-[rgb(var(--color-primary))] text-white'
                                                    : 'bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                {formData.priority === p.value ? (
                                                    <span>{p.label}</span>
                                                ) : (
                                                    <PriorityBadge priority={p.value} size="sm" />
                                                )}
                                                {formData.priority === p.value && <Check size={16} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status and Type */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Status
                                </label>
                                <div className="space-y-2">
                                    {STATUSES.slice(0, 2).map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s.id })}
                                            className={`w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${formData.status === s.id
                                                    ? 'bg-[rgb(var(--color-primary))] text-white'
                                                    : 'bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{s.label}</span>
                                                {formData.status === s.id && <Check size={14} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Type
                                </label>
                                <div className="space-y-2">
                                    {typeOptions.slice(0, 2).map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t.value })}
                                            className={`w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${formData.type === t.value
                                                    ? 'bg-[rgb(var(--color-primary))] text-white'
                                                    : 'bg-[rgb(var(--color-bg-tertiary))] hover:bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{t.label}</span>
                                                {formData.type === t.value && <Check size={14} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Add a tag..."
                                    className="flex-1 px-4 py-2 rounded-xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))] transition-all text-sm"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-xl hover:bg-[rgb(var(--color-primary-hover))] transition-all"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            {formData.tags && formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] rounded-full text-xs font-bold"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-[rgb(var(--color-error))]"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[rgb(var(--color-primary))] text-white font-black py-4 md:py-5 rounded-3xl hover:bg-[rgb(var(--color-primary-hover))] transition-all shadow-xl uppercase tracking-widest text-sm md:text-base"
                    >
                        {task ? 'Update Task' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};
