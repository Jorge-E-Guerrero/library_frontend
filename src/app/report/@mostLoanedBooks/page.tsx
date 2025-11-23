"use client";

import { useState, useEffect } from 'react';

import { GridColDef } from '@mui/x-data-grid';
import { ReportTable } from '@/src/components/report/table';
import { requestToApi } from '@/src/helpers/middleware';

const report = "most_loaned_books";

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
        { field: 'BookName', headerName: 'Book Name',flex: 1, minWidth: 150 },
        { field: 'LoanCount', headerName: 'Loan Count', flex: 1, minWidth: 150 },
    ];

    const config = {
        title: "Most Loaned Books Report",
        table: {
            rowId: 'BookName'
        }
    }

    return <ReportTable reportData={reportData} config={config} columns={columns} loading={loading} />;
}