import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserImage from '../components/User/UserImage';
import { UserDetails } from '../components/User/UserDetails';
import { AuthContext } from '../components/utils/AuthContext';
import { useContext, useState } from 'react';
import { ErrorAuth } from '../components/utils/ErrorAuth';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { DetaliiPsiholog } from '../components/DetaliiPsiholog/DetaliiPsiholog';
import { PanouAdmin } from '../components/Admin/PanouAdmin';

export const PaginaCont = () => {
    const { user, isLoggedIn, setUser, setIsLoggedIn } = useContext(AuthContext);



    const [isActualizat, setIsActualizat] = useState(false);
    const [radioValue, setRadioValue] = useState('2');
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    let radios;
    if (user?.user_type !== 'admin') {
        radios = [
            { name: 'Profil', value: '1' },
            { name: 'Detalii Psiholog', value: '2' },
        ];

    } else {
        radios = [
            { name: 'Profil', value: '1' },
            { name: 'Panou Admin', value: '2' },
        ];

    }

    if (!user && !isLoggedIn) {
        return <ErrorAuth />
    }


    // <DetaliiPsiholog key={success} /> dau force rerender la asta
    return (

        <Container className=" mb-5">
            {user?.user_type === 'client' &&

                <Container className='d-flex justify-content-center'>
                    <Row style={{ width: '60%' }} >
                        <Col sm={8} >
                            {user && <UserDetails user={user} setIsActualizat={setIsActualizat} setUser={setUser}
                                setIsLoggedIn={setIsLoggedIn} setImageBuffer={setImageBuffer} />}
                        </Col>
                        <Col sm={4} >
                            {user && <UserImage user={user} isActualizat={isActualizat}
                                setIsActualizat={setIsActualizat} imageBuffer={imageBuffer} setImageBuffer={setImageBuffer} />}
                        </Col >
                    </Row>
                </Container>

            }
            {user?.user_type === 'psiholog' &&
                (
                    <>
                        <Row >
                            <Col xs={12} className='d-inline-block '>

                                <ButtonGroup>
                                    {radios.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={radioValue === radio.value ? 'outline-primary' : 'outline-secondary'}
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                            style={{ display: 'inline-block', borderRadius: '5px' }}
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '25px' }} className="d-flex justify-content-center">
                            {radioValue === '1' && user && (
                                <>
                                    <Col md="auto">
                                        <UserDetails user={user} setIsActualizat={setIsActualizat} setUser={setUser} setIsLoggedIn={setIsLoggedIn} setImageBuffer={setImageBuffer} />
                                    </Col>
                                    <Col md="auto" >
                                        <UserImage user={user} isActualizat={isActualizat} setIsActualizat={setIsActualizat} imageBuffer={imageBuffer} setImageBuffer={setImageBuffer} />
                                    </Col >
                                </>

                            )}
                            {radioValue === '2' && user && (
                                <>
                                    <Col >
                                        <DetaliiPsiholog />
                                    </Col>
                                </>

                            )}
                        </Row>
                    </>

                )
            }
            {user?.user_type === 'admin' &&
                (

                    <>
                        <Row style={{ marginTop: '25px' }} className="d-flex justify-content-center">
                            <Col md="auto">
                                <UserDetails user={user} setIsActualizat={setIsActualizat} setUser={setUser} setIsLoggedIn={setIsLoggedIn} setImageBuffer={setImageBuffer} />
                            </Col>
                            <Col md="auto" >
                                <UserImage user={user} isActualizat={isActualizat} setIsActualizat={setIsActualizat} imageBuffer={imageBuffer} setImageBuffer={setImageBuffer} />
                            </Col >
                        </Row>
                    </>

                )
            }
        </Container >
    );
};

