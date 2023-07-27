import { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Programe } from '../../models/models';
import { Modal } from '../../layout/Modal';
import { FormControl, FormGroup, FormLabel, Form, Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';



export function Program() {

    const { setSuccess } = useContext(SuccessContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [activeButton, setActiveButton] = useState('Monday');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const { id } = useParams();
    const [schedule, setSchedule] = useState<Programe[]>([]);
    const [existingSchedule, setExistingSchedule] = useState<Programe[]>([]);
    const [daySchedules, setDaySchedules] = useState<Map<string, Programe>>(new Map());



    useEffect(() => {
        const getProgram = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/programpsiholog/' + id, {
                    withCredentials: true
                });
                setExistingSchedule(response.data);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage(errorMessage);
                } else {
                    console.log(error);
                }
            }
        }
        getProgram();
    }, []);

    useEffect(() => {
        const newDaySchedules = new Map();
        if (existingSchedule.length > 0) {
            existingSchedule.map((program: Programe) => {
                newDaySchedules.set(program.ziua_saptamanii, program);
            })
        }
        setDaySchedules(newDaySchedules);
    }, [existingSchedule]);

    const handleCancel = () => {
        navigate('..');
    }


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
        setDaySchedules((prevDaySchedules) => {
            const newDaySchedules = new Map(prevDaySchedules);
            newDaySchedules.set(selectedDay, newItem);
            return newDaySchedules;
        });


        setSelectedDay('');
        setStartTime('');
        setEndTime('');
        setActiveButton('');

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
        const program = daySchedules.get(button);
        if (daySchedules.has(button) && program) {
            setStartTime(program.ora_inceput);
            setEndTime(program.ora_sfarsit);
        } else {
            setStartTime('');
            setEndTime('');
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrorMessage('');
        if (schedule.length === 0) {
            setErrorMessage('Nu ati daugat nici o zi din program!');
            return;
        }

        try {


            const newExistingSchedule = existingSchedule.map(({ program_id, user_id, ...rest }) => rest);

            const programUpdate = newExistingSchedule.map((prog) => {
                const programAceeasiZi = schedule.find((program) => program.ziua_saptamanii === prog.ziua_saptamanii);
                if (programAceeasiZi) {
                    prog.ora_inceput = programAceeasiZi.ora_inceput;
                    prog.ora_sfarsit = programAceeasiZi.ora_sfarsit;
                }
                return prog;
            });

            let updatedSchedule = [...schedule, ...programUpdate];

            updatedSchedule = updatedSchedule.reduce<Programe[]>((acc, current) => {
                const x = acc.find(item => item.ziua_saptamanii === current.ziua_saptamanii);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);



            await axios.post('http://localhost:3000/api/user/programpsiholog/adauga', updatedSchedule, {
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
        <>
            <Modal>

                <Form onSubmit={handleSubmit}>
                    <Container>
                        <Col className="text-center">
                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                        </Col>
                        <div className="d-flex justify-content-between mb-5 mt-5">
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Monday') || activeButton === 'Monday' ? 'secondary' : 'primary'}
                                onClick={() => handleButtonClick('Monday')}
                            >
                                Luni
                            </Button>
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Tuesday') || activeButton === 'Tuesday' ? 'secondary' : 'primary'}
                                onClick={() => handleButtonClick('Tuesday')}
                            >
                                Marti
                            </Button>
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Wednesday') || activeButton === 'Wednesday' ? 'secondary' : 'primary'}
                                onClick={() => handleButtonClick('Wednesday')}
                            >
                                Miercuri
                            </Button>
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Thursday') || activeButton === 'Thursday' ? 'secondary' : 'primary'}
                                onClick={() => handleButtonClick('Thursday')}
                            >
                                Joi
                            </Button>
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Friday') || activeButton === 'Friday' ? 'secondary' : 'primary'}
                                onClick={() => handleButtonClick('Friday')}
                            >
                                Vineri
                            </Button>
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Saturday') || activeButton === 'Saturday' ? 'secondary' : 'primary'}
                                onClick={() => handleButtonClick('Saturday')}
                            >
                                Sambata
                            </Button>
                            <Button
                                className='mr-3'
                                variant={daySchedules.has('Sunday') || activeButton === 'Sunday' ? 'secondary' : 'primary'}
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
                                    <Button onClick={handleAddDay} className="btn btn-primary">
                                        Modifica Zi
                                    </Button>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="d-flex justify-content-center">
                                    <Button onClick={handleCancel} className="btn btn-primary">Renunta</Button>
                                </FormGroup>
                            </Col>
                            <Col>

                                <FormGroup className="d-flex justify-content-center">
                                    <Button type="submit" className="btn btn-primary ">Salvează</Button>
                                </FormGroup>
                            </Col>

                        </Row>

                    </Container>
                </Form>
            </Modal>
        </>
    );
}