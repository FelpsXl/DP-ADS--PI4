import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import api from "../services/api";
import "../styles/Dashboard.css";

export default function DashboardLojas() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api.get("/orders").then((res) => setStores(res.data)).catch(console.error);
  }, []);

  if (!stores.length) return <div className="loading">Carregando...</div>;

  const storeTotals = {};
  stores.forEach((o) => {
    const store = o.storeName || "Desconhecida";
    storeTotals[store] = (storeTotals[store] || 0) + o.totalAmount;
  });

  const storesData = Object.entries(storeTotals)
    .map(([store, total]) => ({ store, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        <h2>🏬 Lojas e Canais de Venda</h2>

        <div className="chart-area">
          <Chart
            type="bar"
            height={350}
            series={[{ name: "Faturamento", data: storesData.map((s) => s.total) }]}
            options={{
              xaxis: { categories: storesData.map((s) => s.store), labels: { style: { colors: "#fff" } } },
              colors: ["#FF7A00"],
              theme: { mode: "dark" },
              plotOptions: { bar: { borderRadius: 6, horizontal: true } },
            }}
          />
        </div>
      </main>
    </div>
  );
}
