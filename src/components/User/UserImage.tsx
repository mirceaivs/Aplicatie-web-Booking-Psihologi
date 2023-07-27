import { Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Col from 'react-bootstrap/Col';
import { ImageRenderer } from '../utils/BufferToURL';
import { useEffect } from 'react';
import { User } from '../../models/models';
import axios from 'axios';


const UserImage: React.FC<{ user: User, isActualizat: any, setIsActualizat: any, imageBuffer: any, setImageBuffer: any }> = ({ user, isActualizat, setIsActualizat, imageBuffer, setImageBuffer }) => {




  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/poza/' + user.user_id, {
          withCredentials: true,
          responseType: 'arraybuffer'
        });
        setImageBuffer(response.data);

      } catch (error: any) {
        if (error.response) {
          const errorMessage = error.response.data.error;
          console.log(errorMessage);
        } else {
          console.log(error);
        }
      }
    }

    setIsActualizat(false);
    fetchImage();
  }, [])

  return (
    <>
      <Col xs={6} md={4}>
        {
          imageBuffer ?
            (<ImageRenderer imageBuffer={imageBuffer} rotunjit={true} />) : (<Image src='/blank-user.jpg' roundedCircle />)
        }
      </Col>

    </>

  )
};


export default UserImage;


