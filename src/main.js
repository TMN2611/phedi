var express = require('express');
var morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');
require('dotenv').config();
const cors = require("cors");
const port = 3000;

const app = express();

const route = require('./routes');

const db = require('./config/db');

// middleware để xử lý việc gửi dữ liệu từ form

app.use(express.urlencoded({ extended: true }));

// middleware để xử lý việc gửi dữ liệu từ client bằng các cách như XmlHttp , Fetch, Axios

app.use(express.json());

// Static file
app.use(express.static(path.join(__dirname, 'public/')));

// logger mogan
app.use(morgan('dev'));

//New imports
// const http = require('http').Server(app);
//Pass the Express app into the HTTP module.
// ✅ Khởi tạo HTTP Server đúng cách
const http = require('http');
const server = http.createServer(app);

// ✅ Tạo WebSocket Server
const { Server } = require("socket.io");
// ✅ Thêm cấu hình CORS
const io = new Server(server, {
  cors: {
      origin: "*", // Chấp nhận mọi domain (có thể thay bằng "http://127.0.0.1:3000" để an toàn hơn)
      methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log("🔌 Có người kết nối:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Ngắt kết nối:", socket.id);
    });
});

// ✅ Template Engine
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

// template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

//  Routes init
route(app);

// conectDB
db.connect();

// env





app.listen(port, () => {
  console.log('Listen in 127.0.0.1:3000');
});
