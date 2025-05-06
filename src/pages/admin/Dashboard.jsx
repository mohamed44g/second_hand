"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
} from "@mui/material";
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Gavel as GavelIcon,
} from "@mui/icons-material";
import UsersManagement from "../../components/admin/UsersManagement";
import OrdersManagement from "../../components/admin/OrdersManagement";
import SellersManagement from "../../components/admin/SellersManagement";
import ReportsManagement from "../../components/admin/ReportsManagement";
import axiosInstance from "../../api/axiosInstance";

// مكون لعرض بطاقة إحصائية
const StatCard = ({ icon, title, value, color }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.100`,
              borderRadius: "50%",
              p: 1,
              display: "flex",
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    total_users: 2,
    total_sellers: 1,
    total_sales: 10,
    total_revenue: 1000,
    total_ads_revenue: 500,
    total_products: 0,
    total_auctions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب إحصائيات النظام
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await axiosInstance.get("/admin/statistics");
  //       if (response.data.status === "success") {
  //         setStats(response.data.data);
  //       } else {
  //         setError("فشل في جلب إحصائيات النظام");
  //       }
  //     } catch (err) {
  //       setError(
  //         err.response?.data?.message || "حدث خطأ أثناء جلب إحصائيات النظام"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          لوحة التحكم
        </Typography>

        {/* بطاقات الإحصائيات */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<PeopleIcon sx={{ color: "primary.main" }} />}
              title="إجمالي المستخدمين"
              value={stats.total_users}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<StoreIcon sx={{ color: "secondary.main" }} />}
              title="إجمالي البائعين"
              value={stats.total_sellers}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<ShoppingCartIcon sx={{ color: "success.main" }} />}
              title="إجمالي المبيعات"
              value={stats.total_sales}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<MoneyIcon sx={{ color: "error.main" }} />}
              title="إجمالي الإيرادات"
              value={`${stats.total_revenue} ج.م`}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<MoneyIcon sx={{ color: "warning.main" }} />}
              title="إيرادات الإعلانات"
              value={`${stats.total_ads_revenue} ج.م`}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<InventoryIcon sx={{ color: "info.main" }} />}
              title="إجمالي المنتجات"
              value={stats.total_products}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              icon={<GavelIcon sx={{ color: "warning.main" }} />}
              title="إجمالي المزادات"
              value={stats.total_auctions}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* علامات التبويب */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="المستخدمين" />
            <Tab label="الطلبات" />
            <Tab label="البائعين" />
            <Tab label="البلاغات" />
          </Tabs>
        </Paper>

        {/* محتوى علامات التبويب */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <UsersManagement />}
          {activeTab === 1 && <OrdersManagement />}
          {activeTab === 2 && <SellersManagement />}
          {activeTab === 3 && <ReportsManagement />}
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
