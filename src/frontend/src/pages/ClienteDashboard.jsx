import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Sidebar from "../components/Sidebar";
import ExportButtons from "../components/ExportButtons";
import api from "../services/api";
import "../styles/theme.css";

export default function ClienteDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("30"); // 🕒 padrão: últimos 30 dias

  useEffect(() => {
    async function loadClientData() {
      try {
        const res = await api.get(`/client-dashboard?dias=${periodo}`);
        setData(res.data);
      } catch (err) {
        console.error("❌ Erro ao carregar dashboard do cliente:", err);
      } finally {
        setLoading(false);
      }
    }
    loadClientData();
  }, [periodo]);

  // 🚨 ALERTAS INTELIGENTES
  useEffect(() => {
    if (data?.summary?.avgTicket > 100) {
      alert("🚀 Seu ticket médio está excelente! Continue assim!");
    } else if (data?.summary?.avgTicket < 50) {
      alert("⚠️ Seu ticket médio caiu, verifique seus pedidos recentes!");
    }
  }, [data]);

  if (loading) return <div className="loading">Carregando dados...</div>;
  if (!data) return <div className="error">Erro ao carregar dados.</div>;

  const { summary, chartData } = data;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">🌿 Painel do Cliente</h1>
        <h2 className="dashboard-subtitle">
          Bem-vindo(a), <strong>{summary.name}</strong>!
        </h2>

        {/* 🔸 FILTRO DE PERÍODO */}
        <div style={{ marginBottom: "20px" }}>
          <label>Filtrar por período: </label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              background: "#1c1f26",
              color: "#fff",
              border: "1px solid #444",
              marginLeft: "8px",
            }}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Último ano</option>
          </select>
        </div>

        {/* 🔸 BOTÕES DE EXPORTAÇÃO */}
        <ExportButtons data={chartData} />

        {/* KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card orange">
            <h3>💸 Total Gasto</h3>
            <p>R$ {summary.totalSpent?.toFixed(2) || "0,00"}</p>
          </div>
          <div className="kpi-card blue">
            <h3>📦 Pedidos</h3>
            <p>{summary.totalOrders || 0}</p>
          </div>
          <div className="kpi-card purple">
            <h3>🎟️ Ticket Médio</h3>
            <p>R$ {summary.avgTicket?.toFixed(2) || "0,00"}</p>
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="chart-full">
          <h3>📊 Gastos Mensais</h3>
          <Chart
            type="area"
            height={350}
            options={{
              chart: { toolbar: { show: false } },
              theme: { mode: "dark" },
              dataLabels: { enabled: false },
              stroke: { curve: "smooth" },
              xaxis: {
                categories: chartData.map((d) => d.month),
                labels: { style: { colors: "#ccc" } },
              },
              yaxis: {
                labels: { style: { colors: "#ccc" } },
              },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.6,
                  opacityTo: 0.05,
                  stops: [0, 90, 100],
                },
              },
              colors: ["#00E676"],
            }}
            series={[
              {
                name: "Gastos (R$)",
                data: chartData.map((d) => d.amount),
              },
            ]}
          />
        </div>

        {/* TABELA DE PEDIDOS */}
        <div className="list-box">
          <h3>🧾 Seus últimos pedidos</h3>
          {summary.totalOrders > 0 ? (
            <table className="table-orders">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Loja</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.min(5, summary.totalOrders) }).map(
                  (_, i) => (
                    <tr key={i}>
                      <td>#{1000 + i}</td>
                      <td>Loja Exemplo {i + 1}</td>
                      <td>Entregue</td>
                      <td>R$ {(summary.avgTicket || 0).toFixed(2)}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="no-orders">Nenhum pedido recente encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
