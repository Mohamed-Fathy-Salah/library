import { Response } from "express";
import { customRequest } from "../types/customDefinition";
import { getBorrowerById, getAllBorrowers, createBorrower, updateBorrower, deleteBorrower } from "../services/borrowerService";

export const getBorrowerData = async (
    req: customRequest,
    res: Response,
) => {
    const id = parseInt(req.params.id, 10);
    const borrower = await getBorrowerById(id);
    return res.status(200).json({ data: borrower, error: false });
};

export const getBorrowers = async (req: customRequest, res: Response) => {
    const borrowers = await getAllBorrowers(req.query);
    return res.status(200).json({ data: borrowers, error: false });
};

export const createBorrowerData = async (req: customRequest, res: Response) => {
    const borrower = await createBorrower(req.body);
    return res.status(201).json({ data: borrower, message: "Borrower created successfully", error: false });
};

export const updateBorrowerData = async (req: customRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await updateBorrower(id, req.body);
    return res.status(200).json({ message: "Borrower updated successfully", error: false });
};

export const deleteBorrowerData = async (req: customRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await deleteBorrower(id);
    return res.status(200).json({ message: "Borrower deleted successfully", error: false });
};
