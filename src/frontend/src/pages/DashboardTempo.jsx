import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import api from "../services/api";
import "../styles/Dashboard.css";

export default function DashboardTempo() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data)).catch(console.error);
  }, []);

  if (!orders.length) return <div className="loading">Carregando...</div>;

  const avgPrepTime =
    orders.reduce((acc, o) => acc + (o.preparationTime || 0), 0) / orders.length;

  const statusCount = {};
  orders.forEach((o) => {
    const status = o.status || "Sem status";
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        <h2>⏱️ Tempo de Entrega e Status</h2>

        <div className="cards">
          <div className="card"><h4>🕒 Tempo médio</h4><strong>{avgPrepTime.toFixed(1)} min</strong></div>
          <div className="card"><h4>📦 Pedidos analisados</h4><strong>{orders.length}</strong></div>
        </div>

        <div className="chart-area">
          <Chart
            type="pie"
            height={340}
            series={Object.values(statusCount)}
            options={{
              labels: Object.keys(statusCount),
              colors: ["#00E676", "#FF7A00", "#F44336", "#2196F3"],
              legend: { labels: { colors: "#fff" } },
              theme: { mode: "dark" },
            }}
          />
        </div>
      </main>
    </div>
  );
}
