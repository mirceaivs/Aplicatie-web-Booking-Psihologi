import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Specializari } from '../../models/models';
import { AuthContext } from '../utils/AuthContext';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { ListaServicii } from '../Servicii&Specializari//ListaServicii';

export function ListaSpecializariAdmin() {

    const { user } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [listaSpecializari, setlistaSpecializari] = useState<Specializari[]>([]);
    const { success, setSuccess } = useContext(SuccessContext);

    useEffect(() => {
        const getSpecializari = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/specializari', {
                    withCredentials: true
                });
                const specializari: Specializari[] = response.data;
                setlistaSpecializari(specializari);
                if (errorMessage) {
                    setErrorMessage('');
                }
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getSpecializari();
    }, [success]);

    const handleConfirmare = async (id: number) => {

        try {

            await axios.delete('http://localhost:3000/api/admin/specializare/delete/' + id, {
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
            {listaSpecializari.length !== 0 && listaSpecializari.map((specializare: Specializari, index: number) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header><h5>Specializare: {specializare.denumire_specializare.charAt(0).toUpperCase() + specializare.denumire_specializare.slice(1)}</h5></Accordion.Header>

                    <Accordion.Body>
                        <Row>

                            <Col xs={8}>
                                <p>
                                    <strong> Nr Atestat </strong>:<i>  {specializare.nr_atestat} </i>
                                </p>

                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <strong style={{ marginRight: '15px' }}>Verificat</strong>
                                    {specializare.verificat === 0 ? (
                                        <FaThumbsDown color="red" style={{ marginTop: '7px' }} />
                                    ) : (
                                        <FaThumbsUp color="green" />
                                    )}
                                </p>

                            </Col>

                            <Col xs={4} className="d-flex align-items-center justify-content-end">


                                <ButtonGroup vertical>

                                    <Link to={`/specializare/${specializare.specializare_id}`} className="mb-2">
                                        <Button variant="primary" > <FaEdit /> Verifica </Button>
                                    </Link>
                                    <ButtonGroup >
                                        <Button onClick={() => handleConfirmare(specializare.specializare_id)}> <FaTrash /> Stergere Specializare </Button>
                                    </ButtonGroup>

                                </ButtonGroup>

                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <ListaServicii setErrorMessage={setErrorMessage} user={user} specializare_id={specializare.specializare_id} />
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
            {listaSpecializari.length === 0 && (
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Nu exista specializari inregistrate</Accordion.Header>
                </Accordion.Item>
            )}

        </Accordion>
    );
}

