const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/post');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3001;

// app.use(express.static('public'))

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);


// Swagger 옵션 정의
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BunnyLike API',
            version: '1.0.0',
            description: 'BunnyLike 프로젝트를 위한 API 명세서',
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// swagger UI 라우터 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 서버 시작
app.listen(PORT, () => {
    console.log(`🐇 BunnyLike 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
})