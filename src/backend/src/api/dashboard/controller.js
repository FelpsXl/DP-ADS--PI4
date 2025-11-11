import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* =========================================================
   📊 DASHBOARD ADMINISTRADOR
========================================================= */
export async function getDashboardData(req, res) {
  try {
    console.log("📊 Gerando dados do dashboard admin...");

    const dias = parseInt(req.query.dias) || 30;
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    // --- ORDERS ---
    let orders = await prisma.order.findMany({
      where: { createdAt: { gte: dataInicio } },
    });

    // 🧠 Caso não existam pedidos recentes, carrega tudo
    if (orders.length === 0) {
      console.log("⚠️ Nenhum pedido recente — carregando todos os pedidos.");
      orders = await prisma.order.findMany();
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // --- LOJAS MAIS RENTÁVEIS ---
    const storeSales = {};
    for (const o of orders) {
      if (!o.storeName) continue;
      storeSales[o.storeName] =
        (storeSales[o.storeName] || 0) + (o.totalAmount || 0);
    }

    const topStores = Object.entries(storeSales)
      .map(([store, amount]) => ({ store, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // --- RECEITA MENSAL ---
    const monthlyRevenue = Array(12).fill(0);
    for (const o of orders) {
      if (o.createdAt) {
        const month = new Date(o.createdAt).getMonth();
        monthlyRevenue[month] += o.totalAmount || 0;
      }
    }

    const summary = {
      revenueMonth: totalRevenue,
      ordersYear: totalOrders,
      avgTicket,
      topStore: topStores[0]?.store || "N/A",
    };

    const revenueByMonth = monthlyRevenue.map((amount, i) => ({
      month: new Date(2025, i, 1).toLocaleString("pt-BR", { month: "short" }),
      amount,
    }));

    res.json({
      summary,
      revenueByMonth,
      topStores,
    });
  } catch (err) {
    console.error("❌ Erro no Dashboard Admin:", err);
    res.status(500).json({ error: "Erro ao gerar dashboard admin" });
  }
}

/* =========================================================
   🌿 DASHBOARD CLIENTE
========================================================= */
export async function getClientDashboard(req, res) {
  try {
    const { user } = req;

    if (!user || !user.email) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    console.log("📈 Gerando dashboard do cliente:", user.email);

    const dias = parseInt(req.query.dias) || 30;
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    const customer = await prisma.customer.findFirst({
      where: { customerEmail: user.email },
    });

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    let orders = await prisma.order.findMany({
      where: {
        customerEmail: user.email,
        createdAt: { gte: dataInicio },
      },
    });

    // 🧠 Caso o cliente não tenha pedidos recentes, pega todos
    if (orders.length === 0) {
      console.log("⚠️ Nenhum pedido recente — carregando histórico completo do cliente.");
      orders = await prisma.order.findMany({
        where: { customerEmail: user.email },
      });
    }

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;

    const monthlyData = Array(12).fill(0);
    for (const o of orders) {
      if (o.createdAt) {
        const month = new Date(o.createdAt).getMonth();
        monthlyData[month] += o.totalAmount || 0;
      }
    }

    const chartData = monthlyData.map((amount, i) => ({
      month: new Date(2025, i, 1).toLocaleString("pt-BR", { month: "short" }),
      amount,
    }));

    res.json({
      summary: {
        name: customer.name,
        totalOrders,
        totalSpent,
        avgTicket,
      },
      chartData,
    });
  } catch (err) {
    console.error("❌ Erro no Dashboard Cliente:", err);
    res.status(500).json({ error: "Erro ao gerar dashboard do cliente" });
  }
}
