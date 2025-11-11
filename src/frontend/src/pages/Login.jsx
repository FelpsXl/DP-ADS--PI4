import React, { useState } from "react";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("cliente"); // padrão cliente
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // Cadastro
        await api.post("/auth/register", { name, email, password, role });
        alert("Usuário cadastrado com sucesso! Faça login.");
        setIsRegister(false);
      } else {
        // Login
        const res = await api.post("/auth/login", { email, password });
        console.log("Login response:", res.data);

        // ✅ Salva token corretamente
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);


        // ✅ Redireciona conforme o tipo de usuário
        if (res.data.role === "admin") {
            window.location.href = "/admin";
        } else {
            window.location.href = "/dashboard/cliente";
        }
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-box">li</div>
          <div className="logo-text">
            CANNOLI <br /> DASHBOARD
          </div>
        </div>

        <h1>{isRegister ? "Cadastre-se 📝" : "Bem-vindo 👋"}</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Tipo de conta</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "20px",
                  background: "#151c2a",
                  color: "white",
                  border: "none",
                }}
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Aguarde..." : isRegister ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        {isRegister ? (
          <a className="register" onClick={() => setIsRegister(false)}>
            Já tem uma conta? Faça login
          </a>
        ) : (
          <a className="register" onClick={() => setIsRegister(true)}>
            Cadastre-se aqui
          </a>
        )}
      </div>
    </div>
  );
}
