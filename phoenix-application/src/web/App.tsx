import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { createTheme, CssBaseline, LinkProps, ThemeProvider } from "@mui/material";
import LinkBehavior from "./components/Link";
import AxiosBaseline from "./components/AxiosBaseline";
import { SnackbarProvider } from 'notistack';
import { Provider } from "react-redux";
import store from "./stores";

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
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
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
