import React, { useMemo, useState } from "react";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
}

export interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: "single" | "multiple" | false;
  onRowSelect?: (selectedRows: T[]) => void;
  emptyMessage?: string;
  className?: string;
}

type SortState<T> = { key: keyof T; direction: "asc" | "desc" } | null;

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading,
  selectable = false,
  onRowSelect,
  emptyMessage = "No data",
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState<T>>(null);
  const [selectedIds, setSelectedIds] = useState<Set<T["id"]>>(new Set());

  const sorted = useMemo(() => {
    if (!sort) return data;
    const arr = [...data];
    const { key, direction } = sort;
    arr.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < (bv as any)) return direction === "asc" ? -1 : 1;
      if (av > (bv as any)) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sort]);

  const toggleSort = (c: Column<T>) => {
    if (!c.sortable) return;
    const key = c.dataIndex;
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  };

  const isSelectable = selectable !== false;

  const onToggleRow = (row: T) => {
    setSelectedIds((prev) => {
      if (selectable === "single") {
        const next = new Set<T["id"]>();
        next.add(row.id);
        return next;
      }
      const next = new Set(prev);
      if (next.has(row.id)) next.delete(row.id);
      else next.add(row.id);
      return next;
    });
  };

  React.useEffect(() => {
    if (!onRowSelect) return;
    const map = new Map(data.map((d) => [d.id, d]));
    const selected = [...selectedIds].map((id) => map.get(id)!).filter(Boolean);
    onRowSelect(selected);
  }, [selectedIds, data, onRowSelect]);

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div
        role="status"
        aria-live="polite"
        className={loading ? "mb-2 text-sm" : "sr-only"}
      >
        {loading ? "Loading…" : ""}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800" role="table">
          <thead className="bg-gray-50 dark:bg-gray-900" role="rowgroup">
            <tr role="row">
              {isSelectable && <th className="w-10" />}
              {columns.map((c) => {
                const ariaSort =
                  sort && sort.key === c.dataIndex
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none";
                return (
                  <th
                    key={c.key}
                    scope="col"
                    role="columnheader"
                    aria-sort={c.sortable ? (ariaSort as any) : undefined}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 ${c.sortable ? "hover:underline" : "cursor-default"}`}
                      onClick={() => toggleSort(c)}
                      aria-label={c.sortable ? `Sort by ${c.title}` : undefined}
                    >
                      {c.title}
                      {c.sortable && (
                        <span aria-hidden className="text-xs">
                          {sort?.key === c.dataIndex ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800" role="rowgroup">
            {!loading && sorted.length === 0 && (
              <tr role="row">
                <td
                  role="cell"
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={(isSelectable ? 1 : 0) + columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {loading && (
              <tr role="row">
                <td
                  role="cell"
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={(isSelectable ? 1 : 0) + columns.length}
                >
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              sorted.map((row) => {
                const selected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    role="row"
                    className={`hover:bg-gray-50 dark:hover:bg-gray-900 ${selected ? "bg-gray-50 dark:bg-gray-900" : ""}`}
                    aria-selected={selected || undefined}
                    onClick={() => isSelectable && onToggleRow(row)}
                    tabIndex={0}
                  >
                    {isSelectable && (
                      <td role="cell" className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label="Select row"
                          checked={selected}
                          onChange={() => onToggleRow(row)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4"
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} role="cell" className="px-4 py-3 text-sm">
                        {String(row[c.dataIndex] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
