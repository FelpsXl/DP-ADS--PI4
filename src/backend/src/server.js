import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./api/auth/router.js";
import ordersRouter from "./api/orders/router.js";
import dashboardRouter from "./api/dashboard/router.js";
import clientDashboardRouter from "./api/clientDashboard/router.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();

// 🔹 Middlewares globais
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 🔹 Rotas públicas (sem autenticação)
app.use("/auth", authRouter);

// 🔹 Rotas protegidas (precisam do token JWT)
app.use("/orders", verifyToken, ordersRouter);
app.use("/dashboard", dashboardRouter); // admin
// 🔓 Cliente sem autenticação (para testes e apresentação)
app.use("/client-dashboard", clientDashboardRouter);
 

// 🔹 Teste de autenticação
app.get("/dashboard-test", verifyToken, (req, res) => {
  res.json({
    message: `Bem-vindo ao Dashboard, ${req.user.name}!`,
    role: req.user.role,
  });
});

// 🔹 Rota base
app.get("/", (req, res) => {
  res.send("🚀 API Cannoli rodando com autenticação JWT!");
});

// 🔹 Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
);
