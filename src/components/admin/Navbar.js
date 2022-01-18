import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  AppBar, Box, IconButton, Menu,
  MenuItem, Toolbar, Typography
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const pages = [
  { name: "Danh sách Admins", link: "/" },
  { name: "Danh sách người dùng", link: "/listUsers" },
  { name: "Danh sách các lớp", link: "/listClasses" },
];

function Navbar() {
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const [anchorElJoinCreate, setAnchorElJoinCreate] = useState(null);

  const handleMenuAccount = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleCloseAccount = () => {
    setAnchorElAccount(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expAt");
    localStorage.removeItem("user");
  };

  const handleMenuJoinCreate = (event) => {
    setAnchorElJoinCreate(event.currentTarget);
  };

  const handleCloseJoinCreate = () => {
    setAnchorElJoinCreate(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "white" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "black" }}
          >
            My Classroom - Admin
          </Typography>
          {pages.map((page) => (
            <MenuItem key={page.name}>
              <Link  to={page.link} style={{ textDecoration: "none", color: "black" }}>
                {page.name}
              </Link>
            </MenuItem>
          ))}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-account"
            aria-haspopup="true"
            onClick={handleMenuAccount}
            sx={{ color: "black" }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-account"
            anchorEl={anchorElAccount}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElAccount)}
            onClose={handleCloseAccount}
          >
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              <MenuItem>Dashboard </MenuItem>
            </Link>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "black" }}
            >
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Link>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
