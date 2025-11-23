"use client";

import { useState, useEffect } from 'react';

import { GridColDef } from '@mui/x-data-grid';
import { ReportTable } from '@/src/components/report/table';
import { requestToApi } from '@/src/helpers/middleware';

const report = "members_with_debt";

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
        { field: 'ms_membershipId', headerName: 'Membership ID',flex: 1, minWidth: 150 },
        { field: 'FullName', headerName: 'Full Name', flex: 1, minWidth: 150 },
        { field: "mc_categoryName", headerName: "Category", flex: 1, minWidth: 200, maxWidth: 200 },
        { field: "ms_debt", headerName: "Debt", flex: 1, minWidth: 200, maxWidth: 200 }
    ];

    const config = {
        title: "Members with Debt Report",
        table: {
            rowId: 'ms_membershipId'
        }
    }

    return <ReportTable reportData={reportData} config={config} columns={columns} loading={loading} />;
}