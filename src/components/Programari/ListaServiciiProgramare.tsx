import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Servici } from '../../models/models';
import { SuccessContext } from '../utils/successContext';


export function ListaServiciiProgramare({ setErrorMessage, programare_id }: any) {

    const [listaServicii, setListaServicii] = useState<Servici[]>([]);
    const { success } = useContext(SuccessContext);


    useEffect(() => {
        const getServicii = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/programari/psiholog/' + programare_id, {
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

