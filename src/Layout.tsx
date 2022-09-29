import { Box, Button, CssBaseline, IconButton, Stack, styled, Toolbar, Typography } from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MuiDrawer from "@mui/material/Drawer"
import { useContext, useState } from "react"
import { AppContext } from "./AppContext"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Home } from "@mui/icons-material"


const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop: any) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp, 
            duration: theme.transitions.duration.enteringScreen,
        })
    })
})
)

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxsizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface ILayout {
    sideBarContent: JSX.Element;
    toolBarContent?: JSX.Element;
}

export default function Layout({ sideBarContent, toolBarContent}: ILayout) {
    const aC = useContext(AppContext)

    const toggleDrawer = () => {
        aC.setLayoutDrawerOpen(!aC.layoutDrawerOpen)
    }
    const navigate = useNavigate();
    const [homeOpen, setHomeOpen] = useState(false)

    return (
      <>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <AppBar position="absolute">
            <Toolbar
              disableGutters
              variant="dense"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                px: [1],
                minHeight: 0,
              }}
            >
              <Button onClick={() => setHomeOpen(!homeOpen)}>
                <Home />
                <Typography variant="h6" ml={1} noWrap sx={{ flexGrow: 1 }}>
                  Discover
                </Typography>
              </Button>
              {toolBarContent}
            </Toolbar>
          </AppBar>
          <Box flexDirection={"column"}>
            <Drawer variant="permanent" open={aC.layoutDrawerOpen}>
              {aC.layoutDrawerOpen === true ? (
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="overline"
                    sx={{ pl: 1, py: 1, fontWeight: "bold" }}
                  >
                    Controls
                  </Typography>
                  <IconButton onClick={toggleDrawer} size="large">
                    <ChevronLeft />
                  </IconButton>
                </Stack>
              ) : (
                <IconButton onClick={toggleDrawer} size="large">
                  <ChevronRight />
                </IconButton>
              )}
              <Stack></Stack>
            </Drawer>
          </Box>
        </Box>
      </>
    );
}