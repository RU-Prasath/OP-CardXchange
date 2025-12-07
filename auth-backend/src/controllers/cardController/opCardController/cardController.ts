import type { Request, Response } from "express";
import Card from "../../../models/Card.js";

// create card (seller must be logged)
export const createCard = async (req: Request, res: Response) => {
  try {
    // req.user set by protect middleware
    const user = (req as any).user;
    const { name, category, condition, description, price } = req.body;

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
      price,
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

// admin: list pending cards
export const listRejectedCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({ status: "rejected" }).sort({ createdAt: -1 });
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

export const listAllCards = async (req: Request, res: Response) => {
  try {
    const { status, category, search } = req.query as {
      status?: "pending" | "approved" | "rejected";
      category?: string;
      search?: string;
    };

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query.$or = [{ name: regex }, { description: regex }];
    }

    const cards = await Card.find(query)
      .sort({ createdAt: -1 })
      .populate("seller", "fullName email"); // optional, fetch seller info

    res.json({ cards });
  } catch (error) {
    console.error("listAllCards error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get card by ID (admin)
export const getCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id).populate("seller", "fullName email");
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json({ card });
  } catch (error) {
    console.error("getCardById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};