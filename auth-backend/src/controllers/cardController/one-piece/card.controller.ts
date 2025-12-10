// import type { Request, Response } from "express";
// import Card from "../../../models/card/one-piece/OPCard.js";

// // create card (seller must be logged)
// export const createCard = async (req: Request, res: Response) => {
//   try {
//     // req.user set by protect middleware
//     const user = (req as any).user;
//     const { name, category, condition, description, price } = req.body;

//     // files from multer: req.files (array)
//     const files: any[] = (req as any).files || [];
//     if (!files || files.length < 6) {
//       return res.status(400).json({ message: "Please upload at least 6 images" });
//     }
//     const images = files.map(f => `/uploads/cards/${f.filename}`); // accessible via static route

//     const card = await Card.create({
//       name,
//       category,
//       condition,
//       description,
//       images,
//       price,
//       seller: user._id,
//       status: "pending",
//     });

//     return res.status(201).json({ message: "Card submitted for admin review", card });
//   } catch (error) {
//     console.error("createCard error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // list approved cards (public)
// export const listApprovedCards = async (_req: Request, res: Response) => {
//   try {
//     const cards = await Card.find({ status: "approved" }).sort({ createdAt: -1 }).limit(50);
//     res.json({ cards });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // admin: list pending cards
// export const listPendingCards = async (_req: Request, res: Response) => {
//   try {
//     const cards = await Card.find({ status: "pending" }).sort({ createdAt: -1 });
//     res.json({ cards });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // admin: list pending cards
// export const listRejectedCards = async (_req: Request, res: Response) => {
//   try {
//     const cards = await Card.find({ status: "rejected" }).sort({ createdAt: -1 });
//     res.json({ cards });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // admin: approve/reject
// export const updateCardStatus = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body; // expected 'approved' or 'rejected'
//     if (!["approved","rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

//     const card = await Card.findByIdAndUpdate(id, { status }, { new: true });
//     if (!card) return res.status(404).json({ message: "Card not found" });

//     res.json({ message: `Card ${status}`, card });
//   } catch (error) {
//     console.error("updateCardStatus:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const listAllCards = async (req: Request, res: Response) => {
//   try {
//     const { status, category, search } = req.query as {
//       status?: "pending" | "approved" | "rejected";
//       category?: string;
//       search?: string;
//     };

//     const query: any = {};

//     if (status) query.status = status;
//     if (category) query.category = category;
//     if (search) {
//       const regex = new RegExp(search, "i"); // case-insensitive
//       query.$or = [{ name: regex }, { description: regex }];
//     }

//     const cards = await Card.find(query)
//       .sort({ createdAt: -1 })
//       .populate("seller", "fullName email"); // optional, fetch seller info

//     res.json({ cards });
//   } catch (error) {
//     console.error("listAllCards error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Get card by ID (admin)
// export const getCardById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const card = await Card.findById(id).populate("seller", "fullName email");
//     if (!card) return res.status(404).json({ message: "Card not found" });
//     res.json({ card });
//   } catch (error) {
//     console.error("getCardById error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import type { Request, Response } from "express";
import { CardService } from "../../../services/card/one-piece/card.service.js";
import {
  createCardSchema,
  updateCardStatusSchema,
} from "../../../schemas/auth/card/one-piece/card.schema.js";
import type { CardQueryParams } from "../../../types/card/one-piece/card.types.js";

const cardService = new CardService();

