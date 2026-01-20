'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, TaskType } from '@/types';
import { WEEKS, STATUSES } from '@/lib/utils/constants';
import { Plus, X } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Partial<Task>) => void;
    task?: Task | null;
    initialStatus?: TaskStatus;
    initialWeek?: number;
}

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
            <div className="bg-[rgb(var(--color-bg-primary))] rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in border border-[rgb(var(--color-border-primary))]">
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold">
                                {task ? 'Edit Task' : 'New Task'}
                            </h3>
                            <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
                                {task ? 'Update task details' : 'Create a new task for your workflow'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-[rgb(var(--color-bg-tertiary))] rounded-full transition-all"
                        >
                            <X size={24} className="text-[rgb(var(--color-text-tertiary))]" />
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Task Title */}
                        <div>
                            <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                Task Title
                            </label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g., Conduct user research"
                                className="w-full px-5 py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))] transition-all font-semibold"
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
                                className="w-full px-5 py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))] transition-all font-medium resize-none"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Week and Priority */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Week
                                </label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] font-bold text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))]"
                                    value={formData.week}
                                    onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) })}
                                >
                                    {WEEKS.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Priority
                                </label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] font-bold text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))]"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                        </div>

                        {/* Status and Type */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Status
                                </label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] font-bold text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))]"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] mb-3 block">
                                    Type
                                </label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] font-bold text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))]"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
                                >
                                    <option value="feature">Feature</option>
                                    <option value="bug">Bug</option>
                                    <option value="improvement">Improvement</option>
                                    <option value="research">Research</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="other">Other</option>
                                </select>
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
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] rounded-full text-xs font-bold"
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
                        className="w-full bg-[rgb(var(--color-primary))] text-white font-black py-5 rounded-[2rem] hover:bg-[rgb(var(--color-primary-hover))] transition-all shadow-xl uppercase tracking-widest"
                    >
                        {task ? 'Update Task' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};
