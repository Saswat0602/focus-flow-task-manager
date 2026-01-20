'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTasks, useCreateTask, useUpdateTaskStatus } from '@/lib/hooks/useTasks';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Header } from '@/components/layout/Header';
import { Task, TaskStatus } from '@/types';
import { WEEKS } from '@/lib/utils/constants';

export default function TasksPage() {
    const searchParams = useSearchParams();
    const weekParam = searchParams.get('week');
    const [activeWeek, setActiveWeek] = useState(weekParam ? parseInt(weekParam) : 1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [initialStatus, setInitialStatus] = useState<TaskStatus>('todo');

    const { data: allTasks = [], isLoading } = useTasks();
    const createTask = useCreateTask();
    const updateTaskStatus = useUpdateTaskStatus();

    useEffect(() => {
        if (weekParam) {
            setActiveWeek(parseInt(weekParam));
        }
    }, [weekParam]);

    const weekTasks = useMemo(() => {
        return allTasks.filter((task) => task.week === activeWeek);
    }, [allTasks, activeWeek]);

    const handleAddTask = (status?: TaskStatus) => {
        setSelectedTask(null);
        setInitialStatus(status || 'todo');
        setIsModalOpen(true);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleSubmit = (taskData: Partial<Task>) => {
        if (selectedTask) {
            // Update existing task
            updateTaskStatus.mutate({
                id: selectedTask.id,
                status: taskData.status as TaskStatus,
            });
        } else {
            // Create new task
            createTask.mutate({
                ...taskData,
                date: new Date().toISOString().split('T')[0],
                comments: [],
            } as any);
        }
    };

    const handleStatusChange = (taskId: string, status: TaskStatus) => {
        updateTaskStatus.mutate({ id: taskId, status });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[rgb(var(--color-text-secondary))] font-semibold">Loading tasks...</p>
                </div>
            </div>
        );
    }

    const currentWeek = WEEKS.find((w) => w.id === activeWeek);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Header
                title={`Weekly Execution / Week ${activeWeek}`}
                subtitle={currentWeek?.range}
                onAddTask={() => handleAddTask()}
            />

            <div className="flex flex-col h-full animate-slide-in-right overflow-hidden">
                {/* Week Tab Switcher */}
                <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2 bg-[rgb(var(--color-bg-primary))] flex items-center gap-1 border-b border-[rgb(var(--color-border-secondary))] overflow-x-auto scrollbar-thin">
                    {WEEKS.map((w) => (
                        <button
                            key={w.id}
                            onClick={() => setActiveWeek(w.id)}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-t-xl text-xs md:text-sm font-bold transition-all relative whitespace-nowrap ${activeWeek === w.id
                                    ? 'text-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg-tertiary))]'
                                    : 'text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))]'
                                }`}
                        >
                            {w.label}
                            {activeWeek === w.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-[rgb(var(--color-primary))] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Task Board */}
                <div className="flex-1 p-4 md:p-8 bg-[rgb(var(--color-bg-secondary))] overflow-hidden">
                    <TaskBoard
                        tasks={weekTasks}
                        onTaskClick={handleTaskClick}
                        onStatusChange={handleStatusChange}
                        onAddTask={handleAddTask}
                    />
                </div>
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                }}
                onSubmit={handleSubmit}
                task={selectedTask}
                initialStatus={initialStatus}
                initialWeek={activeWeek}
            />
        </div>
    );
}
