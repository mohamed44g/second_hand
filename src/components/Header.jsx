"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ShoppingBag,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { searchProducts } from "../api/productApi";
import axiosInstance from "../api/axiosInstance";
import { getUserRole } from "../utils/checkUser";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
});

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate();

  console.log(userRole, "userRole");

  // استخدام React Query للبحث
  const searchMutation = useMutation({
    mutationFn: searchProducts,
    onSuccess: (data) => {
      if (data.status === "success") {
        setSearchResults(data.data || []);
        setShowSearchResults(true);
      } else {
        setSnackbarMessage("حدث خطأ أثناء البحث");
        setSnackbarOpen(true);
      }
    },
    onError: (error) => {
      setSnackbarMessage(`حدث خطأ: ${error.message}`);
      setSnackbarOpen(true);
    },
  });

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    if (searchQuery.trim() === "") return;

    // إرسال طلب البحث
    searchMutation.mutate(searchQuery);
  };

  const handleSearchResultClick = (productId) => {
    setShowSearchResults(false);
    navigate(`/product/${productId}`);
  };

  const handleCloseSearchResults = () => {
    setShowSearchResults(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const role = getUserRole();
    console.log(role, "role");
    setUserRole(role);
  }, []);

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ bgcolor: "white" }}
    >
      <Container>
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "#000" }}>Hand</span>
            <span style={{ color: "#ff8c00" }}>Second</span>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" component={Link} to="/">
              الرئيسية
            </Button>
            <Button color="inherit" component={Link} to="/products">
              المنتجات
            </Button>
            <Button color="inherit" component={Link} to="/auctions">
              المزادات
            </Button>
            <Button color="inherit" component={Link} to="/about">
              من نحن
            </Button>
            <Button color="inherit" component={Link} to="/contact">
              اتصل بنا
            </Button>
          </Box>

          <Box sx={{ position: "relative" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="ابحث عن منتجات..."
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Search>

            {/* نتائج البحث */}
            {showSearchResults && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  width: 300,
                  maxHeight: 400,
                  overflowY: "auto",
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 1,
                  zIndex: 1000,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    نتائج البحث
                  </Typography>
                  <IconButton size="small" onClick={handleCloseSearchResults}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Divider />
                {searchMutation.isPending ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : searchResults.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      لا توجد نتائج مطابقة
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {searchResults.map((product) => (
                      <ListItem
                        key={product.device_id}
                        button
                        onClick={() =>
                          handleSearchResultClick(product.device_id)
                        }
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box
                          component="img"
                          src={`${axiosInstance.defaults.baseURL}/${product.image_url}`}
                          alt={product.name}
                          sx={{ width: 40, height: 40, mr: 1, borderRadius: 1 }}
                        />
                        <ListItemText
                          primary={product.name}
                          secondary={
                            <Typography
                              variant="body2"
                              color="primary.main"
                              fontWeight="bold"
                            >
                              {product.current_price} ج.م
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex" }}>
            <IconButton color="inherit" component={Link} to="/orders">
              <Badge badgeContent={0} color="primary">
                <ShoppingBag />
              </Badge>
            </IconButton>
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={0} color="primary">
                <CartIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
          حسابي
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/wallet">
          المحفظة
        </MenuItem>
        {userRole?.is_seller && (
          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            to="/my-products"
          >
            منتجاتي
          </MenuItem>
        )}

        {userRole?.is_admin && (
          <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
            لوحة التحكم
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose} component={Link} to="/messages">
          الرسائل
        </MenuItem>
        {userRole === null ? (
          <>
            <MenuItem onClick={handleMenuClose} component={Link} to="/register">
              إنشاء حساب
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/login">
              تسجيل الدخول
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleMenuClose} component={Link} to="/logout">
            تسجيل الخروج
          </MenuItem>
        )}
      </Menu>

      {/* Mobile Menu Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileMenu}
          onKeyDown={toggleMobileMenu}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="الرئيسية" />
            </ListItem>
            <ListItem button component={Link} to="/products">
              <ListItemText primary="المنتجات" />
            </ListItem>
            <ListItem button component={Link} to="/auctions">
              <ListItemText primary="المزادات" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <ListItemText primary="من نحن" />
            </ListItem>
            <ListItem button component={Link} to="/contact">
              <ListItemText primary="اتصل بنا" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="تسجيل الدخول" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="إنشاء حساب" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
