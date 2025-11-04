import Button from "@mui/material/Button";
import DehazeIcon from '@mui/icons-material/Dehaze';

export default function Header() {
    return (
        <header>
            <div className="header-container">
                <div className="menu-container">
                    <Button variant="contained" color="primary" startIcon={<DehazeIcon />}></Button>
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