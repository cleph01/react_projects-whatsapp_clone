import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import whatsapp from "../images/logo/whatsapp.png";

const Loading = () => {
    return (
        <center
            style={{ display: "grid", placeItems: "center", height: "100vh" }}
        >
            <div>
                <LoadingImage src={whatsapp} alt="" priority />
                <CircularProgress
                    sx={{
                        display: "block",
                        color: "#3CBC28",
                        fontSize: "6rem",
                    }}
                />
            </div>
        </center>
    );
};

export default Loading;

const LoadingImage = styled.img`
    margin-bottom: 1rem;
    width: 20rem;
    height: 20rem;
`;
