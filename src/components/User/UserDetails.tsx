
// import 'bootstrap/dist/css/bootstrap.css';
import './User.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { User } from '../../models/models';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';




export const UserDetails: React.FC<{ user: User, setIsActualizat: any, setUser: any, setIsLoggedIn: any, setImageBuffer: any }> = ({ user, setIsActualizat, setUser, setIsLoggedIn, setImageBuffer }) => {
    type formDataType = {
        [key: string]: any;
    }
    const [edit, setEdit] = useState(false);
    const [selectedImage, setselectedImage] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);




    const [formData, setFormData] = useState<formDataType>({
        nume: user.nume,
        prenume: user.prenume,
        user_name: user.user_name,
        email: user.email,
        nr_telefon: user.nr_telefon,
        user_type: user.user_type,
    });


    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        nume: '',
        prenume: '',
        user_name: '',
        email: '',
        nr_telefon: '',
        user_type: '',
        user_password: ''
    });


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleEditClick = (event: any) => {
        event.preventDefault();
        setEdit(!edit);

    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setErrorMessage('');
        if (edit) {
            setformDataBuffer((prevformDataBuffer) => ({
                ...prevformDataBuffer,
                [name]: value,
            }));
        }

    }

    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        setselectedImage(file);
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                setImageBuffer(arrayBuffer);
            };

            reader.readAsArrayBuffer(file);
        } else {
            setImageBuffer(null);
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        setErrorMessage('');
        if (formDataBuffer.email && !emailRegex.test(formDataBuffer.email)) {
            setErrorMessage('Email invalid.');
            return;
        }
        if (formDataBuffer.user_password && !passwordRegex.test(formDataBuffer.user_password)) {
            setErrorMessage('Parola trebuie să conțină cel puțin 8 caractere');
            return;
        }
        if (formDataBuffer.nr_telefon && !phoneRegex.test(formDataBuffer.nr_telefon)) {
            setErrorMessage('Număr de telefon invalid.');
            return;
        }
        setEdit(!edit);

        const formular = new FormData();
        if (selectedImage) {
            formular.append('poza', selectedImage);
        }
        for (const key in formDataBuffer) {
            formular.append(key, formDataBuffer[key]);
        }

        try {
            const response = await axios.post('http://localhost:3000/api/user/update', formular, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            const responseData = response.data;
            setIsActualizat(true);
            setUser(response.data);
            setFormData(responseData);


        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                setErrorMessage(errorMessage);
            } else {
                console.log(error);
            }
        }
    }
    const handleStergereClick = async (event: any) => {
        event.preventDefault();
        try {
            await axios.delete('http://localhost:3000/api/admin/user/delete/' + user.user_id, {
                withCredentials: true
            });
            navigate('/');
            setUser(null);
            setIsLoggedIn(false);

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
        <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} >
            <Col className="text-center">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>
            <Row className="mb-3">
                <>
                    <Form.Group as={Col}>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control type="text" name="nume" placeholder="Nume" disabled={!edit} value={edit ? formDataBuffer.nume : formData.nume} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Prenume</Form.Label>
                        <Form.Control type="text" placeholder="Prenume" name="prenume" disabled={!edit} value={edit ? formDataBuffer.prenume : formData.prenume} onChange={handleChange} />
                    </Form.Group>
                </>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Nume Utilizator</Form.Label>
                <Form.Control type="text" placeholder="Nume Utilizator" name="user_name" disabled={!edit} value={edit ? formDataBuffer.user_name : formData.user_name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" placeholder="Email" name="email" disabled={!edit} value={edit ? formDataBuffer.email : formData.email} onChange={handleChange} />
            </Form.Group>
            {edit && (
                <Form.Group className="mb-3">
                    <Form.Label>Parola</Form.Label>
                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Parola" name="user_password" autoComplete="new-password" disabled={!edit} value={formDataBuffer.user_password} onChange={handleChange} />
                    <Button variant="outline-secondary" onClick={handleTogglePassword}>
                        {showPassword ? 'Ascunde' : 'Arată'}
                    </Button>
                </Form.Group>
            )}

            <Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Nr telefon</Form.Label>
                    <Form.Control type="text" placeholder="Nr Telefon" name="nr_telefon" disabled={!edit} value={edit ? formDataBuffer.nr_telefon : formData.nr_telefon} onChange={handleChange} />
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Label>Tip Utilizator</Form.Label>
                    <Form.Control type="text" placeholder="Tip Utilizator" disabled={true} value={user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1).toLowerCase()} />
                </Form.Group>
            </Row>

            <Row className="mb-3 mt-3">
                <Form.Group as={Col} >
                    {!edit ?
                        (
                            <Form.Group className="d-flex justify-content-between">
                                <Button variant="primary" onClick={handleEditClick}>
                                    Editeaza
                                </Button>
                                <Modal show={showModal} onHide={() => setShowModal(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirmare ștergere</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Ești sigur că vrei să-ți ștergi contul?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                                            Nu
                                        </Button>
                                        <Button variant="primary" onClick={handleStergereClick}>
                                            Da
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Button variant="primary" onClick={handleShowModal}>Stergere cont</Button>
                            </Form.Group>

                        ) : (
                            <>
                                <Form.Group className="d-flex justify-content-between">
                                    <Button variant="primary" type="submit">
                                        Salveaza
                                    </Button>
                                    <Button variant="primary" onClick={handleEditClick}>
                                        Renunta
                                    </Button>
                                </Form.Group>

                                <Form.Group >
                                    <Form.Label>Alege o imagine</Form.Label>
                                    <Form.Control name="poza" type="file" accept="image/jpg" onChange={handleImageChange} />
                                </Form.Group>
                            </>


                        )}
                </Form.Group>
            </Row>
        </Form>
    );
};

