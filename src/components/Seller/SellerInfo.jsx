import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  Chat as ChatIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const SellerInfo = ({ seller }) => {
  if (!seller) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { md: "center" },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {seller.first_name} {seller.last_name}
          </Typography>
          <VerifiedIcon
            color="primary"
            sx={{ ml: 1, fontSize: 24 }}
            titleAccess="بائع موثق"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            label="بائع موثوق"
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SellerInfo;
