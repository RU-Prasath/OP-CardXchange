import type { Request, Response } from "express";
import Card from "../models/Card.js";

// create card (seller must be logged)
export const createCard = async (req: Request, res: Response) => {
  try {
    // req.user set by protect middleware
    const user = (req as any).user;
    const { name, category, condition, description } = req.body;

    // files from multer: req.files (array)
    const files: any[] = (req as any).files || [];
    if (!files || files.length < 6) {
      return res.status(400).json({ message: "Please upload at least 6 images" });
    }
    const images = files.map(f => `/uploads/cards/${f.filename}`); // accessible via static route

    const card = await Card.create({
      name,
      category,
      condition,
      description,
      images,
      seller: user._id,
      status: "pending",
    });

    return res.status(201).json({ message: "Card submitted for admin review", card });
  } catch (error) {
    console.error("createCard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// list approved cards (public)
export const listApprovedCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({ status: "approved" }).sort({ createdAt: -1 }).limit(50);
    res.json({ cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// admin: list pending cards
export const listPendingCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// admin: approve/reject
export const updateCardStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected 'approved' or 'rejected'
    if (!["approved","rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const card = await Card.findByIdAndUpdate(id, { status }, { new: true });
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json({ message: `Card ${status}`, card });
  } catch (error) {
    console.error("updateCardStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};
