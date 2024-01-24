import { Paper } from "@mui/material";
import { styled } from "@mui/material";

/**
 * A styled component wrapper.
 */
const StyleItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default StyleItem;
