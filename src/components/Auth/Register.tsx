import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { AuthContext } from '../utils/AuthContext';
import Container from 'react-bootstrap/Container';


export const Register = () => {

    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    if (isLoggedIn) {
        navigate('/cont');
    }


    type formDataType = {
        [key: string]: any;
    }
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setselectedImage] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
        nume: '',
        prenume: '',
        user_name: '',
        email: '',
        nr_telefon: '',
        user_type: '',
        user_password: ''
    })
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    const passwordRegex = /^.{8,}$/;
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    const phoneRegex = /^[0-9]{10}$/; 

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCancel = () => {
        navigate('/');
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;

        setErrorMessage('');
        setformDataBuffer((prevformDataBuffer) => ({
            ...prevformDataBuffer,
            [name]: value,
        }));
    }



    const handleImageChange = (event: any) => {
        const file = event.target.files && event.target.files[0];
        setErrorMessage('');
        if (!file.name.endsWith('.jpg')) {
            setErrorMessage('Selectați un fișier .jpg.');
            return;
        }
        setselectedImage(file);
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const requiredFields = ['nume', 'prenume', 'user_name', 'email', 'nr_telefon', 'user_password', 'user_type'];
        const hasEmptyFields = requiredFields.some(field => !formDataBuffer[field]);
        
        setErrorMessage('');
        if (!emailRegex.test(formDataBuffer.email)) {
            setErrorMessage('Email invalid.');
            return;
        }
        if (!passwordRegex.test(formDataBuffer.user_password)) {
            setErrorMessage('Parola trebuie să conțină cel puțin 8 caractere');
            return;
        }
        if (!phoneRegex.test(formDataBuffer.nr_telefon)) {
            setErrorMessage('Număr de telefon invalid.');
            return;
        }
        
        if (hasEmptyFields) {
            setErrorMessage('Toate câmpurile sunt obligatorii.');
            return;
        }
        
        const formular = new FormData();
        if (selectedImage) {
            formular.append('poza', selectedImage);
        }
        for (const key in formDataBuffer) {
            formular.append(key, formDataBuffer[key]);
        }
        
        

        try {
            await axios.post('http://localhost:3000/api/user/register', formular, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            navigate('/verificare');
            
            
        } catch (error:any) {
            if (error.response) {
                const errorMessage = error.response.data.error;
                setErrorMessage(errorMessage);
            } else {
                console.log(error);
            }
        }
    }


    //

    return (
        <>
            <Container fluid className="d-flex justify-content-center align-items-center">

        <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} autoComplete="off">
            <Col className="text-center"> 
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </Col>
            <Row className="mb-3">
                <>
                    <Form.Group as={Col}>
                        <Form.Label>Nume</Form.Label>
                        <Form.Control type="text" name="nume" placeholder="Nume" value={formDataBuffer.nume} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Prenume</Form.Label>
                        <Form.Control type="text" placeholder="Prenume" name="prenume" value={formDataBuffer.prenume} onChange={handleChange} />
                    </Form.Group>
                </>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Nume Utilizator</Form.Label>
                <Form.Control type="text" placeholder="Nume Utilizator" name="user_name" value={formDataBuffer.user_name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" placeholder="Email" name="email" value={formDataBuffer.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Parola</Form.Label>
                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Parola" name="user_password" value={formDataBuffer.user_password} autoComplete="new-password" onChange={handleChange} />
                <Button variant="outline-secondary" onClick={handleTogglePassword}>
                    {showPassword ? 'Ascunde' : 'Arată'}
                </Button>
            </Form.Group>
            <Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Nr telefon</Form.Label>
                    <Form.Control type="text" placeholder="Nr Telefon" name="nr_telefon" value={formDataBuffer.nr_telefon} onChange={handleChange} />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Alege un rol</Form.Label>
                        <Form.Select name="user_type" value={formDataBuffer.user_type || ''} onChange={handleChange}>
                            <option value="" disabled hidden>- Selectează un rol -</option>
                            <option value="client">Client</option>
                            <option value="psiholog">Psiholog</option>
                    </Form.Select>
                </Form.Group>
            </Row>

            <Row className="mb-3 mt-3">
                <Form.Group as={Col} >
                    <>
                        <Form.Group className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Inregistreaza-te
                            </Button>
                            <Button variant="primary" onClick={handleCancel}>
                                Renunta
                            </Button>
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Alege o imagine</Form.Label>
                            <Form.Control name="poza" type="file" accept="image/jpg" onChange={handleImageChange} />
                        </Form.Group>
                    </>



                </Form.Group>
            </Row>
        </Form>
    </Container>
    </>
    );
}

    // const [selectedUserType, setselectedUserType] = useState('');
    // const [selectedImage, setselectedImage] = useState<File | null>(null);
    // const navigate = useNavigate();

    // const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    //     setselectedUserType(event.target.value);
    // }
    
    // const handleImageChange = (event: any) => {
        //     const file = event.target.files && event.target.files[0];
        //     setselectedImage(file);
        // }
        
        // const handleSubmit = async (event: any) => {
            //     event.preventDefault();
            //     const formData = new FormData();
            //     if (selectedImage) {
                //         formData.append('poza', selectedImage);
                //     }
                //     formData.append('user_type', selectedUserType);
                //     formData.append('email', event.target.email.value);
                //     formData.append('user_password', event.target.user_password.value);
                //     formData.append('user_name', event.target.user_name.value);
                //     formData.append('nume', event.target.nume.value);
                //     formData.append('prenume', event.target.prenume.value);
                //     formData.append('nr_telefon', event.target.nr_telefon.value);
                
                //     await axios.post('http://localhost:3000/api/user/register', formData, {
                    //         headers: {
                        //             'Content-Type': 'multipart/form-data'
                        //         },
                        //         withCredentials: true
                        //     })
    //         .then(response => {
        //             console.log(response.data);
        //             navigate('/');
        //         })
        //         .catch(error => {
            //             // Manipularea erorilor în cazul în care cererea a eșuat
            //             console.error(error);
            //         });
            
            // }
            // return (
                
                //     <Form method='post' onSubmit={handleSubmit}>
                //         <p>
                //             <label htmlFor="email">Email</label>
                //             <input type="text" id="email" name='email' required />
                //         </p>
    //         <p>
    //             <label htmlFor="password">Parola</label>
    //             <input type="password" id="password" name='user_password' required />
    //         </p>
    //         <p>
    //             <label htmlFor="user_name">Username</label>
    //             <input type="text" id="user_name" name='user_name' required />
    //         </p>
    //         <p>
    //             <label htmlFor="nume">Nume</label>
    //             <input type="text" id="nume" name='nume' required />
    //         </p>
    //         <p>
    //             <label htmlFor="prenume">Prenume</label>
    //             <input type="text" id="prenume" name='prenume' required />
    //         </p>
    //         <p>
    //             <label htmlFor="nr_telefon">Numar Telefon</label>
    //             <input type="text" id="nr_telefon" name='nr_telefon' required />
    //         </p>
    //         <p>
    //             <select id="user_type" name="user_type" value={selectedUserType} onChange={handleChange}>
    //                 <option value="">- Selectează un rol -</option>
    //                 <option value="client">Client</option>
    //                 <option value="psiholog">Psiholog</option>
    //             </select>
    //         </p>
    //         <p>
    //             <label htmlFor="poza">Poza de profil</label>
    //             <input type="file" id="poza" name="poza" accept="image/jpg" onChange={handleImageChange} />
    //         </p>
    //         <p >
    //             <Link to='/' type='button'>Cancel</Link>
    //             <button >Submit</button>
    //         </p>
    //     </Form>
    // );
    
    