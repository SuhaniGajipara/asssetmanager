import React from 'react';

const Table = ({ columns = [], data = [], renderRow }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="px-6 py-3 text-label-caps text-on-surface-variant whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
          {data.length > 0 ? (
            data.map((item, rowIndex) => renderRow ? renderRow(item, rowIndex) : (
              <tr key={rowIndex} className="hover:bg-surface-variant transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-body-md text-on-surface">
                    {item[col.toLowerCase()] || '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-body-md text-outline">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
