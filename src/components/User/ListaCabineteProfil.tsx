import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Cabinete } from '../../models/models';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';
import { useParams } from 'react-router-dom';

export function ListaCabineteProfil() {

    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [listaCabinete, setListaCabinete] = useState<Cabinete[]>([]);
    const { success } = useContext(SuccessContext);

    useEffect(() => {
        const getCabinete = async () => {
            try {
                //sa fac sa ia a unui baiat cabinetele 
                const response = await axios.get('http://localhost:3000/api/user/cabinete/' + id, {
                    withCredentials: true
                });
                const cabinete: Cabinete[] = response.data;
                setListaCabinete(cabinete);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getCabinete();
    }, [success]);


    return (
        <Accordion className="border border-1 border-grey rounded" >

            <Col className="text-center">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>
            {listaCabinete.length !== 0 && listaCabinete.map((cabinet: Cabinete, index: number) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header><h5>Cabinet: {cabinet.denumire_Cabinet.charAt(0).toUpperCase() + cabinet.denumire_Cabinet.slice(1)}</h5></Accordion.Header>

                    <Accordion.Body>
                        <Row>

                            <Col xs={8}>
                                <p>
                                    <strong> Adresa </strong>:<i>  {cabinet.adresa} </i>
                                </p>

                                <p>
                                    <strong> Localitate </strong>:<i>  {cabinet.localitate} </i>
                                </p>

                                <p>
                                    <strong> Judet </strong>:<i>  {cabinet.judet} </i>
                                </p>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
            {listaCabinete.length === 0 && (
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Nu exista cabinete inregistrate</Accordion.Header>
                </Accordion.Item>
            )}

        </Accordion>
    );
}

