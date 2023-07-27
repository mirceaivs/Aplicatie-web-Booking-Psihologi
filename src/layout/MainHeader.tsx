import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import classes from './MainHeader.module.css';
import {Link} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import {useContext} from 'react';
import { AuthContext } from '../components/utils/AuthContext';

export default function MainHeader() {
  const { user, isLoggedIn} = useContext(AuthContext);

    return (
    <>
    <Navbar bg="primary" variant="dark" className={classes.mainheader}>
        <Container>
        <Navbar.Brand >
            <Link to='/' className={classes.buttonLogo}>
                My Psiholog
            </Link>              
        </Navbar.Brand>
                {!isLoggedIn && 
                (
                <Nav >
                    <Nav.Link as={Link} to="/login">Log in</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </Nav>
                )}

                {/* {isLoggedIn && user?.user_type === 'client' &&  */}
              {isLoggedIn && 
                (
                <Nav >
                {user?.user_type === 'client' &&
                  <Nav.Link as={Link} to="/programariclient">Programari</Nav.Link>
                }
                    <Nav.Link as={Link} to="/cont">Cont</Nav.Link>
                    <Nav.Link as={Link} to="/logout">Log Out</Nav.Link>
                </Nav> 
                )}
        </Container>
    </Navbar>


</>
  );
}

  // if(response.data.user.poza){
                    //     const buffer = response.data.user.poza;
                    //     const poza = await convertBufferToURL(buffer);
                    //     const userCuPoza = {
                    //         ...response.data.user,
                    //         poza: poza
                    //     } 
                    //     setUser(userCuPoza);
                    // }

   //antirefresh
    // useEffect(() => {
    //     let isMounted = true;
    //     const checkStatus = async() => {
    //         await axios.get('http://localhost:3000/api/user/islogged', {
    //             headers:{
    //                 'Cookie':'MIRCEA-AUTH'
    //             },
    //             withCredentials: true
    //         }).then(response => {
    //             if(isMounted){
    //                 setUser(response.data.user);
    //                 setIsLoggedIn(response.data.logged);
    //             }
    //         })
    //         .catch(error => {
    //         console.log(error);
    //         });
    //     }
    //     if(isMounted){
    //         checkStatus();
    //     }
    //     return () => {
    //         isMounted = false;
    //     };
    // }, [setUser, setIsLoggedIn]);