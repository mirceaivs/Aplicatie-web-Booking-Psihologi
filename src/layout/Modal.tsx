import classes from './Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Modal = (props: any) => {
    const navigate = useNavigate();
    const [modalAnimation, setModalAnimation] = useState(false);
    function closeHandler() {
        // navigate('..');//sau / pt pagina principala 
        setModalAnimation(false);
        navigate('..');
    }

    useEffect(() => {
        setModalAnimation(true);

        return () => {
            setModalAnimation(false);
        };
    }, []);

    return (
        <>
            <div className={classes.backdrop} onClick={closeHandler}></div>
            <dialog open className={`${classes.modal} ${modalAnimation ? classes.fadeIn : ''}`} style={{ padding: '20px' }}>
                {props.children}
            </dialog>


        </>
    );
}