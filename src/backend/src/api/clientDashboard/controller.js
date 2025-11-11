import prisma from "../../../prismaClient.js";

export async function getClientDashboardData(req, res) {
  try {
    const userEmail = req.user.email;

    const orders = await prisma.order.findMany({
      where: { customerEmail: userEmail },
      select: { totalAmount: true, createdAt: true, storeName: true },
    });

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;

    res.json({
      summary: {
        name: req.user.name,
        totalSpent,
        totalOrders,
        avgTicket,
      },
      chartData: orders.map((o) => ({
        month: new Date(o.createdAt).toLocaleString("pt-BR", { month: "short" }),
        amount: o.totalAmount,
      })),
    });
  } catch (error) {
    console.error("❌ Erro ao gerar dashboard do cliente:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }

  const dias = parseInt(req.query.dias) || 30;
const dataInicio = new Date();
dataInicio.setDate(dataInicio.getDate() - dias);

const orders = await prisma.order.findMany({
  where: {
    customerEmail: userEmail,
    createdAt: { gte: dataInicio },
  },
  select: { totalAmount: true, createdAt: true, storeName: true },
});
    
}
