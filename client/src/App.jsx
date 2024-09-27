 

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ bgcolor: "#f0f4f8", padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, bgcolor: "#ffffff" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold" }}>
            Chat Application
          </Typography>
        </Box>

        <form onSubmit={joinRoomHandler}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1976d2" }}>
            Join Room
          </Typography>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
            Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="Message"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            id="outlined-basic"
            label="Room"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
            Send
          </Button>
        </form>

        <Stack spacing={2}>
          {messages.map((m, i) => (
            <Typography key={i} variant="body1" sx={{ bgcolor: "#e3f2fd", padding: 1, borderRadius: 1 }}>
              {m}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default App;
 