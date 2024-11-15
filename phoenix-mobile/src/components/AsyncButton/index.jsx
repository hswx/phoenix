import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

const AsyncButton = (props) => {
  const {onClick, children, ...restProps} = props;
  const [loading, setLoading] = React.useState(false);

  const clickFn = (e) => {
    setLoading(true)
    props.onClick?.(e).finally(() => setLoading(false))
  }

  return <LoadingButton
    disabled={loading}
    onClick={clickFn}
    loading={loading}
    loadingPosition="start"
    startIcon={<></>}
    {...restProps}
  >{children}</LoadingButton>
}

export default AsyncButton
