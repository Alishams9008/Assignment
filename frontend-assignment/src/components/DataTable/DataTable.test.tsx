import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { DataTable } from "./DataTable";
import type { Column } from "./DataTable";

type P = { id: number; name: string; age: number };
const cols: Column<P>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];
const rows: P[] = [
  { id: 1, name: "C", age: 30 },
  { id: 2, name: "A", age: 20 },
  { id: 3, name: "B", age: 25 },
];

test("sorts by column", async () => {
  const user = userEvent.setup();
  render(<DataTable data={rows} columns={cols} />);
  const sortByName = screen.getByRole("button", { name: /sort by name/i });
  await user.click(sortByName); // asc
  const first = screen.getAllByRole("row")[1]; // first data row
  expect(first).toHaveTextContent("A");

  await user.click(sortByName); // desc
  const first2 = screen.getAllByRole("row")[1];
  expect(first2).toHaveTextContent("C");
});

test("selects rows (multiple)", async () => {
  const user = userEvent.setup();
  const spy = vi.fn();
  render(
    <DataTable data={rows} columns={cols} selectable="multiple" onRowSelect={spy} />
  );
  const boxes = screen.getAllByRole("checkbox", { name: /select row/i });
  await user.click(boxes[0]);
  await user.click(boxes[1]);
  expect(spy).toHaveBeenCalled();
});
