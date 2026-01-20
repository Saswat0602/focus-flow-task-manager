'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { MessageSquare, GripVertical } from 'lucide-react';
import { STATUSES } from '@/lib/utils/constants';

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
    onStatusChange?: (status: string) => void;
    isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onClick,
    onStatusChange,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityColor = {
        high: 'bg-rose-500',
        medium: 'bg-amber-400',
        low: 'bg-blue-400',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group bg-[rgb(var(--color-bg-primary))] p-5 rounded-2xl border border-[rgb(var(--color-border-primary))] shadow-custom-sm hover:border-[rgb(var(--color-primary))] hover:shadow-custom-xl transition-all cursor-pointer relative"
            onClick={onClick}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical size={16} className="text-[rgb(var(--color-text-tertiary))]" />
            </div>

            <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-bold text-[rgb(var(--color-text-primary))] leading-snug pr-8">
                    {task.text}
                </p>
                <div
                    className={`shrink-0 w-3 h-3 rounded-full border-4 border-[rgb(var(--color-bg-primary))] shadow-sm ${priorityColor[task.priority]
                        }`}
                />
            </div>

            {task.description && (
                <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {task.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary))]"
                        >
                            {tag}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-tertiary))]">
                            +{task.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--color-border-secondary))]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--color-text-tertiary))] font-bold bg-[rgb(var(--color-bg-tertiary))] px-2 py-1 rounded-lg">
                        <MessageSquare size={12} /> {task.comments?.length || 0}
                    </div>
                </div>

                <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onStatusChange?.(e.target.value)}
                    value={task.status}
                    className="text-[10px] font-black uppercase bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-1.5 text-[rgb(var(--color-text-secondary))] cursor-pointer focus:ring-1 focus:ring-[rgb(var(--color-border-focus))] transition-all"
                >
                    {STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
