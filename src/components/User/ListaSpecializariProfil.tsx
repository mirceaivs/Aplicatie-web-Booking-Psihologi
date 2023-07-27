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
import { Link, useParams } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';
import { FaThumbsUp, FaThumbsDown, FaPlus } from 'react-icons/fa';


export function ListaSpecializariProfil({ setAreSpecializari }: { setAreSpecializari: any }) {

    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [listaSpecializari, setlistaSpecializari] = useState<Specializari[]>([]);
    const { success } = useContext(SuccessContext);

    useEffect(() => {
        const getSpecializari = async () => {
            try {
                //sa fac sa ia a unui baiat cabinetele 
                const response = await axios.get('http://localhost:3000/api/user/specializari/' + id, {
                    withCredentials: true
                });
                const specializari: Specializari[] = response.data;
                const specializariVerificate = specializari.filter((specializare: Specializari) => specializare.verificat === 1);
                if (specializariVerificate.length !== 0) {
                    setAreSpecializari(true);
                }
                setlistaSpecializari(specializariVerificate);
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


    return (
        <Accordion className="border border-1 border-grey rounded">
            <Col className="text-center">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>

            {listaSpecializari.length !== 0 ? (

                listaSpecializari.map((specializare: Specializari, index: number) => (
                    specializare.verificat !== 0 && (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>
                                <h5>Specializare: {specializare.denumire_specializare.charAt(0).toUpperCase() + specializare.denumire_specializare.slice(1)}</h5>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    <Col xs={8}>
                                        <p>
                                            <strong> Nr Atestat </strong>:<i> {specializare.nr_atestat} </i>
                                        </p>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                ))

            ) : (
                <Accordion.Item eventKey="no-specializations">
                    <Accordion.Header>Nu există specializări inregistrate/verificate</Accordion.Header>
                </Accordion.Item>
            )}
        </Accordion>
    );

}

