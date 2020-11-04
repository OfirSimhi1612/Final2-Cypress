import styled from "styled-components";

export const Table = styled.table`
    overflow-x: scroll;
    border: 1px solid black;
    border-collapse: collapse;
` 

export const Td = styled.td`
    width: 70px;
    height: 30px;
    text-align: center;
    border: 1px solid black;
    background-color: ${props => {
        const state = props.theme.percents;
        switch(true){
            case state === 100:
                return `rgb(1, 73, 124, 0.7)`
            case state < 100 && state > 70:
                return `rgb(42, 111, 151, 0.7)`
            case state < 70 && state > 40:
                return `rgb(70, 143, 175, 0.7)`
            case state < 40 && state > 0:
                return `rgb(137, 194, 217, 0.7)`
            case state === 0:
                return `rgb(240, 240, 240)`
        }  
    }};
`

export const DatesTd = styled.td`
    width: 200px;
    height: 30px;
    font-weight: bold; 
    border: 1px solid black;
    padding: 3px;
`

export const Th = styled.th`
    font-weight: bold; 
    border: 1px solid black;
    padding: 3px
`