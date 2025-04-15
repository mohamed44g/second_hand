"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  PeopleAlt as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Store as SellersIcon,
  AttachMoney as MoneyIcon,
  Devices as DevicesIcon,
  Gavel as AuctionIcon,
} from "@mui/icons-material";
import UsersManagement from "../../components/admin/UsersManagement";
import OrdersManagement from "../../components/admin/OrdersManagement";
import SellersManagement from "../../components/admin/SellersManagement";
import { fakeDashboardStats } from "../../data/fakeAdminData";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // استخدام البيانات الوهمية
  const stats = fakeDashboardStats;

  // بطاقات الإحصائيات
  const statCards = [
    {
      title: "المستخدمين",
      value: stats.totalUsers,
      icon: <PeopleIcon fontSize="large" sx={{ color: "primary.main" }} />,
      color: "#ff8c00",
    },
    {
      title: "التجار",
      value: stats.totalSellers,
      icon: <SellersIcon fontSize="large" sx={{ color: "info.main" }} />,
      color: "#0288d1",
    },
    {
      title: "الطلبات",
      value: stats.totalOrders,
      icon: <OrdersIcon fontSize="large" sx={{ color: "success.main" }} />,
      color: "#2e7d32",
    },
    {
      title: "الإيرادات",
      value: `${stats.totalRevenue.toLocaleString()} ج.م`,
      icon: <MoneyIcon fontSize="large" sx={{ color: "warning.main" }} />,
      color: "#ed6c02",
    },
    {
      title: "المنتجات",
      value: stats.totalProducts,
      icon: <DevicesIcon fontSize="large" sx={{ color: "secondary.main" }} />,
      color: "#9c27b0",
    },
    {
      title: "المزادات",
      value: stats.totalAuctions,
      icon: <AuctionIcon fontSize="large" sx={{ color: "error.main" }} />,
      color: "#d32f2f",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        لوحة التحكم
      </Typography>

      {/* بطاقات الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                {card.icon}
                <Typography
                  variant="h4"
                  component="div"
                  fontWeight="bold"
                  sx={{ my: 2 }}
                >
                  {card.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* التبويبات */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
          centered
        >
          <Tab
            label="إدارة المستخدمين"
            icon={<PeopleIcon />}
            iconPosition="start"
          />
          <Tab
            label="إدارة الطلبات"
            icon={<OrdersIcon />}
            iconPosition="start"
          />
          <Tab
            label="إدارة التجار"
            icon={<SellersIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* محتوى التبويبات */}
      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0">
        {tabValue === 0 && <UsersManagement />}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1">
        {tabValue === 1 && <OrdersManagement />}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2">
        {tabValue === 2 && <SellersManagement />}
      </Box>
    </Container>
  );
};

export default Dashboard;
