import { io } from 'socket.io-client';
import {} from "dotenv/config";
import chalk from "chalk";

// ------------------ SOCKET ------------------
const socket = io.connect('ws://mission-commander-service:3006');

socket.on('connect', () => {
    console.log('Connected to socket.io');
})

socket.on('disconnect', () => {
    console.log('Disconnected from socket.io');
});

socket.on('logs', (data) => {
    console.log("receiving logs")
    console.log(chalk.green(data));
})