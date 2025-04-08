"use client";

import { useState } from "react";
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
  ListItemIcon,
  Divider,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Favorite as FavoriteIcon,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
              flexDirection: "row-reverse",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "#ff8c00" }}>Second</span>
            <span style={{ color: "#000" }}>Hand</span>
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

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="ابحث عن منتجات..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Box sx={{ display: "flex" }}>
            <IconButton color="inherit" component={Link} to="/favorites">
              <Badge badgeContent={3} color="primary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={2} color="primary">
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
        <MenuItem onClick={handleMenuClose} component={Link} to="/my-listings">
          منتجاتي
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/my-auctions">
          مزاداتي
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/messages">
          الرسائل
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} component={Link} to="/login">
          تسجيل الدخول
        </MenuItem>
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
            <ListItem  component={Link} to="/">
              <ListItemText primary="الرئيسية" />
            </ListItem>
            <ListItem  component={Link} to="/categories">
              <ListItemText primary="الفئات" />
            </ListItem>
            <ListItem  component={Link} to="/auctions">
              <ListItemText primary="المزادات" />
            </ListItem>
            <ListItem  component={Link} to="/about">
              <ListItemText primary="من نحن" />
            </ListItem>
            <ListItem  component={Link} to="/contact">
              <ListItemText primary="اتصل بنا" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem  component={Link} to="/login">
              <ListItemText primary="تسجيل الدخول" />
            </ListItem>
            <ListItem  component={Link} to="/register">
              <ListItemText primary="إنشاء حساب" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
