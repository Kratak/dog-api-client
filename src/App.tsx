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
    const [randomImageNumber, setRandomImageNumber] = useState<null | number>(null);
    const [selectedBreedData, setSelectedBreedData] = useState<Array<string>>([]);

    const handleSelectBreed = (name: string) => () => setSelectedBreed(name);
    const handleCloseModal = () => {
        setSelectedBreed('');
        setRandomImageNumber(null);
        setSelectedBreedData([]);
    };
    const handleSetRandomImageNumber = () => setRandomImageNumber(Math.floor(Math.random() * selectedBreedData.length));


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
                    setRandomImageNumber(Math.floor(Math.random() * message.length));
                    setSelectedBreedData(message)
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
                {!!selectedBreedData && randomImageNumber !== null ?
                    <img src={selectedBreedData[randomImageNumber]} alt="selectedBreed"/> :
                    <span>loading image...</span>}
                <div><Button onClick={handleSetRandomImageNumber}>Another image</Button></div>
                <div><Button onClick={handleCloseModal}>close</Button></div>
            </div>
        </Modal>
        <Typography variant={'h2'}>
            Dog breeds
        </Typography>
        <Typography variant={'h5'}>
            Press any for details
        </Typography>
        <div>{listOfBreeds.map(item => <Button key={item.name}
                                               onClick={handleSelectBreed(item.name)}>{item.name}</Button>)}</div>
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
