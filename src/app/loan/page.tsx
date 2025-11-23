"use client";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import CrudModal from '../../components/modals/crud';

import { Table } from '@/src/components/table';
import { requestToApi } from '../../helpers/middleware';


const model = "loan";

const formConfig = {
    fields: {
        lo_loanId: {
            isId: true,
            label: "ID",
            type: "number",
            visible: false,
            creatable: false,
            editable: false,
            required: false,
            placeHolder: "ID",
        },
    }

}

export default function Page() {


    const router = useRouter();

    const [loans, setLoans] = useState([]);

    const columns: GridColDef[] = [
        { field: 'lo_loanId', headerName: 'ID', flex: 1, width: 70 },
        // { field: 'lo_membershipId', headerName: 'Membership ID', flex: 1, width: 150 },
        // { field: 'lo_employeeId', headerName: 'Employee ID', flex: 1, width: 150 },
        { field: 'lo_inventoryId', headerName: 'Inventory ID', flex: 1, width: 150 },
        { field: 'lo_duration', headerName: 'Duration (days)', flex: 1, width: 150 },
        { field: 'lo_debt', headerName: 'Debt', flex: 1, width: 100 },
        { field: 'lo_loanDate', headerName: 'Loan Date', flex: 1, width: 180 },
        { field: 'lo_dueDate', headerName: 'Due Date', flex: 1, width: 180 },
        { field: 'lo_returnDate', headerName: 'Return Date', flex: 1, width: 180 },
        { field: 'lo_isReturned', headerName: 'Is Returned', flex: 1, width: 130, type: 'boolean' },
        { field: 'lo_isLateReturn', headerName: 'Is Late Return', flex: 1, width: 150, type: 'boolean' },
    ];

    const refreshData = async () => {
        const request = await requestToApi({ method: "get", path: `/${model}` });
        const requestData = request.data ?? [];
        setLoans(requestData);
    }

    const handleSuccess = () => {
        refreshData();
    }

    useEffect(() => {
        refreshData();
    }, []);

    const config = {
        title: "Loans Management",
        table: {
            rowId: 'lo_loanId'
        }
    }

    return (
        <div className="page-container">
            <Table
                data={loans}
                config={config}
                columns={columns}
            />
        </div>
    )
}