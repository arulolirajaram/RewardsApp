import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditForm from "../components/transactionPage/EditForm";

describe("EditForm Component", () => {
    test("renders input with initial value", () => {
        render(<EditForm value={100} onSave={() => { }} onCancel={() => { }} />);

        const input = screen.getByPlaceholderText("Enter amount");
        expect(input.value).toBe("100");
    });

    test("updates input value when user types", () => {
        render(<EditForm value={50} onSave={() => { }} onCancel={() => { }} />);

        const input = screen.getByPlaceholderText("Enter amount");

        fireEvent.change(input, { target: { value: "200" } });
        expect(input.value).toBe("200");
    });

    test("calls onSave with entered amount when Save is clicked", () => {
        const onSave = jest.fn();

        render(<EditForm value={80} onSave={onSave} onCancel={() => { }} />);

        const input = screen.getByPlaceholderText("Enter amount");

        fireEvent.change(input, { target: { value: "150" } });
        fireEvent.click(screen.getByText("Save"));

        expect(onSave).toHaveBeenCalledWith(150);
    });

    test("does NOT call onSave if value is 0 or negative", () => {
        const onSave = jest.fn();

        render(<EditForm value={10} onSave={onSave} onCancel={() => { }} />);

        const input = screen.getByPlaceholderText("Enter amount");

        fireEvent.change(input, { target: { value: "-5" } });
        fireEvent.click(screen.getByText("Save"));

        expect(onSave).not.toHaveBeenCalled();
    });

    test("calls onCancel when Cancel is clicked", () => {
        const onCancel = jest.fn();

        render(<EditForm value={10} onSave={() => { }} onCancel={onCancel} />);

        fireEvent.click(screen.getByText("Cancel"));

        expect(onCancel).toHaveBeenCalled();
    });
});
