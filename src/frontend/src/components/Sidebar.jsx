import React from "react";
import { Home, BarChart3, ShoppingBag, Store, Clock, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard Geral", icon: <Home size={18} />, path: "/admin" },
    { name: "Faturamento", icon: <BarChart3 size={18} />, path: "/admin/faturamento" },
    { name: "Lojas", icon: <Store size={18} />, path: "/admin/lojas" },
    { name: "Tempo e Status", icon: <Clock size={18} />, path: "/admin/tempo" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo-fecap.png" alt="Logo" className="logo" />
        <h2>Cannoli</h2>
      </div>

      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.icon}
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="logout">
        <LogOut size={18} /> Sair
      </div>
    </aside>
  );
}
