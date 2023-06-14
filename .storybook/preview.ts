import type { Preview } from "@storybook/react";
import { customViewports } from "./customViewports";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    viewport: { viewports: customViewports },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
