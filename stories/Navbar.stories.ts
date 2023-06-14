import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "../components/Layout/Navbar";
import { withRecoilFlow } from "storybook-addon-recoil-flow/dist/decorator";

const meta: Meta<typeof Navbar> = {
  title: "Example/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  decorators: [withRecoilFlow],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Navbar",
  },
};
