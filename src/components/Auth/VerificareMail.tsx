import { Container, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

export function VerificareMail() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    if (isLoggedIn) {
        navigate('/cont');
    }
    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} className="text-center">
                    <h1>Email de verificare trimis!</h1>
                    <p>
                        Un email a fost trimis catre adresa ta.
                        Apasa pe link-ul primit pentru a continua.
                        Te rugam sa verifici si in folderul spam.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}