import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// for (let key in formDataBuffer) {
//     //   console.log('Numele campului: ', key);
//     //   console.log('Valoarea: ', formDataBuffer[key]);
//     // }

//     // for (let [key, value] of formData.entries()) {
//     //   console.log(`${key}: ${value}`);
//     // }


export const Login = () => {
  const { setUser, setIsLoggedIn, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  type formDataType = {
    [key: string]: any;
  }

  const [formDataBuffer, setformDataBuffer] = useState<formDataType>({
    email: '',
    user_password: ''
  })

  if (isLoggedIn) {
    navigate('/')
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setErrorMessage('');
    setformDataBuffer((prevformDataBuffer) => ({
      ...prevformDataBuffer,
      [name]: value,
    }));
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCancel = () => {
    navigate('/');
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!emailRegex.test(formDataBuffer.email)) {
      setErrorMessage('Email invalid.');
      return;
    }


    const formData = new FormData();
    for (const key in formDataBuffer) {
      formData.append(key, formDataBuffer[key]);
    }

    // 
    await axios.post('http://localhost:3000/api/user/login', formData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        setUser(response.data.user);
        setIsLoggedIn(response.data.logged);
        navigate('/');
      })
      .catch(error => {
        if (error.response) {
          const errorMessage = error.response.data.error;
          setErrorMessage(errorMessage);
        } else {
          console.log(error);
        }
      });

  }
  return (
    <>

      <Container fluid className="d-flex justify-content-center align-items-center">
        <Form method="post" onSubmit={handleSubmit} style={{ maxWidth: '400px' }} >
          <Col className="text-center">
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </Col>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="Email" name="email" value={formDataBuffer.email} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Parola</Form.Label>
            <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Parola" name="user_password" value={formDataBuffer.user_password} onChange={handleChange} />
            <Button variant="outline-secondary" onClick={handleTogglePassword}>
              {showPassword ? 'Ascunde' : 'Arată'}
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Link to="/emailverificare">Ti-ai uitat parola?</Link>
          </Form.Group>
          <Form.Group className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Log In
            </Button>
            <Button variant="primary" onClick={handleCancel}>
              Renunta
            </Button>
          </Form.Group>
        </Form>

      </Container>
    </>
  );
};


  // <Form method='post' onSubmit={handleSubmit}>
  //   <p>
  //     <label htmlFor="email">Email</label>
  //     <input type="text" id="email" name='email' required />
  //   </p>
  //   <p>
  //     <label htmlFor="password">Parola</label>
  //     <input type="password" id="password" name='password' required />
  //   </p>
  //   <p >
  //     <Link to='/' type='button'>Cancel</Link>
  //     <button >Submit</button>
  //   </p>
  // </Form>