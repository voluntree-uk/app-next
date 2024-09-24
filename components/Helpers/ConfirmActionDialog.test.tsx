import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfirmActionDialog } from "@components/Helpers/ConfirmActionDialog";

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();

beforeEach(() => {
  render(
    <ConfirmActionDialog
      title={"Test title"}
      message={"Would you like to confirm this action?"}
      isOpen={true}
      onClose={onCloseMock}
      onSubmit={onSubmitMock}
    />
  );
});

describe("Confirm Action Dialog", () => {

  test("renders a title, a message, a submit and a cancel a button", () => {
    const title = screen.getByText("Test title");
    expect(title).toBeInTheDocument();

    const message = screen.getByText("Would you like to confirm this action?");
    expect(message).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Confirm" });
    expect(submitButton).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();
  });

  test("calls cancel callback when cancel button is clicked", () => {
    const closeButton = screen.getByRole("button", { name: "Close" });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
    expect(onCloseMock.mock.calls).toHaveLength(1);
  });

  test("calls confirm callback when confirm button is clicked", () => {
    const submitButton = screen.getByRole("button", { name: "Confirm" });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);
    expect(onSubmitMock).toHaveBeenCalled();
    expect(onSubmitMock.mock.calls).toHaveLength(1);
  });

});
