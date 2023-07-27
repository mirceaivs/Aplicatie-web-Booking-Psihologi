import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { AuthContext } from '../utils/AuthContext';
import { Container } from 'react-bootstrap';

export const SchimbareParola = () => {

    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    if (isLoggedIn) {
        navigate('/cont');
    }

    type formDataType = {
        [key: string]: any;
    }
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        user_password: '',
        confirm_password: ''
    })

    const passwordRegex = /^.{8,}$/;


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCancel = () => {
        navigate('/');
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        setErrorMessage('');
        setformDataBuffer((prevformDataBuffer) => ({
            ...prevformDataBuffer,
            [name]: value,
        }));
    }


    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrorMessage('');
        if (!passwordRegex.test(formDataBuffer.user_password)) {
            setErrorMessage('Parola trebuie să conțină cel puțin 8 caractere');
            return;
        }

        if (formDataBuffer['user_password'] !== formDataBuffer['confirm_password']) {
            setErrorMessage('Parolele trebuie sa coincida');
            return;
        }
        const formular = new FormData();
        formular.append("user_password", formDataBuffer['user_password']);

        for (let [key, value] of formular.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const raspuns = await axios.post('http://localhost:3000/api/user/updateparola', formular, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            console.log(raspuns.status);
            if (raspuns.status == 200) {
                navigate('/login');
            }


        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                setErrorMessage(errorMessage);
            } else {
                console.log(error);
            }
        }
    }



    return (
        <>
            <Container className="d-flex justify-content-center">

                <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">
                    <Col className="text-center">
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Parola</Form.Label>
                        <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Parola" name="user_password" value={formDataBuffer.user_password} autoComplete="new-password" onChange={handleChange} />
                        <Button variant="outline-secondary" onClick={handleTogglePassword}>
                            {showPassword ? 'Ascunde' : 'Arată'}
                        </Button>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirmă Parola</Form.Label>
                        <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Confirmă Parola" name="confirm_password" value={formDataBuffer.confirm_password} autoComplete="new-password" onChange={handleChange} />
                    </Form.Group>

                    <Row className="mb-3 mt-3">
                        <Form.Group as={Col} >
                            <>
                                <Form.Group className="d-flex justify-content-between">
                                    <Button variant="primary" type="submit">
                                        Modifica
                                    </Button>
                                    <Button variant="primary" onClick={handleCancel}>
                                        Renunta
                                    </Button>
                                </Form.Group>


                            </>
                        </Form.Group>
                    </Row>
                </Form>
            </Container>
        </>
    );
}

