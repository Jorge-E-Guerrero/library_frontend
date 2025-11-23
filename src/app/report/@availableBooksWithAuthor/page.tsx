"use client";

import { useState, useEffect } from 'react';

import { GridColDef } from '@mui/x-data-grid';
import { ReportTable } from '@/src/components/report/table';
import { requestToApi } from '@/src/helpers/middleware';

const report = "available_books_with_author";

export default function BasicExampleDataGrid() {

    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getReportData = async () => {
        setLoading(true);
        try {
            const response = await requestToApi({ method: "get", path: `/views/${report}` });
            if (response.error) return window.alert(response.message || "Error fetching report data");
            setReportData(response.data);
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getReportData();
    }, []);

    const columns: GridColDef[] = [
        { field: 'in_inventoryId', headerName: 'Inventory ID', flex: 1, minWidth: 150 },
        { field: 'AuthorName', headerName: 'Author', flex: 1, minWidth: 150 },
        { field: "BookTitle", headerName: "Title", flex: 1, minWidth: 200, maxWidth: 200 },
        { field: "Library", headerName: "Library", flex: 1, minWidth: 200, maxWidth: 200 }
    ];

    const config = {
        title: "Available Books with Author Report",
        table: {
            rowId: 'in_inventoryId'
        }
    }

    return <ReportTable reportData={reportData} config={config} columns={columns} loading={loading} />;
}