
// import 'bootstrap/dist/css/bootstrap.css';
import './User.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { User } from '../../models/models';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, Outlet } from 'react-router-dom';
import { ImageRenderer } from '../utils/BufferToURL';
import { Image, Card, } from 'react-bootstrap';
import { ListaSpecializariProfil } from './ListaSpecializariProfil';
import { ListaServiciiProfil } from './ListaServiciiProfil';
import { FaPlus } from 'react-icons/fa';
import { Programe } from '../../models/models';
import { SuccessContext } from '../utils/successContext';
import Alert from 'react-bootstrap/Alert';
import { ListaCabineteProfil } from './ListaCabineteProfil';

export const UserPage = () => {
    type formDataType = {
        [key: string]: any;
    }


    const { success, setSuccess } = useContext(SuccessContext);
    const [selectedImage, setselectedImage] = useState<ArrayBuffer | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [existingSchedule, setExistingSchedule] = useState<Programe[]>([]);
    const [areSpecializari, setAreSpecializari] = useState(false);
    const { id } = useParams();
    useEffect(() => {
        const getPsiholog = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/user/' + id, {
                    withCredentials: true
                });
                const user: User = response.data;
                setformDataBuffer(user);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getPsiholog();
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/poza/' + id, {
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


    useEffect(() => {
        const getProgram = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/programpsiholog/' + id, {
                    withCredentials: true
                });
                setExistingSchedule(response.data);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        }
        getProgram();
    }, []);


    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);



    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        nume: '',
        prenume: '',
        user_name: '',
        email: '',
        nr_telefon: '',
        user_type: '',
        user_password: ''
    });





    return (
        <Row>

            <div>
                <Outlet />

            </div>


            {success && <div className="text-center">
                <Alert variant={'success'}>Succes</Alert>
            </div>}


            <Col className="d-flex justify-content-center overflow-hidden" lg={4}>
                <Col >
                    <Col className="text-center">
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

                    </Col>

                    <Card >

                        <Col className="d-flex justify-content-center" >
                            {
                                selectedImage ?
                                    (<ImageRenderer imageBuffer={selectedImage} rotunjit={true} />) : (<Image src='/blank-user.jpg' roundedCircle />)
                            }
                        </Col>

                        <Card.Body className="overflow-hidden">
                            <Card.Title>{formDataBuffer.nume} {formDataBuffer.prenume}</Card.Title>
                            <Card.Text>
                                <strong>Nume Utilizator:</strong> {formDataBuffer.user_name}
                            </Card.Text>
                            <Card.Text>
                                <strong>Email:</strong> {formDataBuffer.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Nr telefon:</strong> {formDataBuffer.nr_telefon}
                            </Card.Text>
                            <Card.Body >
                                <strong>Program:</strong>
                                {existingSchedule.length === 0 && (
                                    <div className="text-center">
                                        <h2 className="mb-5 mt-5">Nu este niciun program inregistrat!</h2>

                                    </div>
                                )}

                                {existingSchedule.length !== 0 && existingSchedule
                                    .sort((a, b) => {
                                        const daysOfWeek = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
                                        return daysOfWeek.indexOf(a.ziua_saptamanii) - daysOfWeek.indexOf(b.ziua_saptamanii);
                                    })
                                    .map((program: Programe, index: number) => (
                                        <Row key={index}>
                                            <Col className='d-flex justify-content-center' >
                                                <div className='mr-5'>
                                                    <strong>{program.ziua_saptamanii}</strong>:<i>{program.ora_inceput.slice(0, -3)} : {program.ora_sfarsit.slice(0, -3)}</i>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))
                                }
                            </Card.Body>


                        </Card.Body>
                    </Card>
                </Col>
            </Col>

            <Col lg={8} >
                <h4 className="text-center">Cabinete</h4>
                <ListaCabineteProfil />
                <h4 className="text-center">Specializari</h4>
                <ListaSpecializariProfil setAreSpecializari={setAreSpecializari} />
                <h4 className="text-center">Servicii</h4>
                <ListaServiciiProfil />
                {areSpecializari && (
                    <Col className='d-flex justify-content-end mt-3'>
                        <Link to={`/user/${id}/programeazate`} className="mb-2 btn-lg">
                            <Button variant="primary" > <FaPlus /> Programeaza-te </Button>
                        </Link>
                    </Col>
                )}


            </Col>


        </Row>

    );
};

