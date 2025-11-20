import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
    Modal as MuiModal,
    Backdrop,
    Fade,
    Box,
    Button,

} from '@mui/material';

import {
    Cancel as CancelIcon,
} from '@mui/icons-material';

const style = {
    boxShadow: 24,
    p: 4,
}

export function Modal({ children, config, data, reddirect }: { children: React.ReactNode, config: { [key: string]: any }, data: { [key: string]: any }, reddirect?: boolean }) {

    const router = useRouter();

    const [open, setOpen] = useState(true);
    const handleClose = () => router.back();

    useEffect(() => {
        if (reddirect === true) setOpen(false)
    },[reddirect]);

    return (
        <MuiModal
            className='modal-body'
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box className="modal-container">
                    <div className="modal-header">
                        <h2>{config.title}</h2>
                        <Button startIcon={<CancelIcon />} onClick={handleClose}></Button>
                    </div>
                    {children}
                </Box>
            </Fade>
        </MuiModal>
    );
}