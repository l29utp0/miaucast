import { createTheme } from "@mui/material";
import { grey, green } from "@mui/material/colors";

const makeTheme = (configuration) => {
  const { palettePrimary, paletteSecondary } = configuration || {};
  let primary,
    secondary,
    useDarkTheme = configuration?.useDarkTheme;

  try {
    primary = require(`@mui/material/colors/${palettePrimary}.js`).default;
    secondary = require(`@mui/material/colors/${paletteSecondary}.js`).default;
  } catch (e) {
    primary = grey;
    secondary = green;
    useDarkTheme = true;
  }

  return createTheme({
    palette: {
      mode: useDarkTheme ? "dark" : "light",
      primary,
      secondary,
      background: {
        default: primary[900],
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1600,
      },
    },
  });
};

export default makeTheme;
