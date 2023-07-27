import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Servici } from '../../models/models';
import { useParams } from 'react-router-dom';

export function ListaServiciiProfil() {

    const [listaServicii, setListaServicii] = useState<Servici[]>([]);

    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const getServicii = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/servicii/verificat/' + id, {
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
    }, []);


    return (
        <Accordion className="border border-1 border-grey rounded" >
            <Col className="text-center">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>
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
