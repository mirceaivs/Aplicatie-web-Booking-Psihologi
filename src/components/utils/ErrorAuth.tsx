import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
export const ErrorAuth = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    if (isLoggedIn) {
        navigate('./');
    }
    return (
        <div className="text-center">
            <h2 className="mb-4">Neautorizat</h2>
            <p>Accesul la această pagină este permis doar utilizatorilor autentificați.</p>
            <Link to="/login">
                <Button variant="primary">Autentificare</Button>
            </Link>
        </div>
    );
};
