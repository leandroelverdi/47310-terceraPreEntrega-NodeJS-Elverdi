import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { productManager } from "./ProductManager.js";
import viewsRouter from "./router/views.router.js";
import chatRouter from "./router/chat.router.js";
import "./Dao/db/config.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/", viewsRouter);
app.use("/chat", chatRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`listening in port: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("client conected");

  socket.on("createProduct", async (product) => {
    const newProduct = await productManager.addProduct(product);
    socket.emit("productCreated", newProduct);
  });
});
