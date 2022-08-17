import React, {useEffect, useState} from 'react';
import './App.css';
import {Button, Modal, Typography} from "@mui/material";

interface BreedDataItem {
    name: string;
    subBreeds: Array<string>
}

const Dogs = () => {
    const [listOfBreeds, setListOfBreeds] = useState<Array<BreedDataItem>>([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [selectedBreedData, setSelectedBreedData] = useState('');

    const handleSelectBreed = (name: string) => () => setSelectedBreed(name);
    const handleCloseModal = () => {
        setSelectedBreed('');
        setSelectedBreedData('');
    };

    useEffect(() => {
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(response => response.json())
            .then(({message}) => {
                setListOfBreeds(Object.keys(message).map(item => {
                    return {name: item, subBreeds: message[item]}
                }));
            })
            .catch(error => console.log(error));

    }, []);


    useEffect(() => {
        if (!!selectedBreed) {
            fetch(`https://dog.ceo/api/breed/${selectedBreed}/images`)
                .then(response => response.json())
                .then(({message}) => {
                    setSelectedBreedData(message[Math.floor(Math.random() * message.length)] as string)
                })
                .catch(error => console.log(error));
        }
    }, [selectedBreed])

    return (<div>
        <Modal open={!!selectedBreed}>
            <div className="Modal-body">
                <Typography variant={'h5'}>
                    {selectedBreed}
                </Typography>
                <img src={selectedBreedData} alt="selectedBreed"/>
                <div><Button onClick={handleCloseModal}>close</Button></div>
            </div>
        </Modal>
        <Typography variant={'h2'}>
            Dog breeds
        </Typography>
        <Typography variant={'h5'}>
            Press any for details
        </Typography>
        <div>{listOfBreeds.map(item => <Button onClick={handleSelectBreed(item.name)}>{item.name}</Button>)}</div>
    </div>)
}

function App() {
    return (
        <div className="App">
            <Dogs/>
        </div>
    );
}

export default App;
