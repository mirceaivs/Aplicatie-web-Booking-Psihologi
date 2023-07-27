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
import { Cabinete } from '../../models/models';



export const Cabinet = () => {
    type formDataType = {
        [key: string]: any;
    }
    const { setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        const getCabinet = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/cabinet/' + id, {
                    withCredentials: true
                });
                const cabinet: Cabinete = response.data;
                setformDataBuffer(cabinet);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getCabinet();
    }, []);






    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        denumire_Cabinet: '',
        judet: '',
        localitate: '',
        adresa: ''
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
    }




    const Regex = /^.{4,}$/; //sa fie de 4 caractere

    const handleSubmit = async (event: any) => {

        event.preventDefault();
        setErrorMessage('');
        if (formDataBuffer.denumire_Cabinet && !Regex.test(formDataBuffer.denumire_Cabinet)) {
            setErrorMessage('Denumirea Cabinetului trebuie să conțină cel puțin 4 caractere');
            return;
        }

        if (formDataBuffer.judet && !Regex.test(formDataBuffer.judet)) {
            setErrorMessage('Judetul trebuie să conțină cel puțin 4 caractere');
            return;
        }

        if (formDataBuffer.localitate && !Regex.test(formDataBuffer.localitate)) {
            setErrorMessage('Localitatea trebuie să conțină cel puțin 4 caractere');
            return;
        }

        if (formDataBuffer.adresa && !Regex.test(formDataBuffer.adresa)) {
            setErrorMessage('Adresa trebuie să conțină cel puțin 4 caractere');
            return;
        }

        const requiredFields = ['denumire_Cabinet', 'judet', 'localitate', 'adresa'];
        const hasEmptyFields = requiredFields.some(field => !formDataBuffer[field]);

        if (hasEmptyFields) {
            setErrorMessage('Toate câmpurile sunt obligatorii.');
            return;
        }

        const formular = new FormData();

        for (const key in formDataBuffer) {
            formular.append(key, formDataBuffer[key]);
        }


        try {
            await axios.post('http://localhost:3000/api/user/cabinete/update/' + id, formular, {
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
                    <h2 className="text-primary">Cabinet: {formDataBuffer.denumire_Cabinet.charAt(0).toUpperCase() + formDataBuffer.denumire_Cabinet.slice(1)}</h2>
                </div>
                <Col className="text-center">
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </Col>


                <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">

                    <Form.Group className="mb-3">
                        <Form.Label>Denumire Cabinet</Form.Label>
                        <Form.Control type="text" placeholder="Denumire Cabinet" name="denumire_Cabinet"
                            value={formDataBuffer.denumire_Cabinet}
                            onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control type="text" placeholder="Adresa" name="adresa"
                            value={formDataBuffer.adresa}
                            onChange={handleChange} />
                    </Form.Group>
                    <Row className="mb-3">
                        <>
                            <Form.Group as={Col}>
                                <Form.Label>Judet</Form.Label>
                                <Form.Control type="text" name="judet" placeholder="Judet"
                                    value={formDataBuffer.judet}
                                    onChange={handleChange} />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Localitate</Form.Label>
                                <Form.Control type="text" placeholder="Localitate" name="localitate"
                                    value={formDataBuffer.localitate}
                                    onChange={handleChange} />
                            </Form.Group>
                        </>
                    </Row>
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



