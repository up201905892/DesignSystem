import { useRef, useState } from 'react';
import {
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  VisuallyHidden,
  useToast,
  type DataTableColumn,
} from '@up201905892/ui';
import { EllipsisIcon, PlusIcon } from '@up201905892/icons';
import {
  initialTasks,
  priorityLabels,
  priorityRank,
  statusLabels,
  type Task,
  type TaskStatus,
} from './data';
import { TaskForm, type TaskValues } from './TaskForm';

type StatusFilter = 'all' | TaskStatus;

const PAGE_SIZE = 10;

const statusVariants = { todo: 'neutral', 'in-progress': 'info', done: 'success' } as const;
const priorityVariants = { low: 'neutral', medium: 'warning', high: 'danger' } as const;

export function Tasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const newTaskRef = useRef<HTMLButtonElement>(null);
  const rowButtons = useRef(new Map<string, HTMLButtonElement | null>());
  /** The element that opened the dialog; it gets the focus back when the dialog closes. */
  const opener = useRef<HTMLElement | null>(null);
  const nextId = useRef(initialTasks.length + 1);

  const visible = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const restoreFocus = (event: Event) => {
    event.preventDefault();
    opener.current?.focus();
  };

  const openNew = () => {
    opener.current = newTaskRef.current;
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    opener.current = rowButtons.current.get(task.id) ?? newTaskRef.current;
    setEditing(task);
    setFormOpen(true);
  };

  const openDelete = (task: Task) => {
    opener.current = rowButtons.current.get(task.id) ?? newTaskRef.current;
    setDeleting(task);
  };

  const save = (values: TaskValues) => {
    if (editing) {
      setTasks((current) =>
        current.map((task) => (task.id === editing.id ? { ...task, ...values } : task)),
      );
      toast({ title: 'Task updated', description: values.title, variant: 'success' });
    } else {
      const id = `task-${nextId.current}`;
      nextId.current += 1;
      setTasks((current) => [{ id, status: 'todo', ...values }, ...current]);
      toast({ title: 'Task created', description: values.title, variant: 'success' });
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    const removed = deleting;
    const index = tasks.findIndex((task) => task.id === removed.id);
    setTasks((current) => current.filter((task) => task.id !== removed.id));
    opener.current = newTaskRef.current;
    setDeleting(null);
    toast({
      title: 'Task deleted',
      description: removed.title,
      variant: 'info',
      action: {
        label: 'Undo',
        altText: `Undo the deletion of ${removed.title}`,
        onClick: () =>
          setTasks((current) => {
            const copy = [...current];
            copy.splice(Math.min(index, copy.length), 0, removed);
            return copy;
          }),
      },
    });
  };

  const columns: DataTableColumn<Task>[] = [
    { id: 'title', header: 'Title', accessor: 'title', sortable: true },
    { id: 'assignee', header: 'Assignee', accessor: 'assignee', sortable: true },
    {
      id: 'priority',
      header: 'Priority',
      accessor: 'priority',
      sortable: true,
      compare: (a, b) => priorityRank[a.priority] - priorityRank[b.priority],
      cell: (row) => (
        <Badge variant={priorityVariants[row.priority]}>{priorityLabels[row.priority]}</Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge variant={statusVariants[row.status]}>{statusLabels[row.status]}</Badge>,
    },
    { id: 'due', header: 'Due date', accessor: 'due', sortable: true },
    {
      id: 'actions',
      header: <VisuallyHidden>Actions</VisuallyHidden>,
      accessor: 'id',
      align: 'end',
      cell: (row) => (
        <DropdownMenu>
          <Tooltip content="Actions">
            <DropdownMenuTrigger asChild>
              <IconButton
                ref={(node) => {
                  rowButtons.current.set(row.id, node);
                }}
                variant="ghost"
                size="sm"
                aria-label={`Actions for ${row.title}`}
                icon={<EllipsisIcon />}
              />
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openEdit(row)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openDelete(row)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <section className="ds-example-section" aria-labelledby="tasks-title">
      <h1 id="tasks-title">Tasks</h1>
      <div className="ds-example-toolbar">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">
              {filter === 'all' ? 'Filters' : `Filters: ${statusLabels[filter]}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent aria-label="Filters" align="start" showClose>
            <Stack gap={3} align="start">
              <RadioGroup
                aria-label="Status"
                value={filter}
                onValueChange={(value) => {
                  setFilter(value as StatusFilter);
                  setPage(1);
                }}
              >
                <Radio value="all">All</Radio>
                <Radio value="todo">{statusLabels.todo}</Radio>
                <Radio value="in-progress">{statusLabels['in-progress']}</Radio>
                <Radio value="done">{statusLabels.done}</Radio>
              </RadioGroup>
              <PopoverClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilter('all');
                    setPage(1);
                  }}
                >
                  Clear filter
                </Button>
              </PopoverClose>
            </Stack>
          </PopoverContent>
        </Popover>
        <Dialog
          open={formOpen}
          onOpenChange={(open) => {
            if (open) openNew();
            else setFormOpen(false);
          }}
        >
          <DialogTrigger asChild>
            <Button ref={newTaskRef} leadingIcon={<PlusIcon />}>
              New task
            </Button>
          </DialogTrigger>
          <DialogContent onCloseAutoFocus={restoreFocus} closeOnOverlayClick={false}>
            <TaskForm key={editing?.id ?? 'new'} task={editing} onSave={save} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        className="ds-example-table"
        caption="Team tasks"
        captionHidden
        data={visible}
        columns={columns}
        getRowId={(row) => row.id}
        pageSize={PAGE_SIZE}
        page={currentPage}
        onPageChange={setPage}
        onSortChange={() => setPage(1)}
        emptyMessage="No tasks match the filter."
      />
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent size="sm" onCloseAutoFocus={restoreFocus}>
          <DialogHeader>
            <DialogTitle>Delete task</DialogTitle>
            <DialogDescription>
              {deleting ? `Delete "${deleting.title}"? You can undo this right after.` : null}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>The task leaves the list for everyone on the team.</DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
