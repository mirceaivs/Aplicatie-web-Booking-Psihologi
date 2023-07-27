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
import { Specializari } from '../../models/models';
import { ImageRenderer } from '../utils/BufferToURL';
import { AuthContext } from '../utils/AuthContext';


export const Specializare = () => {
    type formDataType = {
        [key: string]: any;
    }
    const { user } = useContext(AuthContext);
    const { setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedImage, setselectedImage] = useState<ArrayBuffer | null>(null);
    const [imageBuffer, setImageBuffer] = useState<File | null>(null);
    const [formDate, setFormDate] = useState<formDataType>({});

    //gettter de imagine 

    useEffect(() => {
        const getSpecializare = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/specializare/' + id, {
                    withCredentials: true
                });
                const specializare: Specializari = response.data;
                setformDataBuffer(specializare);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getSpecializare();
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/specializari/poza/' + id, {
                    withCredentials: true,
                    responseType: 'arraybuffer'
                });
                setselectedImage(response.data);

            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    console.log(errorMessage);
                } else {
                    console.log(error);
                }
            }
        }
        fetchImage();
    }, [])








    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        denumire_specializare: '',
        nr_atestat: ''
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

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        setImageBuffer(file);
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                setselectedImage(arrayBuffer);
            };

            reader.readAsArrayBuffer(file);
        } else {
            setselectedImage(null);
        }
    };



    const Regex = /^.{4,}$/; //sa fie de 4 caractere

    const handleSubmit = async (event: any) => {

        event.preventDefault();
        setErrorMessage('');
        if (formDataBuffer.denumire_specializare && !Regex.test(formDataBuffer.denumire_specializare)) {
            setErrorMessage('Denumirea Specializarii trebuie să conțină cel puțin 4 caractere');
            return;
        }


        const formular = new FormData();

        if (imageBuffer) {
            formular.append('poza', imageBuffer);
        }

        for (const key in formDate) {
            formular.append(key, formDate[key]);
        }


        try {
            await axios.post('http://localhost:3000/api/user/specializari/update/' + id, formular, {
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

    const handleConfirmare = async (event: any) => {
        event.preventDefault();
        try {
            await axios.get('http://localhost:3000/api/admin/specializari/verifica/' + id, {
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
                {user?.user_type === 'psiholog' &&
                    <Row >
                        <div className="d-flex justify-content-center mt-3">

                            <h2 className="text-primary">Specializare: {formDataBuffer.denumire_specializare.charAt(0).toUpperCase() + formDataBuffer.denumire_specializare.slice(1)}</h2>

                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                        </div>

                        <Col lg={8} className="d-flex justify-content-center">
                            <ImageRenderer imageBuffer={selectedImage} rotunjit={false} />
                        </Col>

                        <Col lg={3} className="d-flex justify-content-center align-items-center">
                            <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">

                                <Form.Group className="mb-3">
                                    <Form.Label>Denumire Specializare</Form.Label>
                                    <Form.Control type="text" placeholder="Denumire Specializare" name="denumire_specializare"
                                        value={formDataBuffer.denumire_specializare}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nr Atestat</Form.Label>
                                    <Form.Control type="text" placeholder="Nr Atestat" name="nr_atestat"
                                        value={formDataBuffer.nr_atestat}
                                        onChange={handleChange} />
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
                                <Form.Group className="mt-3">
                                    <Form.Label>Poza Diploma</Form.Label>
                                    <Form.Control name="poza" type="file" accept="image/jpg" onChange={handleImageChange} />
                                </Form.Group>

                            </Form>
                        </Col>
                    </Row>
                }
                {user?.user_type === 'admin' &&
                    <Row >
                        <div className="d-flex justify-content-center mt-3">

                            <h2 className="text-primary">Specializare: {formDataBuffer.denumire_specializare.charAt(0).toUpperCase() + formDataBuffer.denumire_specializare.slice(1)}</h2>

                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                        </div>

                        <Col lg={8} className="d-flex justify-content-center">
                            <ImageRenderer imageBuffer={selectedImage} rotunjit={false} />
                        </Col>

                        <Col lg={3} className="d-flex justify-content-center align-items-center">
                            <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">

                                <Form.Group className="mb-3">
                                    <Form.Label>Denumire Specializare</Form.Label>
                                    <Form.Control type="text" placeholder="Denumire Specializare" name="denumire_specializare" disabled={true}
                                        value={formDataBuffer.denumire_specializare}
                                        onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nr Atestat</Form.Label>
                                    <Form.Control type="text" placeholder="Nr Atestat" name="nr_atestat" disabled={true}
                                        value={formDataBuffer.nr_atestat}
                                        onChange={handleChange} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Group className="d-flex justify-content-between">
                                        <Button variant="primary" type="submit" className='mr-4' onClick={handleConfirmare}>
                                            Confirma Specializare
                                        </Button>
                                        <Button variant="primary" onClick={handleCancel}>
                                            Renunta
                                        </Button>
                                    </Form.Group>
                                </Form.Group>


                            </Form>
                        </Col>
                    </Row>
                }
            </Container>
        </Modal>
    );
};



