"use client";

import "./module.css";

import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';

import {
    Box,
    List,
    TextField,
    Button,
} from '@mui/material';

import { debounce } from "lodash";

import { requestToApi } from "@/src/helpers/middleware";
import DetailHeader from '@/src/components/detail/header';
import CustomSelect from '@/src/components/fields/CustomSelect';
import { AuthContext } from "@/src/providers/auth";
import { formatDate } from "@/src/helpers/format";

export default function Page() {

    const { user, isAuth } = useContext(AuthContext);

    const router = useRouter();

    const params = useParams<{ id: string }>()

    const [member, setMember] = useState<any>({});
    const [book, setBook] = useState<any>({});
    const [inventory, setInventory] = useState<any[]>([]);
    const [selectedInventory, setSelectedInventory] = useState<any>("");

    const handleInventoryChange = () => {
        console.log("Selected inventory:", selectedInventory);
    }

    const goBack = () => router.back();

    const getMember = async (id: number) => {
        const request = await requestToApi({ method: "get", path: `/member/${id}` });
        const requestData = request.data ?? {};
        setMember(requestData);

        return requestData;
    }

    const getBook = async (id: number) => {
        const request = await requestToApi({ method: "get", path: `/book/${id}?${new URLSearchParams({ available: "true" })}` });
        const requestData = request.data ?? {};

        setInventory([...(requestData.inventory ?? [])]);

        // Remove inventory from book data to avoid redundancy
        delete requestData.inventory;
        setBook(requestData);
    }

    useEffect(() => {
        getBook(parseInt(params.id));
    }, []);

    const enterMemberId = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', 'NumpadEnter', "Escape"].includes(event.key)) {
            const memberId = parseInt((event.target as HTMLInputElement).value);
            if (isNaN(memberId)) return setMember({});
            debounce(() => getMember(memberId), 500)();
        }
    }

    const handleSuccess = () => {
        router.replace(`/book`);
    }

    const handleSubmit = () => {
        createLoan();
    }

    const createLoan = async () => {

        const payload = {
            lo_inventoryId: parseInt(selectedInventory),
            lo_employeeId: user?.employee?.em_employeeId,
            lo_membershipId: member.membership?.ms_membershipId,
            lo_debt: 0
        }

        const response = await requestToApi({ method: "post", path: `/loan`, payload: payload });
        const responseData = response.data ?? {};

        const success = response.status === 200;

        success
            ? window.alert(`El registro se logró crear el prestamo correctamente.`)
            : window.alert(`Ocurrió un error al crear el prestamo.`);

        if (success) handleSuccess();

        return responseData;
    }

    return (
        <div className="detail-container">
            <div className="detail-header">
                <DetailHeader title="Make a Loan" />
            </div>
            <div className="detail-content">
                <Box className="loan-form-container">
                    <div className="form-field">
                        <label htmlFor="memberId" className="form-label">Member ID</label>
                        <TextField
                            id="memberId"
                            name="memberId"
                            className="form-input"
                            variant="outlined"
                            onKeyUp={enterMemberId}
                            onKeyDown={enterMemberId}
                        />
                    </div>
                    {member && member.me_memberId &&
                        <div className="member-info">
                            <div className="form-field">
                                <label htmlFor="memberName" className="form-label">Member Name</label>
                                <TextField
                                    id="memberName"
                                    name="memberName"
                                    value={member.person.pe_firstName || ""}
                                    className="form-input"
                                    variant="outlined"
                                    disabled
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="memberDebt" className="form-label">Member Debt</label>
                                <TextField
                                    id="memberDebt"
                                    name="memberDebt"
                                    value={member.membership?.loans?.reduce((acc: number, loan: any) => acc + loan.currentDebt, 0) || 0}
                                    className="form-input"
                                    variant="outlined"
                                    disabled
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="memberLimit" className="form-label">Member Limit</label>
                                <TextField
                                    id="memberLimit"
                                    name="memberLimit"
                                    value={member.membership.membershipCategory.mc_borrowLimit || 0}
                                    className="form-input"
                                    variant="outlined"
                                    disabled
                                />
                            </div>
                            {member.membership.loans.length > 0 &&
                                <div className="member-loans">
                                    <h3>Active Loans</h3>
                                    <List className="active-loan-list">
                                        {member.membership.loans.map((loan: any) => (
                                            <div key={loan.lo_loanId} className="loan-item">
                                                <p><strong>Loan ID:</strong> {loan.lo_loanId}</p>
                                                <p><strong>Book:</strong> {loan.inventory.book.bo_name}</p>
                                                <p><strong>Loan Date:</strong> {formatDate({ date: loan.lo_loanDate })}</p>
                                                <p><strong>Due Date:</strong> {formatDate({ date: loan.lo_dueDate })}</p>
                                                <p><strong>Debt:</strong> {loan.currentDebt}</p>
                                            </div>
                                        ))}
                                    </List>
                                </div>
                            }
                            <CustomSelect
                                id="inventorySelect"
                                options={inventory.map(item => ({ value: item.in_inventoryId, label: [item.in_inventoryId, book.bo_name].join(" - ") }))}
                                value={selectedInventory}
                                setValue={setSelectedInventory}
                            />
                            <div className="modal-footer">
                                <div className="modal-actions">
                                    <Button variant="contained" color="secondary" onClick={goBack}>Cancel</Button>
                                    {(
                                        (member.membership?.loans?.reduce((acc: number, loan: any) => acc + loan.currentDebt, 0) <= 0) &&
                                        (member.membership.loans.length < member.membership.membershipCategory.mc_borrowLimit)
                                    ) &&
                                        <Button variant="contained" color="primary" onClick={handleSubmit}>Loan</Button>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </Box>
            </div>
            <div className="detail-footer">
            </div>
        </div>
    );
}