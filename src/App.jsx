import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MyProductPage from "./pages/MyProductsPage.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import SellerProfilePage from "./pages/SellerProfilePage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import AuctionsPage from "./pages/AuctionsPage.jsx";
import AuctionDetailsPage from "./pages/AuctionDetailsPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import DashboardPage from "./pages/admin/Dashboard.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { ProtectedRoute } from "./pages/protectedPage.jsx";
import Logout from "./pages/logout.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";

// RTL setup for Arabic
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

let theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#ea850a", // Orange color similar to the image
    },
    secondary: {
      main: "#333",
    },
    background: {
      default: "#f9f2e6", // Light beige background
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: "Changa, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          color: "#ffffff",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: "hidden",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/my-products"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <MyProductPage />
                </ProtectedRoute>
              }
            />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/chat/:id" element={<ChatPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/auction/:id" element={<AuctionDetailsPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route
              path="/category/:categoryId/:subcategoryId"
              element={<CategoryPage />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/seller/:id" element={<SellerProfilePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
