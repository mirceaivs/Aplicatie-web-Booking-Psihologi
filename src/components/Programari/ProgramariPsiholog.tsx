import Accordion from 'react-bootstrap/Accordion';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Programaris } from '../../models/models';
import Button from 'react-bootstrap/Button';
import { FaThumbsDown, FaThumbsUp, FaEdit } from 'react-icons/fa';
import { ButtonGroup } from 'react-bootstrap';
import { ListaServiciiProgramare } from './ListaServiciiProgramare';
import { SuccessContext } from '../utils/successContext';
import Alert from 'react-bootstrap/Alert';


export function ProgramariPsiholog() {

    const { success, setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [listaProgramari, setListaProgramari] = useState<Programaris[]>([]);


    useEffect(() => {
        const getProgramari = async () => {
            try {

                const response = await axios.get('http://localhost:3000/api/user/programari/psiholog', {
                    withCredentials: true
                });
                const listaProgramari: Programaris[] = response.data;
                setListaProgramari(listaProgramari);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };

        getProgramari();

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
        setSuccess(true);
        try {

            await axios.get('http://localhost:3000/api/user/programari/update/' + id, {
                withCredentials: true
            });


        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                console.log(errorMessage);
            } else {
                console.log(error);
            }
        }

    }

    const handleCalendar = async (id: number, nume: string, prenume: string) => {
        try {
            const formular = new FormData();
            const numeComplet = nume + ' ' + prenume;
            formular.append('nume', numeComplet);
            await axios.post('http://localhost:3000/api/user/programari/calendar/' + id, formular, {
                withCredentials: true
            });
            setSuccess(true);


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
        <Accordion className="border border-1 border-grey rounded" >

            {success && <div className="text-center">
                <Alert variant={'success'}>Succes</Alert>
            </div>}
            <Col className="text-center">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>
            {listaProgramari.length !== 0 && listaProgramari.map((programare: Programaris, index: number) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header><h5>Programarea: {programare.data_programare} Client: {programare.user_nume} {programare.user_prenume}
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            <strong style={{ marginRight: '15px' }}>Aprobata</strong>
                            {programare.aprobat === 0 || programare.aprobat === 3 ? (
                                <FaThumbsDown color="red" style={{ marginTop: '7px' }} />
                            ) : (
                                <FaThumbsUp color="green" />
                            )}
                        </p>
                        {programare.aprobat === 3 && <i>FINALIZATA</i>} </h5></Accordion.Header>
                    <Accordion.Body>
                        <Row>

                            <Col xs={8}>
                                <p>
                                    <strong> Numar telefon </strong>:<i>  {programare.user_telefon} </i>
                                </p>

                                <p>
                                    <strong> Data programare </strong>:<i>  {programare.data_programare} </i>
                                </p>

                                <p>
                                    <strong> Data realizare </strong>:<i>  {programare.data_realizare} </i>
                                </p>

                            </Col>

                            <Col xs={4} className="d-flex align-items-center justify-content-end">
                                <ButtonGroup vertical>
                                    {programare.aprobat === 0 &&
                                        <Button onClick={() => handleConfirmare(programare.programare_id)} > <FaEdit /> Confirma Programarea </Button>
                                    }
                                    {programare.aprobat === 1 &&
                                        <Button onClick={() => handleCalendar(programare.programare_id, programare.user_nume, programare.user_prenume)}> <FaEdit /> Adauga in Calendar </Button>
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <ListaServiciiProgramare setErrorMessage={setErrorMessage} programare_id={programare.programare_id} />
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
            {listaProgramari.length === 0 && (
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Nu exista Programari inregistrate</Accordion.Header>
                </Accordion.Item>
            )}

        </Accordion>
    );
}

