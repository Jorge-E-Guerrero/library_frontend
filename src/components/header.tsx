"use client";

import { useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";

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
    Assessment as AssessmentIcon,
    MenuBook as MenuBookIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    ManageAccounts as ManageAccountsIcon,
    LocationCity as LocationCityIcon,
    AutoStories as AutoStoriesIcon,
    Inventory as InventoryIcon,
    LocalGroceryStore as LocalGroceryStoreIcon
} from "@mui/icons-material";

import Button from "@mui/material/Button";

import { setStorage } from "../helpers/middleware";
import DehazeIcon from '@mui/icons-material/Dehaze';
import { AuthContext } from "../providers/auth";

export default function Header({ auth }: { auth?: boolean }) {

    const router = useRouter();

    const [state, setState] = useState(false);

    const sidebarToggle = (state: boolean) => {
        setState(state);
    }


    const { user, setUser, isAuth, setIsAuth } = useContext(AuthContext);

    /*
    console.log("User in Layout:", user);


    useEffect(() => {
        console.log("Initial User in Layout:", user);
        setUser({ id: "1", name: "John Doe" }); // Example of setting user data
    }, []);
    */

    useEffect(() => {
        console.log("Updated User in Layout:", user);
    }, [user?.id]);


    const goToLogin = () => {
        router.push("/auth/login");
    }

    const logOut = () => {
        setUser({});
        setIsAuth(false);

        setStorage({ type: "local", key: "token", value: "" });

        router.push("/");
    }


    const menuList = [
        {
            name: "Library", icon: <LocationCityIcon />, items: [
                { name: "Books", link: "/book", icon: <AutoStoriesIcon /> },
                { name: "Inventory", link: "/inventory", icon: <InventoryIcon /> },
                { name: "Loans", link: "/loan", icon: <LocalGroceryStoreIcon /> }
            ]

        },
        {
            name: "Management", icon: <ManageAccountsIcon />, items: [
                { name: "Users", link: "/user", icon: <PeopleIcon /> },
                { name: "Roles", link: "/role", icon: <SecurityIcon /> },
                { name: "Reports", link: "/report", icon: <AssessmentIcon /> }
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
            {auth &&

                <Drawer anchor="left" open={state} onClose={() => sidebarToggle(false)}>
                    {sidebarContent()}
                </Drawer>

            }
            <div className="header-container">

                {auth &&
                    <div className="menu-container">
                        <Button variant="contained" color="primary" startIcon={<DehazeIcon />} onClick={() => sidebarToggle(true)}></Button>
                    </div>

                }
                <div className="logo-container">
                    <MenuBookIcon className="header-icon" />
                    <h1>Library</h1>
                </div>

                <div className="actions-container">
                    {auth
                        ? <Button variant="contained" color="secondary" className="auth-button" onClick={logOut}>Log Out</Button>
                        : <Button variant="contained" color="primary" className="auth-button" onClick={goToLogin}>Log In</Button>
                    }
                </div>
            </div>
        </header>
    )
}