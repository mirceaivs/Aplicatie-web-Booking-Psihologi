import Container from 'react-bootstrap/Container';
import MainHeader from './MainHeader';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../components/utils/AuthContext';
import { SuccessContextProvider } from '../components/utils/successContext';



export default function Layout() {
  return (
    <>

      <AuthProvider>
        <SuccessContextProvider>
          <MainHeader />
          <Container >
            <Outlet />
          </Container>
        </SuccessContextProvider>
      </AuthProvider>

    </>


  );
}
