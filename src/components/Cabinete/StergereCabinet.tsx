import { useNavigate, useParams } from 'react-router-dom';
import { SuccessContext } from '../utils/successContext';
import { useContext, useEffect } from 'react';
import axios from 'axios';


export const StergereCabinet = () => {
    const { setSuccess } = useContext(SuccessContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const stergereCabinet = async () => {
            try {
                await axios.delete('http://localhost:3000/api/user/cabinete/delete/' + id, {
                    withCredentials: true
                });
                setSuccess(true);

            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response.data.error;
                    console.log(errorMessage);
                } else {
                    console.log(error);
                }
            }
        }

        stergereCabinet();
        navigate('/cont');
    }, [])

    return null;

}

