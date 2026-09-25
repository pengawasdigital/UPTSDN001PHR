import React, { useState, useMemo } from 'react';
import { SearchBar, Pagination } from './FormControls.tsx';
import { EmptyState } from './Feedback.tsx';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  actions?: React.ReactNode;
  itemsPerPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Cari data...',
  searchFilter,
  actions,
  itemsPerPage = 10,
  emptyTitle,
  emptyDescription
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim() || !searchFilter) return data;
    return data.filter(item => searchFilter(item, search.toLowerCase()));
  }, [data, search, searchFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Table Top Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {searchFilter ? (
          <SearchBar
            value={search}
            onChange={val => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
          />
        ) : (
          <div />
        )}
        {actions && <div className="flex items-center gap-2 self-end sm:self-auto">{actions}</div>}
      </div>

      {/* Table Content */}
      {paginatedData.length === 0 ? (
        <div className="p-8">
          <EmptyState
            title={emptyTitle || (search ? 'Tidak Ditemukan' : 'Belum Ada Data')}
            description={
              emptyDescription ||
              (search
                ? `Tidak ada data yang cocok dengan kata kunci "${search}".`
                : 'Data pada modul ini masih kosong.')
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((item, index) => {
                const itemIndex = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400 font-medium">
                      {itemIndex}
                    </td>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`py-3.5 px-4 ${col.className || ''}`}>
                        {col.render
                          ? col.render(item, itemIndex)
                          : col.accessor
                          ? String(item[col.accessor] ?? '-')
                          : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Pagination */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
