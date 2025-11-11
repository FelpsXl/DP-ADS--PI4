import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import api from "../services/api";
import "../styles/Dashboard.css";

export default function DashboardFaturamento() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="loading">Carregando...</div>;

  const { summary, revenueByMonth } = data;
  const toBRL = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="dashboard-wrapper">
      <Sidebar />

      <main className="dashboard-main">
        <h2>📊 Faturamento e Histórico</h2>

        <div className="cards">
          <div className="card"><h4>💰 Receita no Mês</h4><strong>{toBRL(summary.revenue_month)}</strong></div>
          <div className="card"><h4>📦 Pedidos Totais</h4><strong>{summary.orders_year_to_date}</strong></div>
          <div className="card"><h4>🎟 Ticket Médio</h4><strong>{toBRL(summary.avg_ticket)}</strong></div>
          <div className="card"><h4>🏪 Melhor Loja</h4><strong>{summary.top_store.store}</strong></div>
        </div>

        <div className="chart-area">
          <h3>📈 Evolução do Faturamento</h3>
          <Chart
            type="area"
            height={320}
            series={[{ name: "Faturamento", data: revenueByMonth.map((r) => r.amount) }]}
            options={{
              xaxis: { categories: revenueByMonth.map((r) => r.month), labels: { style: { colors: "#fff" } } },
              yaxis: { labels: { style: { colors: "#fff" } } },
              fill: { type: "gradient", gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
              colors: ["#00E676"],
              theme: { mode: "dark" },
              grid: { borderColor: "#222" },
            }}
          />
        </div>
      </main>
    </div>
  );
}
