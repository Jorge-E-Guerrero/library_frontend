"use client";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import { requestToApi } from '../../helpers/middleware';

const columns: GridColDef[] = [
  { field: 'us_userId', headerName: 'ID', width: 70 },
  { field: 'us_username', headerName: 'Name', width: 200 },
]

export default function Page() {

  const router = useRouter();

  const [data, setData] = useState([]);

  useEffect(() => {
    const handleRequest = async () => {
      const request = await requestToApi({ method: "get", path: "/user" });
      const requestData = request.data ?? [];
      setData(requestData);
    }
    handleRequest();

  }, []);

  const rowSelectionEvent: GridEventListener<'rowClick'> = (params) => {
    console.log(`User "${params.row.us_username}" clicked`);
    // Navigate to the user details page
    router.push(`/user/${params.row.us_userId}`);
  };

  return (
    <div className="table-container">
      <DataGrid
        rows={data}
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
  )
}