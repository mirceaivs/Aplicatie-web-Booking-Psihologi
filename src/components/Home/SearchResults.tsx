import { useEffect, useState } from 'react';
import { ListGroup, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchResults.css';
export const SearchResults = ({ searchTerm, localitate, judet }: any) => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        setIsLoading(true);
        const formData = new FormData();
        formData.append('localitate', localitate);
        formData.append('judet', judet);
        axios.post(`http://localhost:3000/api/user/search/?q=${searchTerm}`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setResults(response.data);
                setIsLoading(false);
                // setShouldSearch(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
                // setShouldSearch(false);
            });

    }, [searchTerm, localitate, judet]);

    return (
        <Container>
            {isLoading ? (
                <Alert variant="info">Loading...</Alert>
            ) : (
                results.length > 0 ? (
                    <ListGroup className="rounded border mt-2 ">
                        {results.map((user: any, index) => (
                            <ListGroup.Item key={index} className='border-bottom '>
                                <Link to={`/user/${user.user_id}`} className='link-unstyled' >
                                    <p className='mb-0'>
                                        {user.nume} {user.prenume}
                                    </p>
                                </Link>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="danger"> Nu au fost gasiti psihologi!</Alert>
                )
            )}
        </Container>
    );
};

