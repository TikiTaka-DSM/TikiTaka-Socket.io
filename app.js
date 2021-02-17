const express = require('express');
const http = require('http');
const socket = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// const BASE_URL = "http://localhost:5000"
const BASE_URL = "http://54.180.2.226:5000"

const MessageType = {
    "message": "text",
    "photo": "png",
    "voice": "mp3"
};

const postMessageData = async (jsonData) => {
    res = await axios.post(BASE_URL+'/chat/message', jsonData);

    return res.data;
};


io.on('connection', socket => {
    console.log('[LOG] Connect 이벤트');
    
    socket.on('test', () => {
        console.log('[LOG] test');
        socket.emit('test', "test");
    });

    socket.on('joinRoom', (data) => {
        roomId = data['roomId']

        socket.join(roomId.toString());
        console.log(`[LOG] Join 이벤트 : ${roomId}`);
    })

    socket.on('sendMessage', async (data) => {
        console.log(`[LOG] 메시지 이벤트 : ${data['message']}`);

        jsonData = {
            "roomId": data['roomId'],
            "token": data['token'],
            "content": data['message'],
            "type": MessageType.message
        };

        messageData = await postMessageData(jsonData);
        socket.broadcast.to(data['roomId'].toString()).emit('realTimeChatting', messageData);

        console.log(`[LOG] ${data['roomId']} 에서 실시간 채팅 이벤트`);
        console.log(messageData)
    });

    socket.on('sendImage', async (data) => {
        console.log(`[LOG] ${data['roomId']} 방에서 이미지 전송됨`);

        jsonData = {
            "roomId": data['roomId'],
            "token": data['token'],
            "content": data['message'],
            "type": MessageType.photo
        };

        messageData = await postMessageData(jsonData);
        socket.broadcast.to(data['roomId'].toString()).emit('realTimeChatting', messageData);

        console.log(`[LOG] ${data['roomId']} 에서 실시간 채팅 이벤트`);
        console.log(messageData)
    });
});


server.listen(3000, () => {
    console.log('server on 3000')
});






 
