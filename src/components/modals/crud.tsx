import { useState } from 'react';
import { useRouter } from 'next/navigation'

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { AlertProps, IconProps } from "@mui/material"

import Alert from '@mui/material/Alert';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { requestToApi } from '../../helpers/middleware';

const icons: { [key: string]: React.ReactNode } = {
    show: <VisibilityIcon />,
    create: <ControlPointIcon />,
    update: <EditIcon />,
    delete: <DeleteForeverIcon />,
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    maxWidth: "750px",
    height: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CrudModal({ onSuccess, id = null, data = {}, formConfig = {} }: { onSuccess: () => void, id: any, data: { [key: string]: any }, formConfig?: any }) {

    const router = useRouter();

    const { model, action, fields } = formConfig;

    const [alertData, setAlertData] = useState<{ message: string, level: AlertProps["severity"] }>({ message: "", level: "warning" });

    const [iconButton, setIconButton] = useState(icons[action]);
    const [actionText, setActionText] = useState("");
    const [showSubmitButton, setShowSubmitButton] = useState(false);

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState(<Box></Box>);

    const [formData, setFormData] = useState(data);


    const buildField = (field: string, fieldConfig: any) => {

        const { label, type, placeholder, pattern, creatable, editable, visible } = fieldConfig;

        formData[field] = formData[field] ?? data[field] ?? "";

        // Handle visibility
        const classList = ["form-field"];
        const disabled = ["create", "update"].includes(action)
            ? action === "create"
                ? !creatable
                : !editable
            : true

        let fieldElement;
        switch (type) {
            default: fieldElement =
                <TextField
                    name={field}
                    className="form-input"
                    type="text" placeholder={placeholder}
                    {...(disabled ? { disabled: true } : {})}
                    defaultValue={formData[field]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                />;
        }

        if (!visible) classList.push("hidden");

        return (
            <div key={field} className={classList.join(" ")}>
                <label htmlFor={field} className="form-label">{label}</label>
                {fieldElement}
            </div>
        );
    }

    const configureForm = () => {

        switch (action) {
            case "show": setActionText("Ver"); break;
            case "create": setActionText("Añadir"); break;
            case "update": setActionText("Guardar"); break;
            case "delete":
                setActionText("Eliminar");
                setAlertData({ level: "warning", message: "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer." });
                break;
        }

        if (["create", "update", "delete"].includes(action)) setShowSubmitButton(true);

        setForm(<Box>
            {Object.entries(fields).map(([fieldKey, fieldConfig]) => {
                return buildField(fieldKey, fieldConfig);
            })}
        </Box>)

    }

    const handleOpen = () => {
        setOpen(true)
        configureForm();
    };

    const handleClose = () => {
        setOpen(false);
        setForm(<Box></Box>);
        setFormData({});
        setShowSubmitButton(false);
    };

    const handleSubmit = async () => {
        console.log("Submitting form data: ", formData);

        let method
        switch (action) {
            case "create": method = "post"; break;
            case "update": method = "patch"; break;
            case "delete": method = "delete"; break;
            default: return console.error(`Invalid action {${action}} for submit`);
        }

        const path = ["", model, id].filter(item => ![null, undefined].includes(item)).join("/");
        const response = await requestToApi({ method, path, payload: formData });

        const success = response.status === 200;

        success
            ? window.alert(`El registro se logró ${actionText} correctamente.`)
            : window.alert(`Ocurrió un error al ${actionText} el registro.`);

        if (success) {
            handleClose();
            onSuccess && onSuccess();
        }

    }

    return (
        <div className='crud-modal'>
            <Button className="modal-button" startIcon={iconButton} onClick={handleOpen}></Button>
            <Modal
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
                    <Box sx={style}>
                        <div className="modal-container">
                            <div className="modal-header">
                                <h2>{actionText} {model}</h2>
                                <Button startIcon={<CancelIcon />} onClick={handleClose}></Button>
                            </div>
                            <div className="modal-content">
                                {["delete"].includes(action) ?
                                    <div className="modal-alert">
                                        <Alert variant="outlined" severity={alertData.level}>{alertData.message}</Alert>
                                    </div>
                                    : null
                                }
                                <div className="modal-form-container">
                                    {form}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="modal-actions">
                                    <Button variant="outlined" color="secondary" onClick={handleClose}>Cancelar</Button>
                                    {showSubmitButton ? <Button variant="contained" color="primary" onClick={handleSubmit}>{actionText}</Button> : null}
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}