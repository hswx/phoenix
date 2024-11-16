import * as React from 'react';
import Popover from '@mui/material/Popover';
import { Box } from '@mui/material';
import QRCode from 'qrcode';

type ImageProps = {
  [key: string]: any;
}
const Image = (props: ImageProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [imgUrl, setImgUrl] = React.useState("");

  React.useEffect(() => {
    if (props.qrcode) {
      QRCode.toDataURL(props.src).then(setImgUrl)
    } else {
      setImgUrl(props.src)
    }
  }, [props.src, props.qrcode])
  
  return (
    <Box>
      <img
        {...props}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        src={imgUrl}
      />
      <Popover
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <img {...props} width="200px" height="200px" src={imgUrl}/>
      </Popover>
    </Box>
  );
}

export default Image
