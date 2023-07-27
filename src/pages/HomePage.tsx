import { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Collapse } from 'react-bootstrap';
import { SearchResults } from '../components/Home/SearchResults';
import { AuthContext } from '../components/utils/AuthContext';
import { ProgramariPsiholog } from '../components/Programari/ProgramariPsiholog';
import { PanouAdmin } from '../components/Admin/PanouAdmin';

export const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [judet, setJudet] = useState('');
    const [localitate, setLocalitate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [shouldSearch, setShouldSearch] = useState(false);
    const { isLoggedIn, user } = useContext(AuthContext);
    const handleSearch = async (event: any) => {
        event.preventDefault();
        setShouldSearch(true);

    };

    const onChange = (e: any) => {
        setSearchTerm(e.target.value);
        setShouldSearch(false)
    }

    return (
        <Container >
            {(user?.user_type == 'client' && isLoggedIn) &&
                <Container className='w-50' >

                    <Row >
                        <Col >
                            <Form onSubmit={handleSearch}>
                                <Form.Group controlId="searchTerm" >
                                    <Form.Label>Search</Form.Label>
                                    <Form.Control type="text" placeholder="Cauta..." value={searchTerm} onChange={onChange} />
                                </Form.Group>
                                <Button onClick={() => setShowFilters(!showFilters)} aria-controls="filters" aria-expanded={showFilters} variant='secondary' className='mt-3 mr-4'>
                                    Filtre
                                </Button>
                                <Collapse in={showFilters}>
                                    <Row>
                                        <Form.Group as={Col} controlId="judet">
                                            <Form.Label>Județ</Form.Label>
                                            <Form.Control type="text" placeholder="Adauga judetul" value={judet} onChange={(e) => { setJudet(e.target.value); setShouldSearch(false); }} />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="localitate">
                                            <Form.Label>Localitate</Form.Label>
                                            <Form.Control type="text" placeholder="Adauga localitatea" value={localitate} onChange={(e) => { setLocalitate(e.target.value); setShouldSearch(false); }} />
                                        </Form.Group>
                                    </Row>
                                </Collapse>
                                <Button variant="primary" type="submit" className='mt-3'>
                                    Cauta
                                </Button>
                            </Form>
                        </Col>

                        {shouldSearch &&
                            <SearchResults searchTerm={searchTerm} localitate={localitate} judet={judet} setShouldSearch={setShouldSearch} />
                        }
                    </Row>
                </Container>
            }
            {(user?.user_type == 'psiholog' && isLoggedIn) &&
                <ProgramariPsiholog />
            }
            {(user?.user_type == 'admin' && isLoggedIn) &&
                <PanouAdmin />
            }
            {!isLoggedIn &&
                <h1 className='text-center'>Aceasta este lucrarea mea licenta, va rog sa va autentificati in contul dumneavoastra sau sa va creati un cont!</h1>
            }


        </Container>
    );
};

