// Type check (b): compiled with `tsc --noEmit` and `strict` against the installed tarballs.
import { Button, DataTable } from '@up201905892/ui';
import { CheckIcon } from '@up201905892/icons';
import { tokens } from '@up201905892/tokens';

interface User {
  id: string;
  name: string;
  age: number;
}

const users: readonly User[] = [
  { id: 'a', name: 'Ada', age: 36 },
  { id: 'b', name: 'Linus', age: 55 },
];

export function Example() {
  return (
    <div>
      <Button variant="primary" size="md" onClick={() => undefined}>
        <CheckIcon aria-hidden="true" /> OK
      </Button>
      <DataTable<User>
        caption="Users"
        data={users}
        getRowId={(user) => user.id}
        columns={[
          { id: 'name', header: 'Name', accessor: 'name', sortable: true },
          { id: 'age', header: 'Age', accessor: (user) => user.age, numeric: true },
        ]}
      />
    </div>
  );
}

// `tokens` is a typed object: reading a value must give a string.
export const canvas: string = tokens.border.width['1'];

// @ts-expect-error `age` is a number, not a string: the typed rows must reject this.
export const wrong: User = { id: 'c', name: 'Grace', age: '40' };

// @ts-expect-error `getRowId` is required.
export const missing = <DataTable<User> caption="Users" data={users} columns={[]} />;
