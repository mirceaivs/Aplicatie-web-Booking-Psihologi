import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';

export const EmailVerificare = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    type formDataType = {
        [key: string]: any;
    }

    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        email: ''
    })

    if (isLoggedIn) {
        navigate('/cont')
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        setErrorMessage('');
        setformDataBuffer((prevformDataBuffer) => ({
            ...prevformDataBuffer,
            [name]: value,
        }));
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleCancel = () => {
        navigate('/');
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!emailRegex.test(formDataBuffer.email)) {
            setErrorMessage('Email invalid.');
            return;
        }

        const formData = new FormData();
        formData.append('email', event.target.email.value);
        await axios.post('http://localhost:3000/api/user/recuperareparola', formData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then(() => {
                navigate('/verificare');
            })
            .catch(error => {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            });

    }
    return (
        <>
            <Container className='d-flex justify-content-center'>

                <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} >
                    <Col className="text-center">
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </Col>
                    <Col >
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Email" name="email" value={formDataBuffer.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Trimite
                            </Button>
                            <Button variant="primary" onClick={handleCancel}>
                                Renunta
                            </Button>
                        </Form.Group>
                    </Col>
                </Form>
            </Container >

        </>
    );
};


  // <Form method='post' onSubmit={handleSubmit}>
  //   <p>
  //     <label htmlFor="email">Email</label>
  //     <input type="text" id="email" name='email' required />
  //   </p>
  //   <p>
  //     <label htmlFor="password">Parola</label>
  //     <input type="password" id="password" name='password' required />
  //   </p>
  //   <p >
  //     <Link to='/' type='button'>Cancel</Link>
  //     <button >Submit</button>
  //   </p>
  // </Form>