import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import { Programe } from '../../models/models';
import { Modal } from '../../layout/Modal';
import { FormControl, FormGroup, FormLabel, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';

export function AdaugaProgram() {

    const { setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState('');
    const [activeButton, setActiveButton] = useState('');
    const [buton, setButon] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [schedule, setSchedule] = useState<Programe[]>([]);

    const handleAddDay = () => {
        setErrorMessage('');
        if (!startTime) {
            setErrorMessage("Selectati ora inceput!");
            return;
        }
        if (!endTime) {
            setErrorMessage("Selectati ora sfarist!");
            return;
        }
        if (endTime <= startTime) {
            setErrorMessage("Ora de sfarsit nu poate fi înainte de ora de început!");
            return;
        }

        const newItem = { ziua_saptamanii: selectedDay, ora_inceput: startTime, ora_sfarsit: endTime };
        setSchedule([...schedule, newItem]);

        setButon((prevActivButton) => [...prevActivButton, selectedDay]);
        setSelectedDay('');
        setStartTime('');
        setEndTime('');
        setActiveButton('');
        //MODIFICAT

    };

    const handleStartTimeChange = (event: any) => {
        const hour = event.target.value;
        setStartTime(hour);
    };

    const handleEndTimeChange = (event: any) => {
        const hour = event.target.value;
        setEndTime(hour);
    };

    const handleButtonClick = (button: any) => {
        setErrorMessage('');
        setActiveButton(button);
        setSelectedDay(button);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrorMessage('');
        if (schedule.length === 0) {
            setErrorMessage('Nu ati daugat nici o zi din program!');
            return;
        }
        console.log(schedule);
        try {
            await axios.post('http://localhost:3000/api/user/programpsiholog/adauga', schedule, {
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
    };


    return (
        <Modal>
            <Form onSubmit={handleSubmit}>
                <div>
                    <Col className="text-center">
                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    </Col>
                    <div className="d-flex justify-content-between mb-5 mt-5">
                        <Button
                            className='mr-3'
                            variant={buton.includes('Monday') || activeButton === 'Monday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Monday')}
                        >
                            Luni
                        </Button>
                        <Button
                            className='mr-3'
                            variant={buton.includes('Tuesday') || activeButton === 'Tuesday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Tuesday')}
                        >
                            Marti
                        </Button>
                        <Button
                            className='mr-3'
                            variant={buton.includes('Wednesday') || activeButton === 'Wednesday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Wednesday')}
                        >
                            Miercuri
                        </Button>
                        <Button
                            className='mr-3'
                            variant={buton.includes('Thursday') || activeButton === 'Thursday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Thursday')}
                        >
                            Joi
                        </Button>
                        <Button
                            className='mr-3'
                            variant={buton.includes('Friday') || activeButton === 'Friday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Friday')}
                        >
                            Vineri
                        </Button>
                        <Button
                            className='mr-3'
                            variant={buton.includes('Saturday') || activeButton === 'Saturday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Saturday')}
                        >
                            Sambata
                        </Button>
                        <Button
                            className='mr-3'
                            variant={buton.includes('Sunday') || activeButton === 'Sunday' ? 'secondary' : 'primary'}
                            onClick={() => handleButtonClick('Sunday')}
                        >
                            Duminica
                        </Button>
                    </div>
                    <Row className="d-flex justify-content-center mb-3">

                        <FormGroup className="d-flex justify-content-center mb-3">
                            <FormLabel>Ora Inceput</FormLabel>
                            <FormControl className="form-control w-25" type="time" value={startTime} onChange={handleStartTimeChange} />
                        </FormGroup>
                        <FormGroup className="d-flex justify-content-center mb-4">
                            <FormLabel>Ora Sfarsit</FormLabel>
                            <FormControl className="form-control w-25" type="time" value={endTime} onChange={handleEndTimeChange} />
                        </FormGroup>
                        <Col>
                            <FormGroup className="d-flex justify-content-center">
                                <Button onClick={handleAddDay} className="btn btn-primary">Adaugă Zi</Button>
                            </FormGroup>
                        </Col>
                        <Col>

                            <FormGroup className="d-flex justify-content-center">
                                <Button type="submit" className="btn btn-primary ">Salvează</Button>
                            </FormGroup>
                        </Col>

                    </Row>

                </div>
            </Form>
        </Modal>
    );
}