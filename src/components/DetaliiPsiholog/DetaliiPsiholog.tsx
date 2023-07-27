import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { ListaCabinete } from '../Cabinete/ListaCabinete';
import { Outlet } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { SuccessContext } from '../utils/successContext';
import { ListaSpecializare } from '../Servicii&Specializari/ListaSpecializari';
import { ListaProgram } from '../Program/ListaProgram';

export function DetaliiPsiholog() {
    const [activeTab, setActiveTab] = useState('cabinete');
    const { success, setSuccess } = useContext(SuccessContext);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000); // Afișează alerta timp de 3 secunde

            return () => {
                clearTimeout(timer);
            };
        }
    }, [success]);
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000); // Afișează alerta timp de 3 secunde

            return () => {
                clearTimeout(timer);
            };
        }
    }, [success]);



    const handlerTab = (eventKey: any) => {
        setActiveTab(eventKey);
    }

    const handleButtonAdauga = () => {
        setSuccess(false);
    }

    //<DetaliiPsiholog key={success} /> sa dau rerender la toata componenta daca se schimba success
    return (
        <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={handlerTab}>
            <Row>
                <Col className="text-center">
                    {success && (
                        <Alert variant='success'>
                            Succes!
                        </Alert>
                    )}
                </Col>
                <Container>
                    <Outlet />
                </Container>
                <Col lg={3} >
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="cabinete">Cabinete</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="specializariServ">Specializari&Servicii</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="program">Program de lucru</Nav.Link>
                        </Nav.Item>
                        <Nav.Item style={{ marginTop: '40px' }}>
                            {activeTab === 'cabinete' &&
                                (<Link to="/cont/create-cabinet">
                                    <Button variant="primary" onClick={handleButtonAdauga}>Adauga</Button>
                                </Link>
                                )}

                            {activeTab === 'specializariServ' &&
                                (<Link to="/cont/create-specializare">
                                    <Button variant="primary">Adauga</Button>
                                </Link>
                                )}

                        </Nav.Item>
                    </Nav>
                </Col>

                <Col lg={8} style={{ display: 'flex' }}>
                    <Tab.Content style={{ width: '100%' }} className="w-100 ">
                        <Tab.Pane eventKey="cabinete"  >
                            <ListaCabinete />
                        </Tab.Pane>
                        <Tab.Pane eventKey="specializariServ"><ListaSpecializare /></Tab.Pane>
                        <Tab.Pane eventKey="program"> <ListaProgram />  </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>

        </Tab.Container>
    );
}

