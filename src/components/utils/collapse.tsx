import { useState } from 'react';

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material';

import {
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

export default function Component({ children, name, icon }: { children: React.ReactNode, name: string, icon: React.ReactNode }) {

    const [open, setOpen] = useState(false);
    const [arrowIcon, setArrowIcon] = useState(<KeyboardArrowDownIcon className="arrow-icon" />);

    const toggleDropdown = () => {
        setOpen(!open);
        setArrowIcon(open ? <KeyboardArrowDownIcon className="arrow-icon" /> : <KeyboardArrowUpIcon className="arrow-icon" />);
    }

    return (
        <div key={name} className="dropdown-container">
            <List className="dropdown-container">
                <div className="collapse-header">
                    <ListItem disablePadding key={name}>
                        <ListItemButton onClick={toggleDropdown}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={name} />
                            {arrowIcon}
                        </ListItemButton>
                    </ListItem>
                </div>
                <div className="collapse-container">
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {children}
                    </Collapse>
                </div>

            </List>

        </div>
    )

}