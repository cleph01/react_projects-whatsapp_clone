import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "./utils/db/firebaseConfig";
import Login from "./pages/Login";
import Loading from "./components/Loading";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Helmet } from "react-helmet";

import Sidebar from "./components/Sidebar";
import ChatScreen from "./components/ChatScreen";

import styled from "styled-components";
import { Route } from "react-router-dom";

function App() {
    const [user, loading, error] = useAuthState(auth);
    const [openChatScreen, setOpenChatScreen] = useState(false);

    useEffect(() => {
        // if user is logged in, then merge that info with
        // what already exists instead of overwriting
        // if user not in db, then creates a new doc
        if (user) {
            const userRef = doc(db, "users", user.uid);
            setDoc(
                userRef,
                {
                    email: user.email,
                    lastSeen: serverTimestamp(),
                    photoURL: user.photoURL,
                },
                { merge: true }
            );
        }
    }, [user]);

    if (loading) return <Loading />;
    if (!user) return <Login />;

    console.log("Open Chat Scree: ", openChatScreen);
    return (
        <Container>
            <Helmet>
                <title>Tap-2-Reach | Keeping Your Customers Close</title>
            </Helmet>
            <Sidebar
                openChatScreen={openChatScreen}
                setOpenChatScreen={setOpenChatScreen}
            />
            <Route path="/chat/:chatId">
                <ChatContainer openChatScreen={openChatScreen}>
                    <ChatScreen
                        openChatScreen={openChatScreen}
                        setOpenChatScreen={setOpenChatScreen}
                    />
                </ChatContainer>
            </Route>
        </Container>
    );
}

export default App;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    transition: all 0.45s ease;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    @media (max-width: 375px) {
        position: fixed;
        width: 100%;
        left: ${(props) => (props.openChatScreen ? "0" : "100%")};
    }
`;

const Container = styled.div`
    display: flex;
    background-color: var(--chatscreen-bg-color);
`;
