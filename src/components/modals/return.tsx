"use client";

import { ReactNode, useEffect, useState } from 'react';

import {
    Modal as MuiModal,
    Backdrop,
    Fade,
    Box,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
} from '@mui/material';

import {
    Cancel as CancelIcon,
} from '@mui/icons-material';

const availableStateId = 1;
const loanedStateId = 2;
const damagedStateId = 3;
const revisedStateId = 4;
const lostStateId = 5;
const destroyedStateId = 10;

import { requestToApi } from '@/src/helpers/middleware';
import { fullname } from '@/src/helpers/general';
import { formatDate, getDaysDifference } from '@/src/helpers/format';

export function ReturnModal({ config, open = false, setOpen, onSuccess }: { config: { [key: string]: any }, open: boolean, setOpen: any, onSuccess: any }) {

    const [isReturned, setIsReturned] = useState(false);

    const [modalData, setModalData] = useState<{ [key: string]: any }>({});

    const [modalForm, setModalForm] = useState<ReactNode | null>(null);

    const [loan, setLoan] = useState<{ [key: string]: any }>({});

    const [loanDebt, setLoanDebt] = useState(0);

    const [isLateReturn, setIsLateReturn] = useState(false);
    const [isDamaged, setIsDamaged] = useState(false);

    const [lateDays, setLateDays] = useState(0);

    const [inventoryStates, setInventoryStates] = useState<{ [key: string]: any }[]>([]);
    const [filteredInventoryStates, setFilteredInventoryStates] = useState<{ [key: string]: any }[]>([]);
    const [selectedInventoryState, setSelectedInventoryState] = useState<number | null>(null);


    const getInventoryStates = async () => {
        const request = await requestToApi({ method: "get", path: `/inventory_state` });
        const requestData = request.data ?? [];
        setInventoryStates(requestData);

        const filteredStates = requestData.filter((state: any) => [availableStateId].includes(state.is_stateId));
        setFilteredInventoryStates(filteredStates);

    }

    const getLoan = async (id: number) => {
        const request = await requestToApi({ method: "get", path: `/loan/${id}` });
        const requestData = request.data ?? {};
        setLoan(requestData);

        return requestData;
    }

    const checkLateReturn = () => {

        let { lo_duration: duration, lo_loanDate: loanDate } = loan;

        const initialDate = new Date(loanDate);
        const dueDate = new Date(initialDate);
        dueDate.setDate(initialDate.getDate() + duration);

        const currentDate = new Date();

        const totalLateDays = dueDate < currentDate ? getDaysDifference(dueDate, currentDate) : 0;

        if (totalLateDays > 0) {
            setIsLateReturn(true);
            setLateDays(totalLateDays);
        } else {
            setIsLateReturn(false);
            setLateDays(0);
        }

    }

    const configureModal = async () => {
        await getLoan(config.id);
    }

    const resetModal = () => {
        setModalData({});
        setLoan({});
        setIsLateReturn(false);
        setIsDamaged(false);
        setLoanDebt(0);
    }

    const handleClose = () => {
        setOpen(false)
        resetModal();
    };

    useEffect(() => {

        let debt = 0;

        if (isLateReturn) debt += (lateDays * (loan.inventory?.book?.bo_lateReturnFee || 0));
        if (isDamaged) debt += loan.inventory?.book?.bo_damagedFee || 0;

        setLoanDebt(debt);

    }, [isDamaged, isLateReturn]);

    useEffect(() => {
        switch (true) {
            case isDamaged:
                setFilteredInventoryStates(inventoryStates.filter((state) => [damagedStateId, revisedStateId, lostStateId, destroyedStateId].includes(state.is_stateId)));
                setSelectedInventoryState(damagedStateId);
                break;
            case isLateReturn:
                setFilteredInventoryStates(inventoryStates.filter((state) => [availableStateId].includes(state.is_stateId)));
                setSelectedInventoryState(availableStateId);
                break;
            default:
                setFilteredInventoryStates(inventoryStates.filter((state) => [availableStateId].includes(state.is_stateId)));
                setSelectedInventoryState(availableStateId);
                break;
        }
    }, [loanDebt]);

    useEffect(() => {
        if (open) configureModal()
        else handleClose()
    }, [open]);

    useEffect(() => {

        setIsReturned(loan.lo_isReturned || false);
        if (!loan.lo_isReturned) checkLateReturn();

    }, [loan.lo_loanId]);

    useEffect(() => {
        getInventoryStates();
    }, []);

    const handleSubmit = async () => {
        const payload = {
            debt: loanDebt,
            inventoryState: selectedInventoryState
        }

        const response = await requestToApi({ method: "patch", path: `/loan/return/${loan.lo_loanId}`, payload: payload });

        const responseData = response.data ?? {};

        const success = response.status === 200;

        success
            ? window.alert(`Se logró registrar la devolución correctamente.`)
            : window.alert(`Ocurrió un error al registrar la devolución.`);

        if (success) {
            setOpen(false)
            onSuccess()
        };

        return responseData;

    }

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
                    <div className="modal-content">
                        {loan.lo_loanId &&
                            <Box className="return-form-container">

                                <div className="form-field">
                                    <label htmlFor="memberName" className="form-label">Member Name</label>
                                    <TextField
                                        id="memberName"
                                        name="memberName"
                                        value={fullname(loan.membership?.member.person?.pe_firstName, loan.membership?.member.person?.pe_lastName) || ""}
                                        className="form-input"
                                        variant="outlined"
                                        disabled
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="bookTitle" className="form-label">Book Title</label>
                                    <TextField
                                        id="bookTitle"
                                        name="bookTitle"
                                        value={loan.inventory?.book?.bo_name || ""}
                                        className="form-input"
                                        variant="outlined"
                                        disabled
                                    />
                                </div>

                                {!isReturned
                                    ? <>


                                        <div className="form-field">
                                            <label htmlFor="dueDate" className="form-label">Due Date</label>
                                            <TextField
                                                id="dueDate"
                                                name="dueDate"
                                                value={formatDate({ date: loan.lo_dueDate }) || ""}
                                                className="form-input"
                                                variant="outlined"
                                                disabled
                                            />
                                        </div>
                                        {isLateReturn &&
                                            <>
                                                <div className="form-field">
                                                    <label htmlFor="bookLateReturnFee" className="form-label">Book Late Return Fee</label>
                                                    <TextField
                                                        id="bookLateReturnFee"
                                                        name="bookLateReturnFee"
                                                        value={loan.inventory?.book?.bo_lateReturnFee || ""}
                                                        className="form-input"
                                                        variant="outlined"
                                                        disabled
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label htmlFor="lateDays" className="form-label">Late Days</label>
                                                    <TextField
                                                        id="lateDays"
                                                        name="lateDays"
                                                        value={lateDays}
                                                        className="form-input"
                                                        variant="outlined"
                                                        disabled
                                                    />
                                                </div>
                                            </>
                                        }

                                        <div className="form-field">
                                            <label htmlFor="bookDamagedFee" className="form-label">Book Damaged Fee</label>
                                            <TextField
                                                id="bookDamagedFee"
                                                name="bookDamagedFee"
                                                value={loan.inventory?.book?.bo_damagedFee || ""}
                                                className="form-input"
                                                variant="outlined"
                                                disabled
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="bookLateReturnFee" className="form-label">Book Late Return Fee</label>
                                            <FormControl>
                                                <FormLabel id="demo-radio-buttons-group-label">Is damaged?</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                    value={isDamaged}
                                                    onChange={(e) => setIsDamaged(e.target.value === 'true')}
                                                >
                                                    <FormControlLabel value={false} control={<Radio />} label="No" />
                                                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="totalDebt" className="form-label">Total Debt</label>
                                            <TextField
                                                id="totalDebt"
                                                name="totalDebt"
                                                value={loanDebt}
                                                className="form-input"
                                                variant="outlined"
                                                disabled
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="selectedInventoryState" className="form-label">Select Inventory State</label>
                                            <Select
                                                id="selectedInventoryState"
                                                value={String(selectedInventoryState)}
                                                onChange={(e) => setSelectedInventoryState(Number(e.target.value))}
                                                className="form-input"
                                                variant="outlined"
                                            >
                                                {filteredInventoryStates?.map((state) => (
                                                    <MenuItem key={state.is_stateId} value={state.is_stateId}>
                                                        {state.is_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </>
                                    : <>
                                        <div className="form-field">
                                            <label htmlFor="totalDebt" className="form-label">Total Debt</label>
                                            <TextField
                                                id="totalDebt"
                                                name="totalDebt"
                                                value={loan.lo_debt || 0}
                                                className="form-input"
                                                variant="outlined"
                                                disabled
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="returnDate" className="form-label">Return Date</label>
                                            <TextField
                                                id="returnDate"
                                                name="returnDate"
                                                value={formatDate({ date: loan.lo_returnDate }) || ""}
                                                className="form-input"
                                                variant="outlined"
                                                disabled
                                            />
                                        </div>
                                    </>
                                }
                            </Box>
                        }
                    </div>
                    <div className="modal-footer">
                        <div className="modal-actions">
                            <Button variant="contained" color="secondary" onClick={handleClose}>Cancelar</Button>
                            {!isReturned ? <Button variant="contained" color="primary" onClick={handleSubmit}>{loanDebt ? "Pay Debt and Return Book" : "Return Book"}</Button> : null}
                        </div>
                    </div>
                </Box>
            </Fade>
        </MuiModal>
    );
}