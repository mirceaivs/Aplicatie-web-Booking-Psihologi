import { useState, useEffect, useContext } from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import axios from 'axios';
import { Programe, Servici } from '../../models/models';
import Col from 'react-bootstrap/Col';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../../layout/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { SuccessContext } from '../utils/successContext';


export const Programeazate = () => {
    const [selectedServiciu, setselectedServiciu] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [listaServicii, setListaServicii] = useState<Servici[]>([]);
    const { id } = useParams();
    const [selectezZiua, setSelectZiua] = useState(false);
    const navigate = useNavigate();
    const { setSuccess } = useContext(SuccessContext);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [intervaleOrare, setIntervaleOrare] = useState([])
    const [programPsiholog, setProgramPsiholog] = useState<Programe[]>();
    // const [selectedDay, setSelectedDay] = useState('');
    // const [activeButton, setActiveButton] = useState('');
    const [selectedTimeInterval, setSelectedTimeInterval] = useState('');
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
        if (selectezZiua === false) {
            getServicii();
        }
    }, [selectezZiua]);


    useEffect(() => {
        const getProgram = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/programpsiholog/' + id, {
                    withCredentials: true
                });
                setProgramPsiholog(response.data);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        }
        if (selectezZiua === true) {
            getProgram();
        }

    }, [selectezZiua]);


    useEffect(() => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        const formular = new FormData();

        formular.append('serviciu_id', JSON.stringify(selectedServiciu));
        formular.append('data_programare', formattedDate);

        const getIntervaleOrare = async () => {
            try {
                const response = await axios.post('http://localhost:3000/api/user/programari/intervale/' + id, formular, {
                    withCredentials: true
                });

                setIntervaleOrare(Object.values(response.data.availableProgramare));

            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        };
        if (selectezZiua === true) {
            getIntervaleOrare();
        }

    }, [selectedDate]);



    const handleSpecializareClick = (serviciuId: number) => {
        if (selectedServiciu.includes(serviciuId)) {
            setselectedServiciu(selectedServiciu.filter((id) => id !== serviciuId));
        } else {
            setselectedServiciu([...selectedServiciu, serviciuId]);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const dataOra = formattedDate + ' ' + selectedTimeInterval;

        if (intervaleOrare.length === 0) {
            setErrorMessage('Alegeti un interval');
            return;
        }
        const formular = new FormData();


        formular.append('serviciu_id', JSON.stringify(selectedServiciu));
        formular.append('data_programare', dataOra);
        formular.append('id', JSON.stringify(id));

        try {
            await axios.post('http://localhost:3000/api/user/programari/adauga', formular, {
                withCredentials: true
            });
            setSuccess(true);
            navigate('..');

        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                setErrorMessage(errorMessage);
            } else {
                console.log(error);
            }
        }

    }



    const handleCancel = () => {
        // setSuccess(false);
        navigate('..');
    }


    //daca nu are selectat afisez eroare 
    const handleAlegeZiua = () => {
        if (selectedServiciu.length === 0) {
            setErrorMessage('Aelegeti cel putin un serviciu');
            return;
        }
        else {
            setErrorMessage('');
            setSelectZiua(!selectezZiua);
        }
    }

    const handleDateClick = (day: any) => {
        const selectedDay = new Date();
        selectedDay.setDate(selectedDay.getDate() + day);
        setSelectedDate(selectedDay);
        setErrorMessage('');
    };



    const handleTimeIntervalClick = (interval: any) => {
        setSelectedTimeInterval(interval);
    };


    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <Modal>
            {selectezZiua === false && (

                <Row>
                    <div className="d-flex justify-content-center mb-5 mt-3">
                        <h2 className="text-primary">Selecteaza serviciile dorite</h2>
                    </div>

                    <ListGroup>
                        <Col className="text-center">
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                        </Col>
                        {listaServicii.map((serviciu: Servici) => (
                            <ListGroup.Item key={serviciu.seriviciu_id}>
                                <Form.Check
                                    type="checkbox"
                                    label={serviciu.denumire}
                                    checked={selectedServiciu.includes(serviciu.seriviciu_id)}
                                    onChange={() => handleSpecializareClick(serviciu.seriviciu_id)}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>


                    <Row className="mt-4">

                        <Col className='d-flex justify-content-start'>
                            <Button variant="primary" onClick={handleAlegeZiua} >  Alege Ziua </Button>
                        </Col>

                        <Col className='d-flex justify-content-end'>
                            <Button variant="danger" onClick={handleCancel} >  Renunta </Button>
                        </Col>
                    </Row>
                </Row>

            )}
            {selectezZiua === true && (

                <Row>
                    <Col className="text-center">
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </Col>
                    <div className="d-flex justify-content-center mt-3">
                        <h2 className="text-primary">Selecteaza intervalul orar dorit </h2>
                    </div>
                    <Col>
                        <div className="d-flex justify-content-between mb-5 mt-5">
                            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                                const currentDate = new Date();
                                currentDate.setDate(currentDate.getDate() + day);
                                const dayOfWeek = daysOfWeek[currentDate.getDay()];
                                const isWorkingDay = programPsiholog?.some((program) => program.ziua_saptamanii === dayOfWeek);

                                // (selectedDate.getDate() === currentDate.getDate() ? 
                                const variant = isWorkingDay ? 'primary' : 'secondary';
                                return (
                                    <Button
                                        key={day}
                                        variant={variant}
                                        onClick={() => handleDateClick(day)}
                                        disabled={!isWorkingDay}

                                    >
                                        {new Date().getDate() + day}
                                    </Button>
                                );
                            })}

                        </div>
                        <div className='d-flex justify-content-center'>

                            <ul className="list-group w-50">
                                {intervaleOrare.length === 0 && <li className="list-group-item text-center">Lipsă interval</li>}
                                {intervaleOrare.map((interval, index) => (
                                    <Button
                                        key={index}
                                        variant="primary"
                                        className="mr-3 mb-3 hoverable-button"
                                        onClick={() => handleTimeIntervalClick(interval)}
                                    >
                                        {interval}
                                    </Button>
                                ))}
                            </ul>
                        </div>
                        <Row className="mt-4">

                            <Col className='d-flex justify-content-start'>
                                <Button variant="primary" onClick={handleSubmit} >  Programeaza-te </Button>
                            </Col>

                            <Col className='d-flex justify-content-end'>
                                <Button variant="danger" onClick={handleAlegeZiua} >  Inapoi </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}
        </Modal >
    );
};
{/* <Form onSubmit={handleSubmit}>
    <div>
    <Col className="text-center">
    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </Col>
    <div className="d-flex justify-content-between mb-5 mt-5">
    <Button
                className='mr-3'
                variant={activeButton === 'Monday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Monday')}
            >
                Luni
            </Button>
            <Button
                className='mr-3'
                variant={activeButton === 'Tuesday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Tuesday')}
            >
                Marti
            </Button>
            <Button
                className='mr-3'
                variant={activeButton === 'Wednesday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Wednesday')}
            >
                Miercuri
            </Button>
            <Button
                className='mr-3'
                variant={activeButton === 'Thursday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Thursday')}
            >
                Joi
            </Button>
            <Button
                className='mr-3'
                variant={activeButton === 'Friday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Friday')}
            >
                Vineri
            </Button>
            <Button
                className='mr-3'
                variant={activeButton === 'Saturday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Saturday')}
            >
                Sambata
            </Button>
            <Button
                className='mr-3'
                variant={activeButton === 'Sunday' ? 'secondary' : 'primary'}
                onClick={() => handleButtonClick('Sunday')}
            >
                Duminica
            </Button>
        </div>
        <Row className="d-flex justify-content-center mb-3">

            <FormGroup className="d-flex justify-content-center mb-3">
                <FormLabel>Ora Inceput</FormLabel>
                {/* <FormControl className="form-control w-25" type="time" value={startTime} onChange={handleStartTimeChange} /> */}
//             </FormGroup>
//             <FormGroup className="d-flex justify-content-center mb-4">
//                 <FormLabel>Ora Sfarsit</FormLabel>
//                 {/* <FormControl className="form-control w-25" type="time" value={endTime} onChange={handleEndTimeChange} /> */}
//             </FormGroup>
//             <Col>
//                 {/* <FormGroup className="d-flex justify-content-center">
//                     <Button onClick={handleAddDay} className="btn btn-primary">Adaugă Zi</Button>
//                 </FormGroup> */}
//             </Col>
//             <Col>

//                 <FormGroup className="d-flex justify-content-center">
//                     <Button type="submit" className="btn btn-primary ">Programeaza-te</Button>
//                 </FormGroup>
//             </Col>

//         </Row>

//     </div>
// </Form> */}

