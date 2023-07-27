import { Modal } from '../../layout/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { SuccessContext } from '../utils/successContext';



export const AdaugaSpecializare = () => {
    type formDataType = {
        [key: string]: any;
    }
    const { setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [selectedImage, setselectedImage] = useState<File | null>(null);




    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({});

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


    const handleImageChange = (event: any) => {
        const file = event.target.files && event.target.files[0];
        setErrorMessage('');
        if (!file.name.endsWith('.jpg')) {
            setErrorMessage('Selectați un fișier .jpg.');
            return;
        }
        setselectedImage(file);
    }




    const Regex = /^.{4,}$/; //sa fie de 4 caractere


    const handleSubmit = async (event: any) => {

        event.preventDefault();
        setErrorMessage('');
        if (formDataBuffer.denumire_specializare && !Regex.test(formDataBuffer.denumire_specializare)) {
            setErrorMessage('Denumirea Specializarii trebuie să conțină cel puțin 4 caractere');
            return;
        }

        if (!selectedImage) {
            setErrorMessage('Poza diplomei trebuie sa fie incarcata');
            return;
        }
        const requiredFields = ['denumire_specializare', 'nr_atestat'];
        const hasEmptyFields = requiredFields.some(field => !formDataBuffer[field]);

        if (hasEmptyFields) {
            setErrorMessage('Toate câmpurile sunt obligatorii.');
            return;
        }
        const formular = new FormData();
        formular.append('poza', selectedImage);

        for (const key in formDataBuffer) {
            formular.append(key, formDataBuffer[key]);
        }

        try {
            await axios.post('http://localhost:3000/api/user/specializari/adauga', formular, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
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
                <div className="d-flex justify-content-center mb-5 mt-3">
                    <h2 className="text-primary">Adauga Specializare</h2>
                </div>
                <Col className="text-center">
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </Col>


                <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">

                    <Form.Group className="mb-3">
                        <Form.Label>Denumire Specializare</Form.Label>
                        <Form.Control type="text" placeholder="Denumire Specializare" name="denumire_specializare" value={formDataBuffer.denumire_specializare ? formDataBuffer.denumire_specializare : ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nr Atestat</Form.Label>
                        <Form.Control type="text" placeholder="Nr Atestat" name="nr_atestat" value={formDataBuffer.nr_atestat ? formDataBuffer.nr_atestat : ''} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Poza Diploma</Form.Label>
                        <Form.Control name="poza" type="file" accept="image/jpg" onChange={handleImageChange} />
                    </Form.Group>
                    <Row >
                        <Form.Group className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Adauga
                            </Button>
                            <Button variant="primary" onClick={handleCancel}>
                                Renunta
                            </Button>
                        </Form.Group>
                    </Row>

                </Form>
            </Container>
        </Modal >
    );
};
