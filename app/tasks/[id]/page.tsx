'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTask, useUpdateTask, useDeleteTask } from '@/lib/hooks/useTasks';
import { Header } from '@/components/layout/Header';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { WEEKS, STATUSES } from '@/lib/utils/constants';
import { ArrowLeft, Send, Trash2, Calendar, Tag as TagIcon, MessageSquare } from 'lucide-react';
import { Task } from '@/types';

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const taskId = params.id as string;

    const { data: task, isLoading } = useTask(taskId);
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const [commentText, setCommentText] = useState('');

    const handleDelete = () => {
        if (task && confirm('Are you sure you want to delete this task?')) {
            deleteTask.mutate(task.id, {
                onSuccess: () => router.push('/tasks'),
            });
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !task) return;

        const newComment = {
            id: Date.now().toString(),
            taskId: task.id,
            user: 'You',
            text: commentText,
            time: 'Just now',
            createdAt: new Date().toISOString(),
        };

        updateTask.mutate({
            id: task.id,
            updates: {
                comments: [...(task.comments || []), newComment],
            },
        });

        setCommentText('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[rgb(var(--color-text-secondary))] font-semibold">Loading task...</p>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8">
                <p className="text-xl font-bold text-[rgb(var(--color-text-secondary))] mb-4">Task not found</p>
                <button
                    onClick={() => router.push('/tasks')}
                    className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-xl hover:bg-[rgb(var(--color-primary-hover))] transition-all"
                >
                    <ArrowLeft size={18} />
                    Back to Tasks
                </button>
            </div>
        );
    }

    const currentWeek = WEEKS.find((w) => w.id === task.week);
    const currentStatus = STATUSES.find((s) => s.id === task.status);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[rgb(var(--color-bg-secondary))]">
            <Header
                title="Task Details"
                subtitle={currentWeek?.range}
                showAddButton={false}
            />

            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="max-w-5xl mx-auto p-4 md:p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/tasks')}
                        className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-all text-sm font-semibold mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Tasks
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Left Side */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Task Header Card */}
                            <div className="bg-[rgb(var(--color-bg-primary))] rounded-3xl border border-[rgb(var(--color-border-primary))] p-6 md:p-8 shadow-custom-md">
                                <div className="flex items-start justify-between mb-6">
                                    <h1 className="text-2xl md:text-4xl font-bold flex-1 leading-tight">{task.text}</h1>
                                    <button
                                        onClick={handleDelete}
                                        className="p-3 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-all ml-4"
                                    >
                                        <Trash2 size={20} className="text-red-500" />
                                    </button>
                                </div>

                                {/* Priority Badge */}
                                <div className="mb-6">
                                    <PriorityBadge priority={task.priority} size="lg" />
                                </div>

                                {/* Description */}
                                {task.description && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-3">
                                            Description
                                        </h3>
                                        <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed text-base">
                                            {task.description}
                                        </p>
                                    </div>
                                )}

                                {/* Tags */}
                                {task.tags && task.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <TagIcon size={14} />
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {task.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))] rounded-full text-sm font-bold"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Comments Section */}
                            <div className="bg-[rgb(var(--color-bg-primary))] rounded-3xl border border-[rgb(var(--color-border-primary))] p-6 md:p-8 shadow-custom-md">
                                <h2 className="text-lg font-black text-[rgb(var(--color-text-primary))] uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <MessageSquare size={18} />
                                    Comments ({task.comments?.length || 0})
                                </h2>

                                {/* Comments List */}
                                <div className="space-y-6 mb-6">
                                    {task.comments && task.comments.length > 0 ? (
                                        task.comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-purple-600 flex items-center justify-center text-white shrink-0 font-bold text-sm shadow-lg">
                                                    {comment.user[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-bold text-sm">{comment.user}</span>
                                                        <span className="text-xs text-[rgb(var(--color-text-tertiary))]">{comment.time}</span>
                                                    </div>
                                                    <div className="bg-[rgb(var(--color-bg-tertiary))] p-4 rounded-2xl rounded-tl-none border border-[rgb(var(--color-border-secondary))]">
                                                        <p className="text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                                            {comment.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-[rgb(var(--color-bg-tertiary))] rounded-2xl border-2 border-dashed border-[rgb(var(--color-border-primary))]">
                                            <MessageSquare size={48} className="mx-auto mb-3 text-[rgb(var(--color-text-tertiary))]" />
                                            <p className="text-[rgb(var(--color-text-tertiary))] text-sm font-semibold">
                                                No comments yet. Be the first to comment!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Add Comment Form */}
                                <form onSubmit={handleAddComment} className="relative">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-[rgb(var(--color-bg-tertiary))] border-2 border-[rgb(var(--color-border-primary))] rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent transition-all resize-none"
                                        rows={3}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!commentText.trim()}
                                        className="absolute bottom-4 right-4 p-3 bg-[rgb(var(--color-primary))] text-white rounded-xl hover:bg-[rgb(var(--color-primary-hover))] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar - Right Side */}
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6 shadow-custom-sm">
                                <h3 className="text-xs font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-4">
                                    Status
                                </h3>
                                <div className={`px-4 py-3 rounded-xl ${currentStatus?.bg} ${currentStatus?.color} font-bold text-center`}>
                                    {currentStatus?.label}
                                </div>
                            </div>

                            {/* Week Card */}
                            <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6 shadow-custom-sm">
                                <h3 className="text-xs font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Calendar size={14} />
                                    Week
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-bold text-lg">{currentWeek?.label}</p>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">{currentWeek?.range}</p>
                                </div>
                            </div>

                            {/* Type Card */}
                            {task.type && (
                                <div className="bg-[rgb(var(--color-bg-primary))] rounded-2xl border border-[rgb(var(--color-border-primary))] p-6 shadow-custom-sm">
                                    <h3 className="text-xs font-black text-[rgb(var(--color-text-tertiary))] uppercase tracking-wider mb-4">
                                        Type
                                    </h3>
                                    <div className="px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] rounded-xl font-bold text-center capitalize">
                                        {task.type}
                                    </div>
                                </div>
                            )}

                            {/* Edit Button */}
                            <button
                                onClick={() => router.push(`/tasks`)}
                                className="w-full bg-[rgb(var(--color-primary))] text-white px-6 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-hover))] transition-all font-bold shadow-lg"
                            >
                                Back to Board
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