export const createCard = async (req: Request, res: Response) => {
  try {
    const { error } = createCardSchema.validate(req.body, { abortEarly: true });

    if (error) {
      return res.status(400).json({
        message: error.details?.[0]?.message || "Validation error",
      });
    }

    const files: any[] = (req as any).files || [];
    if (files.length < 6) {
      return res
        .status(400)
        .json({ message: "Please upload at least 6 images" });
    }

    const images = files.map((f) => `/uploads/cards/${f.filename}`);
    const user = req.user!;

    const card = await cardService.createCard(
      req.body,
      images,
      user._id.toString()
    );

    res.status(201).json({
      message: "Card submitted for admin review",
      card,
    });
  } catch (error: any) {
    console.error("Create card error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const listApprovedCards = async (_req: Request, res: Response) => {
  try {
    const cards = await cardService.getApprovedCards();
    res.json({ cards });
  } catch (error: any) {
    console.error("List approved cards error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const listPendingCards = async (_req: Request, res: Response) => {
  try {
    const cards = await cardService.getPendingCards();
    res.json({ cards });
  } catch (error: any) {
    console.error("List pending cards error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const listRejectedCards = async (_req: Request, res: Response) => {
  try {
    const cards = await cardService.getRejectedCards();
    res.json({ cards });
  } catch (error: any) {
    console.error("List rejected cards error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const listAllCards = async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as CardQueryParams;
    const cards = await cardService.getAllCards(query);
    res.json({ cards });
  } catch (error: any) {
    console.error("List all cards error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Card ID is required" });
    }
    const card = await cardService.getCardById(id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ card });
  } catch (error: any) {
    console.error("Get card by ID error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// export const updateCardStatus = async (req: Request, res: Response) => {
//   try {
//     const { error } = updateCardStatusSchema.validate(req.body, {
//       abortEarly: true,
//     });

//     if (error) {
//       return res.status(400).json({
//         message: error.details?.[0]?.message || "Validation error",
//       });
//     }

//     const id = req.params.id;
//     const { status } = req.body;

//     if (!id) {
//       return res.status(400).json({ message: "Card ID is required" });
//     }

//     const card = await cardService.updateCardStatus(id, { status });

//     if (!card) {
//       return res.status(404).json({ message: "Card not found" });
//     }

//     res.json({ message: `Card ${status}`, card });
//   } catch (error: any) {
//     console.error("Update card status error:", error);
//     res.status(500).json({ message: error.message || "Server error" });
//   }
// };

export const updateCardStatus = async (req: Request, res: Response) => {
  try {
    const { error } = updateCardStatusSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return res.status(400).json({
        message: error.details?.[0]?.message || "Validation error",
      });
    }

    const id = req.params.id;
    const { status, rejectionReason } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Card ID is required" });
    }

    const card = await cardService.updateCardStatus(id, { 
      status, 
      rejectionReason 
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ 
      message: `Card ${status}`,
      card 
    });
  } catch (error: any) {
    console.error("Update card status error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteMyCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    if (!id) {
      return res.status(400).json({ message: "Card ID is required" });
    }

    const success = await cardService.deleteCard(id, user._id.toString());

    if (!success) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ 
      message: "Card deleted successfully" 
    });
  } catch (error: any) {
    console.error("Delete my card error:", error);
    
    if (error.message === "You can only delete your own cards") {
      return res.status(403).json({ message: error.message });
    }
    
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete card (admin can delete any card)
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Card ID is required" });
    }

    const success = await cardService.deleteCard(id);

    if (!success) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ 
      message: "Card deleted successfully" 
    });
  } catch (error: any) {
    console.error("Delete card error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getCardStats = async (_req: Request, res: Response) => {
  try {
    const stats = await cardService.getCardStats();
    res.json(stats);
  } catch (error: any) {
    console.error("Get card stats error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// New functions for user-specific cards
export const listPendingCardsByUserId = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const cards = await cardService.getPendingCardsByUserId(user._id.toString());
    res.json({ cards });
  } catch (error: any) {
    console.error("List pending cards by user ID error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const listApprovedCardsByUserId = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const cards = await cardService.getApprovedCardsByUserId(user._id.toString());
    res.json({ cards });
  } catch (error: any) {
    console.error("List approved cards by user ID error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const listRejectedCardsByUserId = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const cards = await cardService.getRejectedCardsByUserId(user._id.toString());
    res.json({ cards });
  } catch (error: any) {
    console.error("List rejected cards by user ID error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
