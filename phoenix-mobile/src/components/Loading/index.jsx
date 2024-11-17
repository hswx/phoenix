import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, keyframes, styled } from "@mui/material";

const animationKeyFrames = keyframes`
  from {
    transform: rotateZ(0)
  }
  to {
    transform: rotateZ(360deg)
  }
`;

const AnimatedRefreshIcon = styled(RefreshIcon)`
  animation: ${animationKeyFrames} 1s linear infinite;
`;

const LoadingPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatedRefreshIcon fontSize="large" color="primary" />
    </Box>
  );
};

export default LoadingPage;
