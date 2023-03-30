import { Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { db, auth } from "../utils/db/firebaseConfig";
import { getRecipientEmail } from "../utils/lib/chatModel";

import { useHistory } from "react-router-dom";

const Message = ({ id, users, setOpenChatScreen }) => {
    // router to be used in the onClick to push the user
    // to the new route
    const history = useHistory();

    const [user] = useAuthState(auth);

    // getRecipientEmain in utils/lib/chatModel
    const q = query(
        collection(db, "users"),
        where("email", "==", getRecipientEmail(users, user))
    );
    const [recipientSnapshot] = useCollection(q);
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);
    // ------------- //

    const enterChat = () => {
        setOpenChatScreen((prev) => !prev);
        history.push(`/chat/${id}`);
    };

    return (
        <Container onClick={() => enterChat()}>
            {recipient ? (
                <UserAvatar
                    src={recipient?.photoURL}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <UserAvatar>{recipientEmail}</UserAvatar>
            )}

            <p>{recipientEmail}</p>
        </Container>
    );
};

export default Message;

const UserAvatar = styled(Avatar)`
    margin: 0.5rem 2rem 0 0;
`;
const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 1.5rem;
    word-break: break-word;

    :hover {
        background-color: var(--msg-bg-color);
    }

    > p {
        font-size: var(--font-size);
    }
`;
