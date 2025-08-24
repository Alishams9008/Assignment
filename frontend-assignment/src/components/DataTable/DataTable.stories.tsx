import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";
import type { Column } from "./DataTable";

type Person = { id: number; name: string; email: string; age: number };

const cols: Column<Person>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "email", title: "Email", dataIndex: "email" },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

const rows: Person[] = [
  { id: 1, name: "Aisha", email: "aisha@example.com", age: 24 },
  { id: 2, name: "Bilal", email: "bilal@example.com", age: 28 },
  { id: 3, name: "Zohaib", email: "zohaib@example.com", age: 22 },
];

const meta: Meta<typeof DataTable<Person>> = {
  title: "Components/DataTable",
  component: DataTable<Person>,
};
export default meta;
type Story = StoryObj<typeof DataTable<Person>>;

export const Basic: Story = {
  args: { data: rows, columns: cols },
};

export const Loading: Story = {
  args: { data: [], columns: cols, loading: true },
};

export const Empty: Story = {
  args: { data: [], columns: cols },
};

export const SelectableMultiple: Story = {
  args: {
    data: rows,
    columns: cols,
    selectable: "multiple",
    onRowSelect: (rows) => console.log(rows),
  },
};

export const SelectableSingle: Story = {
  args: {
    data: rows,
    columns: cols,
    selectable: "single",
  },
};
