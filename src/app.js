//=====================================================Imported Zone
const express = require("express")
const dotenv = require("dotenv")
const http = require("http")

//=====================================================local imported Zone

const restApiServer = require("./server/rest")

//=====================================================Constance Zone
dotenv.config({ path: "./.env" })
const host = process.env.HOST || "localhost"
const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)

//=====================================================Main Functions

restApiServer(app)

//
//
//
// const cors = require("cors")
// const { Server } = require("socket.io")
// const chat = express()
// const chatServer = http.createServer(chat)
// const io = new Server(chatServer, {
//     cors: {
//         origin: ["http://localhost:5173"],
//         credentials: true,
//         methods: ["GET", "POST"],
//     },
// })
// chat.use(cors())
// io.on("connection", (socket) => {
//     console.log("a user connected")
// })
// const onlineUser = {}
// io.use((socket, next) => {
//     const userId = socket.handshake.auth.sender
//     // console.log(socket.handshake.auth)
//     // const roomId = socket.handshake.auth.room
//     onlineUser[userId] = socket.id
//     // onlineUser[roomId] = socket.id
//     next()
// })
// io.on("connection", (socket) => {
//     console.log(onlineUser, "check online user")
//     //
//     socket.on("message", (msg) => {
//         console.log(msg, "message")
//         console.log(socket.handshake.auth.sender, "auth")
//         io.to([onlineUser[socket.handshake.auth.sender], onlineUser[msg.received]]).emit("received", {
//             ...msg,
//             received: socket.handshake.auth.sender,
//         })
//     })

//     console.log("a user connected")
//     socket.on("disconnect", () => {
//         console.log("user disconnected")
//     })
// })
// chat.get("/", () => {
//     console.log("first")
// })
// chatServer.listen(8888, () => console.log(8888, "port"))
//
//

//=====================================================Listening Zone
console.log(`API DOCS ON:  http://${host}:${port}/docs`)
server.listen(+port, host, () => {
    console.log(`Server is running at http://${host}:${port}`)
})
