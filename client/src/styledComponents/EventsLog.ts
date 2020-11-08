import styled from "styled-components";

export const EventDetail = styled.div`
  display: flex;
`;

export const Wraper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
`;

export const LogTile = styled.div`
  display: flex;
  gap: 30px;
  padding: 5px;
  height: 100%;
`;

export const AccordionHead = styled.div`
  display: flex;
  gap: 10px;
`;

export const EeventAccordion = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

interface UserColorProps {
    userId: string;
}

function getUserColor(userId: string): string {
let count: number = 0;
for(let i = 0; i < userId.length; i++){
    count += userId.charCodeAt(i)
}

const red = (count * 1934 + 100) % 256;
const green = (count * 5188 + 200) % 256;
const blue = (count * 1312 + 100) % 256;

return `rgb(${red},${green},${blue},0.9)`;
}

export const UserColor = styled.div<UserColorProps>`
  background-color: ${(props) => getUserColor(props.userId)};
  border-radius: 100%;
  width: 30px;
  height: 30px;
`;
