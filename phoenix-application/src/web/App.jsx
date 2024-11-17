import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import LinkBehavior from "./components/Link";
import AxiosBaseline from "./components/AxiosBaseline";
import { SnackbarProvider } from 'notistack';
import { Provider } from "react-redux";
import store from "./stores";
import LoadingPage from "./components/Loading";

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{horizontal: "right", vertical: "bottom"}}
          autoHideDuration={3000}
        >
          <AxiosBaseline />
          <Box height={"100vh"}>
            <React.Suspense fallback={<LoadingPage />}>
              <RouterProvider router={router} />
            </React.Suspense>
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
