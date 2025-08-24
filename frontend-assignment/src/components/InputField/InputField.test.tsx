import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputField } from "./InputField";
import "@testing-library/jest-dom";

test("shows error message when invalid", () => {
  render(<InputField label="Email" invalid errorMessage="Required" />);
  expect(screen.getByText("Required")).toBeInTheDocument();
  const input = screen.getByLabelText("Email");
  expect(input).toHaveAttribute("aria-invalid", "true");
});

test("clear button clears value", async () => {
  const user = userEvent.setup();
  const Wrapper = () => {
    const [v, setV] = (require("react") as typeof import("react")).useState("abc");
    return <InputField value={v} onChange={(e) => setV(e.target.value)} allowClear label="X" />;
  };
  render(<Wrapper />);
  await user.click(screen.getByRole("button", { name: /clear input/i }));
  expect(screen.getByLabelText("X")).toHaveValue("");
});

test("password toggle shows/hides", async () => {
  const user = userEvent.setup();
  render(<InputField label="Pwd" type="password" allowPasswordToggle />);
  const btn = screen.getByRole("button", { name: /show password/i });
  await user.click(btn);
  expect(screen.getByLabelText("Pwd")).toHaveAttribute("type", "text");
});
