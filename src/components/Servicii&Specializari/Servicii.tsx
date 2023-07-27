import { Modal } from '../../layout/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { SuccessContext } from '../utils/successContext';
import { Servici } from '../../models/models';



export const Servicii = () => {
    type formDataType = {
        [key: string]: any;
    }
    const { setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const [formDate, setFormDate] = useState<formDataType>({});

    useEffect(() => {
        const getServiciu = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/serviciu/' + id, {
                    withCredentials: true
                });
                const serviciu: Servici = response.data;
                setformDataBuffer(serviciu);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getServiciu();
    }, []);






    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        denumire: '',
        pret: '',
        durata: '',
        descriere: ''
    });




    const handleCancel = () => {
        navigate('..');
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setErrorMessage('');
        setformDataBuffer((prevformDataBuffer) => ({
            ...prevformDataBuffer,
            [name]: value,
        }));
        setFormDate((prevformDataBuffer) => ({
            ...prevformDataBuffer,
            [name]: value,
        }));
    }


    const numberRegex = /^[0-9]+$/;

    const Regex = /^.{4,}$/; //sa fie de 4 caractere

    const handleSubmit = async (event: any) => {

        event.preventDefault();
        setErrorMessage('');
        if (formDataBuffer.denumire && !Regex.test(formDataBuffer.denumire)) {
            setErrorMessage('Denumirea Serviciului trebuie să conțină cel puțin 4 caractere');
            return;
        }

        if (formDataBuffer.pret && !numberRegex.test(formDataBuffer.pret)) {
            setErrorMessage('Pretul trebuie să conțină doar cifre');
            return;
        }

        if (formDataBuffer.durata && !numberRegex.test(formDataBuffer.durata)) {
            setErrorMessage('Localitatea trebuie să conțină cel puțin 4 caractere');
            return;
        }


        if (formDate.length === 0) {
            navigate('..');
        }

        const formular = new FormData();

        for (const key in formDate) {
            formular.append(key, formDate[key]);
        }


        try {
            await axios.post('http://localhost:3000/api/user/servicii/update/' + id, formular, {
                withCredentials: true
            });
            setSuccess(true);
            navigate('..');

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
        <Modal>
            <Container >
                <div className="d-flex justify-content-center mb-4 mt-3">
                    <h2 className="text-primary">Serviciu: {formDataBuffer.denumire.charAt(0).toUpperCase() + formDataBuffer.denumire.slice(1)}</h2>
                </div>
                <Col className="text-center">
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </Col>


                <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">

                    <Form.Group className="mb-3">
                        <Form.Label>Denumire Serviciu</Form.Label>
                        <Form.Control type="text" placeholder="Denumire Serviciu" name="denumire"
                            value={formDataBuffer.denumire}
                            onChange={handleChange} />
                    </Form.Group>

                    <Row className="mb-3">
                        <>
                            <Form.Group as={Col}>
                                <Form.Label>Pret(in lei)</Form.Label>
                                <Form.Control type="text" name="pret" placeholder="Pret"
                                    value={formDataBuffer.pret}
                                    onChange={handleChange} />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Durata(in minute)</Form.Label>
                                <Form.Control type="text" placeholder="Durata" name="durata"
                                    value={formDataBuffer.durata}
                                    onChange={handleChange} />
                            </Form.Group>
                        </>
                    </Row>
                    <Form.Group className="mb-4">
                        <Form.Label>Descriere</Form.Label>
                        <Form.Control as="textarea" placeholder="Descriere" name="descriere" value={formDataBuffer.descriere} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group >
                        <Form.Group className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Salveaza
                            </Button>
                            <Button variant="primary" onClick={handleCancel}>
                                Renunta
                            </Button>
                        </Form.Group>
                    </Form.Group>

                </Form>
            </Container>
        </Modal>
    );
};



