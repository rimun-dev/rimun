import path from "path";
import { rgb } from "pdf-lib";

export const IMAGE_ENDPOINT = "https://static.rimun.com";

export const BLUE = rgb(0.1, 0.41, 0.63);
export const RED = rgb(0.73, 0.11, 0.11);
export const YELLOW = rgb(0.92, 0.7, 0.3);
export const GREEN = rgb(0.02, 0.37, 0.27);

export const PATH_TEMPLATE_BADGE = path.resolve(
  __dirname,
  "assets",
  "templates",
  "template_badge.pdf"
);

export const PATH_TEMPLATE_CERTIFICATE = path.resolve(
  __dirname,
  "assets",
  "templates",
  "template_certificate.pdf"
);

export const PATH_FONT_PINYONSCRIPT = path.resolve(
  __dirname,
  "assets",
  "fonts",
  "PinyonScript",
  "PinyonScript-Regular.ttf"
);
