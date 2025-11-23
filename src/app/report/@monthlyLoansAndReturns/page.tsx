"use client";

import { useState, useEffect } from 'react';

import { GridColDef } from '@mui/x-data-grid';
import { ReportTable } from '@/src/components/report/table';
import { requestToApi } from '@/src/helpers/middleware';

const report = "monthly_loans_and_returns";

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
        { field: 'Month', headerName: 'Month',flex: 1, minWidth: 150 },
        { field: 'TotalLoans', headerName: 'Total Loans', flex: 1, minWidth: 150 },
        { field: "TotalReturns", headerName: "Total Returns", minWidth: 200, maxWidth: 200 },
    ];

    const config = {
        title: "Monthly Loans and Returns Report",
        table: {
            rowId: 'Month'
        }
    }

    return <ReportTable reportData={reportData} config={config} columns={columns} loading={loading} />;
}