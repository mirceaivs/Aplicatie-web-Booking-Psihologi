import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Login } from './components/Auth/Login.tsx';
import { Register } from './components/Auth/Register.tsx';
import { Logout } from './components/Auth/Logout.tsx';
import { PaginaCont } from './pages/PaginaCont.tsx';
import { VerificareMail } from './components/Auth/VerificareMail.tsx'
import { EmailVerificare } from './components/Auth/EmailVerificare.tsx'
import { SchimbareParola } from './components/Auth/SchimbareParola.tsx'
import { AdaugaCabinet } from './components/DetaliiPsiholog/AdaugaCabinet.tsx'
import { AdaugaSpecializare } from './components/DetaliiPsiholog/AdaugaSpecializare.tsx'
import { Cabinet } from './components/Cabinete/Cabinete.tsx'
import { StergereCabinet } from './components/Cabinete/StergereCabinet.tsx'
import { AdaugaServiciu } from './components/DetaliiPsiholog/AdaugaServiciu.tsx'
import { Servicii } from './components/Servicii&Specializari/Servicii.tsx'
import { Specializare } from './components/Servicii&Specializari/Specializari.tsx'
import { AdaugaProgram } from './components/DetaliiPsiholog/AdaugaProgram.tsx'
import { Program } from './components/Program/Program.tsx'
import { StergereProgram } from './components/Program/StergereProgram.tsx'
import { Home } from './pages/HomePage.tsx'
import { UserPage } from './components/User/User.tsx'
import { Programeazate } from './components/User/Programeazate.tsx'
import { ProgramariPsiholog } from './components/Programari/ProgramariPsiholog.tsx'
import { ProgramariClient } from './components/Programari/ProgramariClient.tsx'
import { StergereSpecializare } from './components/Servicii&Specializari/StergereSpecializari.tsx'
import { StergereServicii } from './components/Servicii&Specializari/StergereServicii.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/specializare/:id',
        element: <Specializare />,
      },
      {
        path: '/specializare/stergere/:id',
        element: <StergereSpecializare />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/logout',
        element: <Logout />
      },
      {
        path: '/emailverificare',
        element: <EmailVerificare />
      },
      {
        path: '/cont',
        element: <PaginaCont />,
        children: [
          {
            path: '/cont/create-cabinet',
            element: <AdaugaCabinet />,
          },
          {
            path: '/cont/cabinet/:id',
            element: <Cabinet />,
          },
          {
            path: '/cont/cabinet/stergere/:id',
            element: <StergereCabinet />,
          },
          {
            path: '/cont/create-specializare',
            element: <AdaugaSpecializare />,
          },
          {
            path: '/cont/specializare/:id',
            element: <Specializare />,
          },
          {
            path: '/cont/specializare/stergere/:id',
            element: <StergereSpecializare />,
          },
          {
            path: '/cont/create-serviciu/:id',
            element: <AdaugaServiciu />,
          },
          {
            path: '/cont/serviciu/:id',
            element: <Servicii />,
          },
          {
            path: '/cont/servicii/stergere/:id',
            element: <StergereServicii />,
          },
          {
            path: '/cont/create-program/',
            element: <AdaugaProgram />,
          },
          {
            path: '/cont/program/:id',
            element: <Program />,
          },
          {
            path: '/cont/program/stergere/:id',
            element: <StergereProgram />,
          },
        ]
      },
      {
        path: '/verificare',
        element: <VerificareMail />
      },
      {
        path: '/schimbareparola',
        element: <SchimbareParola />
      },
      {
        path: '/user/:id',
        element: <UserPage />,
        children: [
          {
            path: '/user/:id/programeazate',
            element: <Programeazate />,
          }
        ]
      },
      {
        path: '/programaripsiholog',
        element: <ProgramariPsiholog />

      },
      {
        path: '/programariclient',
        element: <ProgramariClient />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
