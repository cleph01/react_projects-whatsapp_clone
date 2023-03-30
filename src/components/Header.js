import { useParams } from "react-router-dom";
import { ArrowBackIosNew, AttachFile, MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import styled from "styled-components";
import { doc } from "firebase/firestore";
import { db } from "../utils/db/firebaseConfig";

import { useDocument } from "react-firebase-hooks/firestore";
import Recipient from "./Recipient";

const Header = ({ openChatScreen, setOpenChatScreen }) => {
    const { chatId } = useParams();

    const [chat, loading, error] = useDocument(doc(db, `chats`, chatId));

    if (error) {
        return <strong>Error: {JSON.stringify(error)}</strong>;
    }

    if (loading) {
        return <span>Document: Loading...</span>;
    }

    return (
        <HeaderContainer>
            {openChatScreen && (
                <ArrowBackIosNew
                    onClick={() => setOpenChatScreen((prev) => !prev)}
                    sx={{ fontSize: "1.5rem", display: "none" }}
                />
            )}
            {chat?.data() && <Recipient chat={chat.data()} />}
            <HeaderIcons>
                <IconButton>
                    <AttachFile />
                </IconButton>
                <IconButton>
                    <MoreVert />
                </IconButton>
            </HeaderIcons>
        </HeaderContainer>
    );
};

export default Header;

const HeaderIcons = styled.div`
    > .MuiButtonBase-root > .MuiSvgIcon-root {
        font-size: var(--icon-font-size);
    }
`;

const HeaderContainer = styled.div`
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 100;
    display: flex;
    padding: 1.1rem;
    height: 8rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid whitesmoke;

    > .MuiSvgIcon-root[data-testid="ArrowBackIosNewIcon"] {
        @media (max-width: 375px) {
            display: inline-block;
        }
    }
`;
