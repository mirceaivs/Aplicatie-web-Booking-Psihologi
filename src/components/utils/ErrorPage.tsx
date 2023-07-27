
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export const ErrorPage = () => {
    return (
        <Container className="text-center mt-5">
            <Row>
                <Col>
                    <h1>A aparut o eroare</h1>
                    <Link to="/" className="btn btn-primary">Acasa</Link>
                </Col>
            </Row>
        </Container>
    );
};

export default ErrorPage;