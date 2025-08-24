import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  args: {
    label: "Email",
    placeholder: "you@example.com",
    variant: "outlined",
    size: "md",
    helperText: "We’ll never share your email.",
  },
};
export default meta;
type Story = StoryObj<typeof InputField>;

export const Basic: Story = {
  render: (args) => {
    const [v, setV] = useState("");
    return <InputField {...args} value={v} onChange={(e) => setV(e.target.value)} />;
  },
};

export const Invalid: Story = { args: { invalid: true, errorMessage: "Email is required" } };
export const Disabled: Story = { args: { disabled: true, value: "disabled@example.com" } };
export const Loading: Story = { args: { loading: true, value: "checking..." } };
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <InputField label="Filled" variant="filled" placeholder="..." />
      <InputField label="Outlined" variant="outlined" placeholder="..." />
      <InputField label="Ghost" variant="ghost" placeholder="..." />
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <InputField label="Small" size="sm" placeholder="..." />
      <InputField label="Medium" size="md" placeholder="..." />
      <InputField label="Large" size="lg" placeholder="..." />
    </div>
  ),
};
export const PasswordWithToggle: Story = {
  args: { label: "Password", type: "password", allowPasswordToggle: true },
};
export const Clearable: Story = {
  render: () => {
    const [v, setV] = useState("Clear me");
    return (
      <InputField
        label="Clearable"
        value={v}
        onChange={(e) => setV(e.target.value)}
        allowClear
      />
    );
  },
};
