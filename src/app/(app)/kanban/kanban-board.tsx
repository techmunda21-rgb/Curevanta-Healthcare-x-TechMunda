"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateTaskStatusAction } from "@/app/actions/tasks";
import { PriorityBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { TaskStatus } from "@prisma/client";

type KanbanTask = {
  id: string;
  title: string;
  priority: string;
  status: TaskStatus;
  dueDate: string | Date | null;
  estimatedHours: number;
  assignee?: { name: string } | null;
  workstream?: { name: string } | null;
  blockers?: { id: string }[];
};

type Column = { status: TaskStatus; tasks: KanbanTask[] };

const LABELS: Record<string, string> = {
  BACKLOG: "BACKLOG",
  READY: "READY",
  IN_PROGRESS: "IN PROGRESS",
  BLOCKED: "BLOCKED",
  IN_REVIEW: "REVIEW",
  QA: "QA",
  REWORK: "REWORK",
  DONE: "DONE",
};

function TaskCard({ task }: { task: KanbanTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-lg border border-[var(--border)] bg-white p-3 shadow-sm active:cursor-grabbing"
    >
      <div className="text-sm font-medium leading-snug">{task.title}</div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        {task.workstream ? <Badge variant="outline">{task.workstream.name}</Badge> : null}
        {(task.blockers?.length ?? 0) > 0 ? <Badge variant="danger">Blocked</Badge> : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>{task.assignee?.name ?? "Unassigned"}</span>
        <span>
          {task.estimatedHours}h · {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}

export function KanbanBoard({ initialColumns }: { initialColumns: Column[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const activeTask = useMemo(() => {
    for (const col of columns) {
      const t = col.tasks.find((x) => x.id === activeId);
      if (t) return t;
    }
    return null;
  }, [activeId, columns]);

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const fromStatus = active.data.current?.status as TaskStatus | undefined;

    let toStatus: TaskStatus | undefined = over.data.current?.status as TaskStatus | undefined;
    if (!toStatus) {
      // dropped on a card — find its column
      for (const col of columns) {
        if (col.tasks.some((t) => t.id === String(over.id)) || col.status === over.id) {
          toStatus = col.status;
          break;
        }
      }
    }
    // column droppable ids are status strings
    if (columns.some((c) => c.status === over.id)) {
      toStatus = over.id as TaskStatus;
    }

    if (!toStatus || !fromStatus || toStatus === fromStatus) return;

    setColumns((prev) => {
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const from = next.find((c) => c.status === fromStatus)!;
      const to = next.find((c) => c.status === toStatus)!;
      const idx = from.tasks.findIndex((t) => t.id === taskId);
      if (idx < 0) return prev;
      const [moved] = from.tasks.splice(idx, 1);
      moved.status = toStatus!;
      to.tasks.unshift(moved);
      return next;
    });

    startTransition(async () => {
      await updateTaskStatusAction(taskId, toStatus!);
    });
  }

  return (
    <div className="space-y-3">
      {pending ? (
        <div className="text-xs text-[var(--muted)]">Saving board…</div>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          {columns.map((col) => (
            <div
              key={col.status}
              id={col.status}
              className="w-[280px] shrink-0 rounded-xl bg-[var(--surface-muted)] p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold tracking-wide text-[var(--graphite)]">
                  {LABELS[col.status] ?? col.status}
                </div>
                <Badge variant="secondary">{col.tasks.length}</Badge>
              </div>
              <SortableContext items={col.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="min-h-[120px] space-y-2" data-status={col.status}>
                  {/* Droppable column marker */}
                  <ColumnDrop status={col.status} />
                  {col.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="w-[280px] rounded-lg border border-[var(--brand)] bg-white p-3 shadow-lg">
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function ColumnDrop({ status }: { status: TaskStatus }) {
  const { setNodeRef } = useSortable({ id: status, data: { status } });
  return <div ref={setNodeRef} className="h-1" />;
}
