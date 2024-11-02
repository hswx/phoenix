import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
type AsyncButtonProps = {
  onClick?: (e: any) => Promise<any>;
  children?: React.ReactNode;
  [key: string]: any;
}

const AsyncButton = (props: AsyncButtonProps) => {
  const {onClick, children, ...restProps} = props;
  const [loading, setLoading] = React.useState(false);

  const clickFn = (e: any) => {
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
