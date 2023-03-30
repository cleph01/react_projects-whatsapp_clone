import { InsertEmoticon, Mic } from "@mui/icons-material";

import {
    collection,
    query,
    orderBy,
    doc,
    serverTimestamp,
    writeBatch,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../utils/db/firebaseConfig";

import ChatMessage from "./ChatMessage";

import Header from "./Header";

const ChatScreen = ({ openChatScreen,setOpenChatScreen }) => {
    const [user] = useAuthState(auth);
    const { chatId } = useParams();
    const endOfMessagesRef = useRef();
    const [input, setInput] = useState("");

    const msgQuery = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy("timestamp", "asc")
    );
    const [messagesSnapshot] = useCollection(msgQuery);

    // scroll to bottom after ever sent message
    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Handle the submitting of message
    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            const batch = writeBatch(db);

            // Updates the lastSeen
            const usersRef = doc(db, `users/${user.uid}`);

            batch.set(
                usersRef,
                {
                    lastSeen: serverTimestamp(),
                },
                { merge: true }
            );

            // Since we don't have a doc id to set, we have to generate
            // a new id; so we use the doc(collection()) vs. the doc(db, path)
            // format above

            // sends message
            const messagesRef = doc(collection(db, `chats/${chatId}/messages`));

            batch.set(messagesRef, {
                timestamp: serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL,
            });

            await batch.commit();
            // Reset input field
            setInput("");
            // Scroll to the Bottom
            scrollToBottom();
        } catch (error) {
            console.log("error sending message: ", error);
        }
    };

    return (
        <Container>
            <Header openChatScreen={openChatScreen} setOpenChatScreen={setOpenChatScreen} />

            <MesssageContainer>
                {messagesSnapshot?.docs.map((message) => (
                    <ChatMessage
                        key={message.id}
                        user={message.data().user}
                        message={{
                            ...message.data(),
                            timestamp: Date(
                                message.data().timestamp
                            ).toLocaleString(),
                        }}
                    />
                ))}
                <EndOfMessage ref={endOfMessagesRef} />
            </MesssageContainer>

            <InputContainer>
                <InsertEmoticon />
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    hidden
                    disabled={!input}
                    onClick={sendMessage}
                >
                    Send Message
                </button>
                <Mic />
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background: whitesmoke;
    padding: 1rem;
    margin: 0 1.5rem 0;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;

    padding: 1rem;
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 100;
`;

const EndOfMessage = styled.div`
    margin-bottom: 5rem;
`;

const MesssageContainer = styled.div`
    padding: 0.5rem 0.1rem 0;
    background: var(--chatscreen-bg-color);
    min-height: 90vh;
`;

const Container = styled.div``;
