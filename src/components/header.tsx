"use client";

import { useState } from "react";

import {
    Drawer,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";

import {
    Home as HomeIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    ManageAccounts as ManageAccountsIcon,
    AutoStories as AutoStoriesIcon
} from "@mui/icons-material";

import Button from "@mui/material/Button";

import DehazeIcon from '@mui/icons-material/Dehaze';

export default function Header() {

    const [state, setState] = useState(false);

    const sidebarToggle = (state: boolean) => {
        setState(state);
    }

    const menuList = [
        { name: "Home", link: "/home", icon: <HomeIcon /> },
        { name: "Books", link: "/book", icon: <AutoStoriesIcon /> },
        {
            name: "Management", icon: <ManageAccountsIcon />, items: [
                { name: "Users", link: "/user", icon: <PeopleIcon /> },
                { name: "Roles", link: "/role", icon: <SecurityIcon /> },
            ]
        },
    ];

    const buildMenuItems = (items: any[]) => {
        return items.map(({ name, link, icon, items: subItems = [] }) => {

            const [open, setOpen] = useState(false);
            const [arrowIcon, setArrowIcon] = useState(<KeyboardArrowDownIcon className="arrow-icon" />);

            const toggleDropdown = () => {
                setOpen(!open);
                setArrowIcon(open ? <KeyboardArrowDownIcon className="arrow-icon" /> : <KeyboardArrowUpIcon className="arrow-icon" />);
            }

            const buildListItem = ({ name, link, icon }: { name: string, link?: string, icon?: React.ReactNode }) => {
                return (
                    <ListItem disablePadding key={name}>
                        <ListItemButton component="a" href={link}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItemButton>
                    </ListItem>
                );
            }

            const listItem = subItems.length > 0 ? (
                <div key={name} className="menu-dropdown-item">
                    <ListItem disablePadding key={name}>
                        <ListItemButton onClick={toggleDropdown}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={name} />
                            {arrowIcon}
                        </ListItemButton>
                    </ListItem>
                    <div className="sub-item-container">
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {subItems.map((subItem: any) => buildListItem(subItem))}
                            </List>
                        </Collapse>
                    </div>
                </div>
            ) : buildListItem({ name, link, icon });

            return listItem;
        });
    }

    const sidebarContent = () => {
        return (
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h2>Menú</h2>
                </div>
                <div className="sidebar-content">
                    <List>
                        {menuList.map((item) => buildMenuItems([item]))}
                    </List>
                </div>
            </div>
        );
    }

    return (
        <header>
            <Drawer anchor="left" open={state} onClose={() => sidebarToggle(false)}>
                {sidebarContent()}
            </Drawer>
            <div className="header-container">
                <div className="menu-container">
                    <Button variant="contained" color="primary" startIcon={<DehazeIcon />} onClick={() => sidebarToggle(true)}></Button>
                </div>
                <div className="logo-container">
                    <h1>Library</h1>
                </div>
                <div className="actions-container">
                    <button>Log In</button>
                </div>
            </div>
        </header>
    )
}