import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#000", color: "white", py: 6, mt: 8 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              <span style={{ color: "#ff8c00" }}>Second</span>
              <span style={{ color: "#fff" }}>Hand</span>
            </Typography>
            <Typography variant="body2" paragraph>
              منصة لبيع وشراء الأجهزة الإلكترونية المستعملة بأفضل الأسعار وبضمان
              الجودة.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>
              <Link href="#" color="inherit">
                <Twitter />
              </Link>
              <Link href="#" color="inherit">
                <Instagram />
              </Link>
              <Link href="#" color="inherit">
                <LinkedIn />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              روابط سريعة
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              الرئيسية
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              المنتجات
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              المزادات
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              من نحن
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              اتصل بنا
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              اتصل بنا
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">القاهرة، مصر</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">20 123 456 7890</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Email sx={{ mr: 1 }} fontSize="small" />
              <Typography variant="body2">info@secondhand.com</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              النشرة الإخبارية
            </Typography>
            <Typography variant="body2" paragraph>
              اشترك في نشرتنا الإخبارية للحصول على آخر العروض والتحديثات
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                fullWidth
                placeholder="البريد الإلكتروني"
                variant="outlined"
                size="small"
                sx={{
                  mb: 1,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  input: { color: "white" },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ borderRadius: 1, backgroundColor: "#333", mt: 2 }}
              >
                اشترك الآن
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: "rgba(255,255,255,0.1)" }} />

        <Typography variant="body2" align="center" sx={{ pt: 2 }}>
          © {new Date().getFullYear()} جميع الحقوق محفوظة لـ SecondHand
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
