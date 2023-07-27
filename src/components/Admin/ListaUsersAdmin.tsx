import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { User } from '../../models/models';
import Button from 'react-bootstrap/Button';
import { FaTrash } from 'react-icons/fa';
import { ButtonGroup } from 'react-bootstrap';
import { SuccessContext } from '../utils/successContext';



export function ListaUseriNeverificati() {

    const { success, setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [listaUseri, setListaUseri] = useState<User[]>([]);


    useEffect(() => {
        const getUsers = async () => {
            try {

                const response = await axios.get('http://localhost:3000/api/admin/users', {
                    withCredentials: true
                });
                const listaUseri: User[] = response.data;
                setListaUseri(listaUseri);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getUsers();

    }, [success]);
    //iau programare psiholog user_ id pt client 
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleConfirmare = async (id: number) => {

        try {

            await axios.delete('http://localhost:3000/api/admin/delete/' + id, {
                withCredentials: true
            });
            setSuccess(true);

        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                console.log(errorMessage);
            } else {
                console.log(error);
            }
        }

    }

    return (
        <Accordion className="border border-1 border-grey rounded" >
            <Col className="text-center">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>
            {listaUseri.length !== 0 && listaUseri.map((user: User, index: number) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header><h5>Utilizator: {user.user_name} </h5></Accordion.Header>
                    <Accordion.Body>
                        <Row>

                            <Col xs={8}>

                                <p>
                                    <strong> Nume prenume </strong>:<i>  {user.nume}  {user.prenume}</i>
                                </p>

                                <p>
                                    <strong> Tip utilizator </strong>:<i>  {user.user_type} </i>
                                </p>

                                <p>
                                    <strong> Email </strong>:<i>  {user.email} </i>
                                </p>


                            </Col>

                            <Col xs={4} className="d-flex align-items-center justify-content-end">
                                <ButtonGroup >
                                    <Button onClick={() => handleConfirmare(user.user_id)}> <FaTrash /> Stergere Utilizator </Button>
                                </ButtonGroup>

                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
            {listaUseri.length === 0 && (
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Nu exista utilizatori neverificati</Accordion.Header>
                </Accordion.Item>
            )}

        </Accordion>
    );
}

