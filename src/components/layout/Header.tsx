'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    onAddTask?: () => void;
    showAddButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    onAddTask,
    showAddButton = true,
}) => {
    return (
        <header className="px-8 py-6 flex justify-between items-center bg-[rgb(var(--color-bg-primary))] border-b border-[rgb(var(--color-border-primary))]">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-[rgb(var(--color-text-tertiary))] text-sm mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>

            {showAddButton && onAddTask && (
                <button
                    onClick={onAddTask}
                    className="flex items-center gap-2 bg-[rgb(var(--color-text-primary))] text-[rgb(var(--color-text-inverse))] px-5 py-2.5 rounded-xl hover:bg-[rgb(var(--color-primary-hover))] transition-all shadow-lg"
                >
                    <Plus size={20} />
                    <span className="font-semibold text-sm">Add Task</span>
                </button>
            )}
        </header>
    );
};
