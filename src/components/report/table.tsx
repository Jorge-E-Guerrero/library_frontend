"use client";

import { useState } from 'react';

import {
    Collapse,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

export function ReportTable({ reportData, config, columns, loading = false }: { reportData: any[], config: any, columns: GridColDef[], loading?: boolean }) {

    const [open, setOpen] = useState(false);
    const [arrowIcon, setArrowIcon] = useState(<KeyboardArrowDownIcon className="arrow-icon" />);

    const toggleDropdown = () => {
        setOpen(!open);
        setArrowIcon(open ? <KeyboardArrowDownIcon className="arrow-icon" /> : <KeyboardArrowUpIcon className="arrow-icon" />);
    }

    return (
        <div className="report-table-container">
            <ListItem disablePadding key={config.title}>
                <ListItemButton onClick={toggleDropdown}>
                    <div className="report-table-title">
                        <h2>{config.title}</h2>
                    </div>
                    {arrowIcon}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <DataGrid
                    className="report-data-grid"
                    rows={reportData}
                    columns={columns}
                    getRowId={(row) => row[config.table.rowId]}
                    loading={loading}
                    showToolbar
                />
            </Collapse>
        </div>
    );
}