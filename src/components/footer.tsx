import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Footer() {

    const getCurrentYear = () => new Date().getFullYear();

    return (
        <footer>
            <div className="footer-container">
                <p>© {getCurrentYear()} Galileo Library. All rights reserved.</p>
            </div>
        </footer>
    )
}