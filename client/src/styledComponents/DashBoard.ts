import styled from "styled-components"

export const LocationsDataDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 4;
    position: absolute;
    top: 10px;
    left: 10px;
    width: 550px;
    height: 250px;
    background-color : rgb(255,255,255,0.7);
    border: 2px solid grey;
    border-radius: 3%;

    @media (max-width: 1000px){
        display: none;
    } 
`