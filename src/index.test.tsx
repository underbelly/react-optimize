import * as React from "react";
import { render, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import { OptimizeContext, Experiment, Variant } from "./index";

afterEach(cleanup);

describe("Variant", () => {
  test("does not render when nothing has come back from the provider", () => {
    const { container } = render(
      <Variant id="0">
        <div>Rendered this</div>
      </Variant>
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders when the provider has passed a value", () => {
    const { getByText } = render(
      <OptimizeContext.Provider value="0">
        <Variant id="0">
          <div>Rendered this</div>
        </Variant>

        <Variant id="1">
          <div>Did not rendered this</div>
        </Variant>
      </OptimizeContext.Provider>
    );

    expect(getByText(/^Rendered this/)).toHaveTextContent("Rendered this");
  });

  describe("throws errors", () => {
    test("if no child is passed in", () => {
      console.error = jest.fn();

      expect(() => render(<Variant />)).toThrow(
        "Variant must have a child to test"
      );
    });

    test("if no id is passed in", () => {
      console.error = jest.fn();

      expect(() =>
        render(
          <Variant>
            <div />
          </Variant>
        )
      ).toThrow("You must provide the variant a ID");
    });
  });
});
