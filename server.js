const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/post');

const app = express();
const PORT = 3001;

// app.use(express.static('public'))

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`🐇 BunnyLike 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
})