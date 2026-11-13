import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Button,
  Checkbox,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Stack,
  Switch,
  Textarea,
} from '@up201905892/ui';
import { priorityLabels, team, type Priority, type Task } from './data';

export type TaskValues = Pick<
  Task,
  'title' | 'description' | 'assignee' | 'priority' | 'due' | 'urgent' | 'notify'
>;

/** Time of the simulated request, in milliseconds. */
const SAVE_DELAY = 400;

interface TaskFormProps {
  /** The task being edited, or `null` for a new one. */
  task: Task | null;
  onSave: (values: TaskValues) => void;
}

/** The form of the task dialog. It starts from the task, so mounting it resets the values. */
export function TaskForm({ task, onSave }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [assignee, setAssignee] = useState(task?.assignee ?? team[0] ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [due, setDue] = useState(task?.due ?? '');
  const [urgent, setUrgent] = useState(task?.urgent ?? false);
  const [notify, setNotify] = useState(task?.notify ?? false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (title.trim() === '') {
      setTitleError('Enter a title for the task.');
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    timer.current = setTimeout(() => {
      onSave({ title: title.trim(), description, assignee, priority, due, urgent, notify });
    }, SAVE_DELAY);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogHeader>
        <DialogTitle>{task ? 'Edit task' : 'New task'}</DialogTitle>
        <DialogDescription>
          {task ? 'Change the details of the task.' : 'Fill in the details of the new task.'}
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <Stack gap={4}>
          <Field invalid={titleError !== null} required>
            <FieldLabel>Title</FieldLabel>
            <Input
              ref={titleRef}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setTitleError(null);
              }}
            />
            <FieldError>{titleError}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Assignee</FieldLabel>
            <Select value={assignee} onValueChange={setAssignee}>
              {team.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </Select>
          </Field>
          <Field>
            <FieldLabel>Due date</FieldLabel>
            <Input type="date" value={due} onChange={(event) => setDue(event.target.value)} />
            <FieldDescription>Optional.</FieldDescription>
          </Field>
          <Stack gap={2}>
            <span id="task-priority-label">Priority</span>
            <RadioGroup
              aria-labelledby="task-priority-label"
              orientation="horizontal"
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              {(Object.keys(priorityLabels) as Priority[]).map((key) => (
                <Radio key={key} value={key}>
                  {priorityLabels[key]}
                </Radio>
              ))}
            </RadioGroup>
          </Stack>
          <Checkbox checked={urgent} onCheckedChange={(checked) => setUrgent(checked === true)}>
            Mark as urgent
          </Checkbox>
          <Switch checked={notify} onCheckedChange={setNotify}>
            Notify the team
          </Switch>
        </Stack>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" loading={saving} loadingLabel="Saving">
          Save task
        </Button>
      </DialogFooter>
    </form>
  );
}
