import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import KeycloakService from "../config/KeycloakService";
import PagesEndPoint from "../../utils/constants/PagesEndPoint";

const pages = [
  { title: "Dashboard", url: PagesEndPoint.DASHBOARD_PAGE_URL },
  { title: "Events", url: PagesEndPoint.EVENT_PAGE_URL },
  { title: "AddOns", url: PagesEndPoint.ADDONS_PAGE_URL },
  { title: "Appointments", url: PagesEndPoint.APPOINTMENTS_PAGE_URL },
  { title: "Reservations", url: PagesEndPoint.RESERVATIONS_PAGE_URL },
  { title: "Users", url: PagesEndPoint.USERS_PAGE_URL },
  { title: "Invoices", url: PagesEndPoint.INVOICES_PAGE_URL },
  { title: "Receipts", url: PagesEndPoint.RECEIPTS_PAGE_URL },
  { title: "FAQs", url: PagesEndPoint.FAQS_PAGE_URL },
];

const settings = [
  { title: "Profile", url: PagesEndPoint.PROFILE_PAGE_URL },
  { title: "Account", url: PagesEndPoint.ACCOUNT_PAGE_URL },
  { title: "Logout" },
];

const headerTabCss = { my: 2, color: "black", display: "block" };

/**
 * @returns The App Bar.
 */
const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigateTo = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const closeMenuAndNavigateTo = (path, handleMenuClose) => {
    handleMenuClose();
    navigateTo(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Container maxWidth="xl">
          <Toolbar>
            {/* Medium and Large screen logo */}
            <Button
              onClick={() => navigateTo(PagesEndPoint.DASHBOARD_PAGE_URL)}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
              }}
            >
              <Avatar src="le_prestige_hall_logo.png" alt="Logo" />
            </Button>

            {/*Mobile screen menu button*/}
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page.title}
                    onClick={() =>
                      closeMenuAndNavigateTo(page.url, handleCloseNavMenu)
                    }
                    sx={headerTabCss}
                  >
                    {page.title}
                  </Button>
                ))}
              </Menu>
            </Box>
            {/* Small screen logo */}
            <Button
              onClick={() =>
                closeMenuAndNavigateTo(
                  PagesEndPoint.DASHBOARD_PAGE_URL,
                  handleCloseNavMenu
                )
              }
              sx={{
                mr: 2,
                display: { xs: "flex", justifyContent: "end", md: "none" },
              }}
            >
              <Avatar src="le_prestige_hall_logo.png" alt="Logo" />
            </Button>

            {/* Medium and large screen menu */}
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                  justifyContent: "end",
                },
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.title}
                  onClick={() =>
                    closeMenuAndNavigateTo(page.url, handleCloseNavMenu)
                  }
                  sx={headerTabCss}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* User menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={`${KeycloakService.getUserFirstName()} ${KeycloakService.getUserLasttName()}`}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {KeycloakService.isLoggedIn ? (
                  settings.map((setting) =>
                    setting.title === "Logout" ? (
                      <MenuItem
                        key={setting.title}
                        onClick={KeycloakService.doLogout}
                      >
                        <Typography textAlign="center">
                          {setting.title}
                        </Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        key={setting.title}
                        onClick={() =>
                          closeMenuAndNavigateTo(
                            setting.url,
                            handleCloseUserMenu
                          )
                        }
                      >
                        <Typography textAlign="center">
                          {setting.title}
                        </Typography>
                      </MenuItem>
                    )
                  )
                ) : (
                  <MenuItem key={"Log In"} onClick={handleCloseUserMenu}>
                    <button onClick={KeycloakService.doLogin}>
                      <Typography textAlign="center">Log In</Typography>
                    </button>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default ResponsiveAppBar;
