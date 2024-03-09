const express = require("express")
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
const prisma = require("../config/prisma")
// const chat = express()
// const chatServer = http.createServer(chat)

exports.restApiServerChat = (chat, chatServer) => {
    const io = new Server(chatServer, {
        cors: {
            origin: ["http://localhost:5173"],
            credentials: true,
            methods: ["GET", "POST"],
        },
    })
    chat.use(cors())
    io.on("connection", (socket) => {
        console.log("a user connected")
    })
    const onlineUser = {}
    io.use((socket, next) => {
        const userId = socket.handshake.auth.sender
        // console.log(socket.handshake.auth)
        // const roomId = socket.handshake.auth.room
        onlineUser[userId] = socket.id
        // onlineUser[roomId] = socket.id
        next()
    })
    io.on("connection", (socket) => {
        console.log(onlineUser, "check online user")
        //
        socket.on("message", async (msg) => {
            console.log(msg, "message")
            console.log(socket.handshake.auth.sender, "auth")

            const { userId, restaurantId, message, role } = msg
            const data = await prisma.chat.create({ data: { userId, restaurantId, message, sender: role } })
            console.log("data", data)
            console.log("onlineUser", onlineUser)
            io.to([onlineUser[socket.handshake.auth.sender], onlineUser[msg.received]]).emit("received", {
                ...msg,
                received: socket.handshake.auth.sender,
                ...data,
            })
        })

        console.log("a user connected")
        socket.on("disconnect", () => {
            console.log("user disconnected")
        })
    })
    chat.get("/", () => {
        console.log("first")
    })
    // chatServer.listen(8888, () => console.log(8888, "port"))
}
