import {
  Button,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@material-ui/core";

export default function NumberTextField({
  onMaxClick,
  ...props
}: TextFieldProps & { onMaxClick?: () => void }) {
  return (
    <TextField
      type="number"
      {...props}
      InputProps={{
        inputProps: {
          min: 0,
          onWheel: (e) => e.currentTarget.blur(),
        },
        endAdornment: onMaxClick ? (
          <InputAdornment position="end">
            <Button
              onClick={onMaxClick}
              disabled={props.disabled}
              variant="outlined"
            >
              Max
            </Button>
          </InputAdornment>
        ) : undefined,
        ...(props?.InputProps || {}),
      }}
    ></TextField>
  );
}
