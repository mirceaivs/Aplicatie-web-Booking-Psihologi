import { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Programe } from '../../models/models';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';
import { AuthContext } from '../utils/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ButtonGroup } from 'react-bootstrap';

export function ListaProgram() {

    const { success } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useContext(AuthContext);
    const [existingSchedule, setExistingSchedule] = useState<Programe[]>([]);

    useEffect(() => {
        const getProgram = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/programpsiholog/' + user?.user_id, {
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
    }, [success]);




    return (
        <>
            {existingSchedule.length === 0 && (
                <div className="text-center">
                    <h2 className="mb-5 mt-5">Nu aveti niciun program inregistrat!</h2>
                    <Link to="/cont/create-program/">
                        <Button variant="primary">Adauga</Button>
                    </Link>
                </div>
            )}


            {existingSchedule.length !== 0 && (
                <Container className="border border-1 border-grey rounded mt-4 ">
                    <Row>
                        <div className="text-center">
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

                        </div>
                        <Col className='mt-4'>
                            {existingSchedule.length !== 0 && existingSchedule
                                .sort((a, b) => {
                                    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                    return daysOfWeek.indexOf(a.ziua_saptamanii) - daysOfWeek.indexOf(b.ziua_saptamanii);
                                })
                                .map((program: Programe, index: number) => (
                                    <Row key={index}>
                                        <Col xs={8} className='d-flex justify-content-end' >
                                            <p className='mr-5'>
                                                <strong>{program.ziua_saptamanii}</strong>:<i>{program.ora_inceput.slice(0, -3)} : {program.ora_sfarsit.slice(0, -3)}</i>
                                            </p>
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Col>

                    </Row>
                    <ButtonGroup className='d-flex justify-content-center mb-4'>
                        <Link to={`/cont/program/${user?.user_id}`}>
                            <Button variant="primary" className='mr-3'> <FaEdit /> Editeaza </Button>
                        </Link>
                        <Link to={`/cont/program/stergere/${user?.user_id}`}>
                            <Button variant="danger" className='ml-5' > <FaTrash />  Sterge </Button>
                        </Link>
                    </ButtonGroup>

                </Container>
            )}
        </>
    );
}