import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Servici } from '../../models/models';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';
import { AuthContext } from '../utils/AuthContext';


export function ListaServicii({ setErrorMessage, specializare_id }: any) {

    const [listaServicii, setListaServicii] = useState<Servici[]>([]);
    const { success } = useContext(SuccessContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getServicii = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/servicii/' + specializare_id, {
                    withCredentials: true
                });
                const servicii: Servici[] = response.data;
                setListaServicii(servicii);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getServicii();
    }, [success]);




    return (
        <Accordion className="border border-1 border-grey rounded" >
            {listaServicii.length !== 0 && listaServicii.map((serviciu: Servici, index: number) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header><h5>Serviciu: {serviciu.denumire.charAt(0).toUpperCase() + serviciu.denumire.slice(1)}</h5></Accordion.Header>

                    <Accordion.Body>
                        <Row>

                            <Col xs={8}>
                                <p>
                                    <strong> Pret </strong>:<i>  {serviciu.pret} lei</i>
                                </p>

                                <p>
                                    <strong> Durata </strong>:<i>  {serviciu.durata} minute</i>
                                </p>

                                <p>
                                    <strong> Descriere </strong>:<i>  {serviciu.descriere} </i>
                                </p>

                            </Col>

                            <Col xs={4} className="d-flex align-items-center justify-content-end">

                                {user?.user_type !== 'admin' &&
                                    <ButtonGroup vertical>

                                        <Link to={`/cont/serviciu/${serviciu.seriviciu_id}`} className="mb-2">
                                            <Button variant="primary" > <FaEdit /> Editeaza </Button>
                                        </Link>
                                        <Link to={`/cont/servicii/stergere/${serviciu.seriviciu_id}`} className="mb-2">
                                            <Button variant="danger" > <FaTrash />  Sterge </Button>
                                        </Link>

                                    </ButtonGroup>
                                }

                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
            {listaServicii.length === 0 && (
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Nu exista servicii inregistrate</Accordion.Header>
                </Accordion.Item>
            )}

        </Accordion>
    );
}

