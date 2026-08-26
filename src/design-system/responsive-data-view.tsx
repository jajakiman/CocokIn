import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
};

type ResponsiveDataViewProps<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  columns: Column<T>[];
  emptyText?: string;
  ariaLabel?: string;
};

export function ResponsiveDataView<T>({
  items,
  keyExtractor,
  columns,
  emptyText = "Tidak ada data untuk ditampilkan",
  ariaLabel = "Daftar data",
}: ResponsiveDataViewProps<T>) {
  if (items.length === 0) {
    return <p className="responsive-data-view__empty">{emptyText}</p>;
  }

  return (
    <div className="responsive-data-view" aria-label={ariaLabel}>
      {/* Desktop / Tablet Table (>= 768px) */}
      <div className="responsive-data-view__table-container">
        <table className="responsive-data-view__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={keyExtractor(item)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (< 768px) */}
      <div className="responsive-data-view__cards" role="list">
        {items.map((item) => (
          <article
            key={keyExtractor(item)}
            className="responsive-data-view__card"
            role="listitem"
          >
            {columns.map((col) => (
              <div key={col.key} className="responsive-data-view__card-row">
                <span className="responsive-data-view__card-label">
                  {col.header}
                </span>
                <div className="responsive-data-view__card-value">
                  {col.render(item)}
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
