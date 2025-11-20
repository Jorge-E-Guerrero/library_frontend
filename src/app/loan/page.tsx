"use client";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import CrudModal from '../../components/modals/crud';

import { requestToApi } from '../../helpers/middleware';


const model = "loan";

const formConfig = {
    fields: {
        us_id: {
            isId: true,
            label: "ID",
            type: "number",
            visible: false,
            creatable: false,
            editable: false,
            required: false,
            placeHolder: "ID",
        },
        us_username: {
            label: "Usuario",
            type: "text",
            visible: true,
            creatable: true,
            editable: true,
            required: true,
            placeholder: "Ingrese el nombre de usuario",
        },
        us_password: {
            label: "Contraseña",
            type: "password",
            visible: true,
            creatable: true,
            editable: true,
            required: true,
            placeholder: "!Ejemplo123",
        }
    }

}

export default function Page() {


    const router = useRouter();

    const [loans, setLoans] = useState([]);

    const columns: GridColDef[] = [
        { field: 'us_userId', headerName: 'ID', width: 100 },
        { field: 'us_username', headerName: 'Name', flex: 1, minWidth: 150 },
        {
            field: "actions", headerName: "Actions", minWidth: 200, maxWidth: 200, renderCell: (params) => {

                const { id, row } = params;
                const itemData = loans.find((item: { us_userId: number }) => item.us_userId === id);

                const itemConfig = { ...formConfig, router, id: params.id, data: itemData, model };

                return ((
                    <div className="actions-cell">
                        <CrudModal
                            id={id}
                            data={row}
                            formConfig={{ ...itemConfig, action: "show" }}
                            onSuccess={handleSuccess}
                        />
                        <CrudModal
                            id={params.row.us_userId}
                            data={params.row}
                            formConfig={{ ...itemConfig, action: "update" }}
                            onSuccess={handleSuccess}
                        />
                        <CrudModal
                            id={params.row.us_userId}
                            data={params.row}
                            formConfig={{ ...itemConfig, action: "delete" }}
                            onSuccess={handleSuccess}
                        />
                    </div>
                ))
            }
        }
    ]


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

    const rowSelectionEvent: GridEventListener<'rowClick'> = (params) => {
        return
        console.log(`User "${params.row.us_username}" clicked`);
        // Navigate to the user details page
        router.push(`/user/${params.row.us_userId}`);
    };

    return (
        <div className="page-container">
            <div className="page-header-container">
                <div className="title-container">
                    <h1>Loan Management</h1>
                </div>
                <div className="actions-container">
                    <CrudModal
                        id={null}
                        data={{}}
                        formConfig={{ ...formConfig, model, action: "create" }}
                        onSuccess={handleSuccess}
                    />
                </div>
            </div>
            <div className="table-container">
                <DataGrid
                    rows={loans}
                    columns={columns}
                    getRowId={(row) => row.us_userId}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    onRowClick={rowSelectionEvent}
                    pageSizeOptions={[5]}
                    //checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    )
}