import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Recycling as RecyclingIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  Handshake as HandshakeIcon,
} from "@mui/icons-material";

const AboutPage = () => {
  // قيم الشركة
  const values = [
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: "الأمان والثقة",
      description:
        "نضمن أمان المعاملات وحماية بيانات المستخدمين، ونوفر بيئة آمنة للبيع والشراء",
    },
    {
      icon: <RecyclingIcon fontSize="large" color="primary" />,
      title: "الاستدامة",
      description:
        "نساهم في تقليل النفايات الإلكترونية من خلال إعادة استخدام الأجهزة بدلاً من شراء الجديد",
    },
    {
      icon: <HandshakeIcon fontSize="large" color="primary" />,
      title: "النزاهة",
      description:
        "نلتزم بالشفافية في جميع تعاملاتنا ونضمن حقوق البائعين والمشترين",
    },
    {
      icon: <DevicesIcon fontSize="large" color="primary" />,
      title: "الجودة",
      description:
        "نتحقق من جودة المنتجات المعروضة ونضمن أنها تعمل بكفاءة قبل عرضها للبيع",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* قسم الترحيب */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 2 }}
        >
          <span style={{ color: "#ff8c00" }}>Second</span>
          <span>Hand</span>
          <span style={{ color: "#ff8c00" }}>.</span>
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          منصة رائدة لبيع وشراء الأجهزة الإلكترونية المستعملة
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {/* قسم من نحن */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            من نحن
          </Typography>
          <Typography variant="body1" paragraph>
            تأسست منصة SecondHand في عام 2020 بهدف توفير سوق موثوق وآمن لبيع
            وشراء الأجهزة الإلكترونية المستعملة في مصر والشرق الأوسط. نحن نؤمن
            بأن الأجهزة المستعملة ذات الجودة العالية يمكن أن توفر قيمة كبيرة
            للمستخدمين، مع تقليل النفايات الإلكترونية والحفاظ على البيئة.
          </Typography>
          <Typography variant="body1" paragraph>
            تجمع منصتنا بين البائعين والمشترين في بيئة آمنة وشفافة، حيث نضمن
            جودة المنتجات المعروضة من خلال عمليات فحص دقيقة ونظام تقييم موثوق.
            كما نوفر خدمة المزادات لضمان أفضل سعر للبائعين والمشترين.
          </Typography>
          <Typography variant="body1">
            نفتخر بأننا نخدم آلاف العملاء شهرياً ونساهم في تدوير الأجهزة
            الإلكترونية بطريقة مستدامة، مما يوفر خيارات أفضل للمستهلكين ويقلل من
            الأثر البيئي للنفايات الإلكترونية.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="src/assets/images/company.jpg"
            alt="صورة عن الشركة"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>

      {/* قسم رؤيتنا ورسالتنا */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
              <Typography variant="h4" component="h2" fontWeight="bold">
                رؤيتنا
              </Typography>
            </Box>
            <Typography variant="body1">
              أن نكون المنصة الرائدة في الشرق الأوسط لبيع وشراء الأجهزة
              الإلكترونية المستعملة، ونساهم في بناء اقتصاد دائري يقلل من
              النفايات الإلكترونية ويوفر خيارات أفضل للمستهلكين.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CheckCircleIcon
                sx={{ fontSize: 40, mr: 2, color: "secondary.main" }}
              />
              <Typography variant="h4" component="h2" fontWeight="bold">
                رسالتنا
              </Typography>
            </Box>
            <Typography variant="body1">
              توفير منصة آمنة وموثوقة تربط بين بائعي ومشتري الأجهزة الإلكترونية
              المستعملة، مع ضمان جودة المنتجات وشفافية المعاملات، وتعزيز ثقافة
              إعادة الاستخدام والاستدامة في المجتمع.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* قسم قيمنا */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 4, textAlign: "center" }}
        >
          قيمنا
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Box sx={{ mb: 2, mt: 2 }}>{value.icon}</Box>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* قسم لماذا تختارنا */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 4 }}
        >
          لماذا تختار SecondHand؟
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="ضمان الجودة"
                secondary="نتحقق من جميع الأجهزة المعروضة للبيع ونضمن أنها تعمل بكفاءة"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="أسعار تنافسية"
                secondary="وفر ما يصل إلى 70% من سعر الأجهزة الجديدة مع الحفاظ على الجودة"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="حماية المشتري"
                secondary="نظام دفع آمن وفترة ضمان على جميع المنتجات"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="نظام تقييم موثوق"
                secondary="تقييمات حقيقية من مستخدمين حقيقيين تساعدك على اتخاذ قرار الشراء"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="دعم فني متميز"
                secondary="فريق دعم فني متاح على مدار الساعة لمساعدتك في أي استفسار"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;
