"use client";

import { DataGrid, GridColDef } from '@mui/x-data-grid';

export function Table({ data, config, columns, loading = false, tableActions }: { data: any[], config: any, columns: GridColDef[], loading?: boolean, tableActions?: React.ReactNode }) {
    return (
        <div className="table-container">
            <div className="table-header">
                <div className="table-title">
                    <h2>{config.title}</h2>
                </div>
                <div className="table-actions">
                    {tableActions}
                </div>
            </div>
            <DataGrid
                className="table-data-grid"
                rows={data}
                columns={columns}
                getRowId={(row) => row[config.table.rowId]}
                loading={loading}
                showToolbar
            />
        </div>
    );
}