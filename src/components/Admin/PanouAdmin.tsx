import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Outlet } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { SuccessContext } from '../utils/successContext';
import { ListaSpecializariAdmin } from './ListaSpecializariAdmin';
import { ListaUseriNeverificati } from './ListaUsersAdmin';

export function PanouAdmin() {
    const [activeTab, setActiveTab] = useState('specializariServ');
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
                            <Nav.Link eventKey="users">Utilizatori Neverificati</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="specializariServ">Specializari Neverificate</Nav.Link>
                        </Nav.Item>

                    </Nav>
                </Col>

                <Col lg={8} style={{ display: 'flex' }}>
                    <Tab.Content style={{ width: '100%' }} className="w-100 ">
                        <Tab.Pane eventKey="users"  >
                            <ListaUseriNeverificati />
                        </Tab.Pane>
                        <Tab.Pane eventKey="specializariServ"><ListaSpecializariAdmin /></Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>

        </Tab.Container>
    );
}

