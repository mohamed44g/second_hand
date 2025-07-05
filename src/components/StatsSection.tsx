import { People, Inventory2, Store, LocalShipping } from "@mui/icons-material";
import { Box, Container, Typography, Grid } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export default function StatsSection() {
  const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasAnimated = useRef(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      const currentRef = countRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, []);

    useEffect(() => {
      if (!isVisible || hasAnimated.current) return;

      let startTime;
      let animationFrameId;

      const startCount = 0;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(
          progress * (end - startCount) + startCount
        );

        setCount(currentCount);

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(step);
        } else {
          hasAnimated.current = true;
        }
      };

      animationFrameId = window.requestAnimationFrame(step);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }, [end, duration, isVisible]);

    return <span ref={countRef}>{count.toLocaleString()}</span>;
  };

  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => axiosInstance.get("/users/stats"),
  });

  console.log("data", data?.data?.data);
  const stats = data?.data?.data || {};

  return (
    <Box sx={{ py: 8, bgcolor: "primary.main", color: "white", mt: 5, mb: 10 }}>
      <Container>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          إحصائيات الموقع
        </Typography>
        <Typography
          variant="body1"
          align="center"
          paragraph
          sx={{ mb: 6, maxWidth: 700, mx: "auto", opacity: 0.9 }}
        >
          نفخر بثقة عملائنا وتنامي مجتمعنا من البائعين والمشترين
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <People fontSize="large" />
              </Box>
              <Typography
                variant="h3"
                component="div"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 0 }}
              >
                +<AnimatedCounter end={stats.total_buyers} />
              </Typography>
              <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                مستخدم نشط
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Inventory2 fontSize="large" />
              </Box>
              <Typography
                variant="h3"
                component="div"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 0 }}
              >
                +<AnimatedCounter end={stats.total_devices} />
              </Typography>
              <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                منتج متاح
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Store fontSize="large" />
              </Box>
              <Typography
                variant="h3"
                component="div"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 0 }}
              >
                +<AnimatedCounter end={stats.total_sellers} />
              </Typography>
              <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                تاجر موثوق
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <LocalShipping fontSize="large" />
              </Box>
              <Typography
                variant="h3"
                component="div"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 0 }}
              >
                +<AnimatedCounter end={stats.total_orders} />
              </Typography>
              <Typography variant="h6" component="div" sx={{ opacity: 0.9 }}>
                طلب مكتمل
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
