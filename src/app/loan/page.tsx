"use client";

import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';

import {
    Button,
} from '@mui/material';

import {
    KeyboardReturn as KeyboardReturnIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

import { ReturnModal } from '../../components/modals/return';
import { Table } from '@/src/components/table';
import { requestToApi } from '../../helpers/middleware';
import { formatDate } from '@/src/helpers/format';


const model = "loan";

export default function Page() {

    const [loans, setLoans] = useState([]);

    const [openReturnModal, setOpenReturnModal] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ [key: string]: any }>({ title: "Return Loan" });

    const handleOpenReturnModal = (row: { [key: string]: any }) => {
        setModalConfig((prev: { [key: string]: any }) => ({ ...prev, id: row.lo_loanId }));
        return setOpenReturnModal(true);
    }

    const columns: GridColDef[] = [
        { field: 'lo_loanId', headerName: 'ID', flex: 1, width: 70 },
        // { field: 'lo_membershipId', headerName: 'Membership ID', flex: 1, width: 150 },
        // { field: 'lo_employeeId', headerName: 'Employee ID', flex: 1, width: 150 },
        { field: 'lo_inventoryId', headerName: 'Inventory ID', flex: 1, width: 150 },
        { field: 'lo_duration', headerName: 'Duration (days)', flex: 1, width: 150 },
        { field: 'lo_debt', headerName: 'Debt', flex: 1, width: 100 },
        { field: 'lo_loanDate', headerName: 'Loan Date', flex: 1, width: 180, renderCell: (params) => (formatDate({ date: params.value })) },
        { field: 'lo_dueDate', headerName: 'Due Date', flex: 1, width: 180, renderCell: (params) => (formatDate({ date: params.value })) },
        { field: 'lo_returnDate', headerName: 'Return Date', flex: 1, width: 180, renderCell: (params) => (formatDate({ date: params.value })) },
        { field: 'lo_isReturned', headerName: 'Is Returned', flex: 1, width: 130, type: 'boolean' },
        { field: 'lo_isLateReturn', headerName: 'Is Late Return', flex: 1, width: 150, type: 'boolean' },
        {
            field: "actions", headerName: "Actions", flex: 1, width: 150, type: "actions",
            renderCell: (params) => {
                return (
                    <div className='table-row-actions' >
                        <Button className='icon-button' variant="contained" color="primary" startIcon={params.row.lo_isLateReturn ? <VisibilityIcon /> : <KeyboardReturnIcon />} onClick={() => handleOpenReturnModal(params.row)} />
                    </div>
                )
            }
        }
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
            rowId: 'lo_loanId',
            initialState: {
                sorting: { sortModel: [{ field: 'lo_loanId', sort: 'desc' }] },
                pagination: { paginationModel: { pageSize: 20, page: 0 } }
            }
        }
    }

    return (
        <div className="page-container">
            <Table
                data={loans}
                config={config}
                columns={columns}
            />
            <ReturnModal config={modalConfig} open={openReturnModal} setOpen={setOpenReturnModal} onSuccess={handleSuccess}></ReturnModal>
        </div>
    )
}