import { useState } from "react";
import { InputField } from "../components/InputField/InputField";
import { DataTable } from "../components/DataTable/DataTable";
import type { Column } from "../components/DataTable/DataTable";

type Person = { id: number; name: string; email: string; age: number };

const columns: Column<Person>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "email", title: "Email", dataIndex: "email" },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

const seed: Person[] = [
  { id: 1, name: "Aisha", email: "aisha@example.com", age: 24 },
  { id: 2, name: "Bilal", email: "bilal@example.com", age: 28 },
  { id: 3, name: "Zohaib", email: "zohaib@example.com", age: 22 },
];

export default function Demo() {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen px-6 py-10 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-3xl space-y-10">
        <h1 className="text-2xl font-bold">Component Demo</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">InputField</h2>
          <InputField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            helperText="We’ll never share your email."
            allowClear
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">DataTable</h2>
          <DataTable<Person> data={seed} columns={columns} selectable="multiple" />
        </section>
      </div>
    </div>
  );
}
