import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Sidebar from "../components/Sidebar";
import ExportButtons from "../components/ExportButtons";
import api from "../services/api";
import "../styles/theme.css";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("30");

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await api.get(`/dashboard?dias=${periodo}`);
        setData(res.data);
      } catch (err) {
        console.error("❌ Erro ao carregar dashboard admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [periodo]);

  // ⚡ ALERTAS AUTOMÁTICOS
  useEffect(() => {
    if (data?.summary?.revenueMonth > 10000) {
      alert("🚀 Faturamento excelente neste mês!");
    } else if (data?.summary?.revenueMonth < 2000) {
      alert("⚠️ Faturamento abaixo da média. Verifique as lojas com baixa performance.");
    }
  }, [data]);

  if (loading) return <div className="loading">Carregando dados...</div>;
  if (!data) return <div className="error">Erro ao carregar dados.</div>;

  const { summary, topStores, revenueByMonth } = data;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">📊 Painel do Administrador</h1>
        <h2 className="dashboard-subtitle">
          Visão geral do desempenho da plataforma Cannoli
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
        <ExportButtons data={revenueByMonth} />

        {/* 🔸 KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card orange">
            <h3>💰 Receita (mês)</h3>
            <p>R$ {summary.revenueMonth?.toFixed(2) || "0,00"}</p>
          </div>
          <div className="kpi-card blue">
            <h3>📦 Pedidos (ano)</h3>
            <p>{summary.ordersYear || 0}</p>
          </div>
          <div className="kpi-card purple">
            <h3>🎟️ Ticket Médio</h3>
            <p>R$ {summary.avgTicket?.toFixed(2) || "0,00"}</p>
          </div>
          <div className="kpi-card green">
            <h3>🏪 Top Loja</h3>
            <p>{summary.topStore || "N/A"}</p>
          </div>
        </div>

        {/* 🔸 GRÁFICO DE RECEITA */}
        <div className="chart-full">
          <h3>📈 Receita Mensal</h3>
          <Chart
            type="line"
            height={350}
            options={{
              chart: { toolbar: { show: false } },
              stroke: { curve: "smooth", width: 3 },
              xaxis: {
                categories: revenueByMonth.map((r) => r.month),
                labels: { style: { colors: "#ccc" } },
              },
              yaxis: { labels: { style: { colors: "#ccc" } } },
              colors: ["#00E676"],
              theme: { mode: "dark" },
            }}
            series={[
              { name: "Faturamento", data: revenueByMonth.map((r) => r.amount) },
            ]}
          />
        </div>

        {/* 🔸 GRÁFICO DE LOJAS MAIS RENTÁVEIS */}
        <div className="chart-full">
          <h3>🏪 Lojas Mais Rentáveis</h3>
          <Chart
            type="bar"
            height={400}
            options={{
              chart: { toolbar: { show: false } },
              plotOptions: { bar: { horizontal: true, borderRadius: 6 } },
              xaxis: {
                categories: topStores.map((s) => s.store),
                labels: { style: { colors: "#ccc" } },
              },
              colors: ["#7C4DFF"],
              theme: { mode: "dark" },
            }}
            series={[{ name: "Faturamento", data: topStores.map((s) => s.amount) }]}
          />
        </div>
      </div>
    </div>
  );
}
