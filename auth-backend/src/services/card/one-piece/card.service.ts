// 11/12 10:52
// import { CardRepository } from "../../../repositories/card/one-piece/CardRepository.js";
// import type { CardQueryParams, CreateCardDTO, UpdateCardStatusDTO } from "../../../types/card/one-piece/card.types.js";

// const cardRepository = new CardRepository();

// export class CardService {
//   async createCard(data: CreateCardDTO, images: string[], sellerId: string) {
//     return cardRepository.create({
//       ...data,
//       images,
//       seller: sellerId,
//       status: "pending",
//     });
//   }

//   async getApprovedCards(limit: number = 50) {
//     return cardRepository.findByStatus("approved", limit);
//   }

//   async getPendingCards() {
//     return cardRepository.findByStatus("pending");
//   }

//   async getRejectedCards() {
//     return cardRepository.findByStatus("rejected");
//   }

//   async getAllCards(query: CardQueryParams) {
//     const dbQuery: any = { game: "one-piece" };

//     if (query.status) dbQuery.status = query.status;
//     if (query.category) dbQuery.category = query.category;
//     if (query.search) {
//       const regex = new RegExp(query.search, "i");
//       dbQuery.$or = [{ name: regex }, { description: regex }];
//     }

//     return cardRepository.findAll(dbQuery);
//   }

//   async getCardById(id: string) {
//     return cardRepository.findById(id);
//   }

//   async updateCardStatus(id: string, data: UpdateCardStatusDTO) {
//     return cardRepository.updateStatus(id, data.status);
//   }

//   async getCardStats() {
//     const [pending, approved, rejected] = await Promise.all([
//       cardRepository.countByStatus("pending"),
//       cardRepository.countByStatus("approved"),
//       cardRepository.countByStatus("rejected"),
//     ]);

//     return { pending, approved, rejected };
//   }

//   async getPendingCardsByUserId(userId: string) {
//     return cardRepository.findByStatusAndUser("pending", userId);
//   }

//   async getApprovedCardsByUserId(userId: string) {
//     return cardRepository.findByStatusAndUser("approved", userId);
//   }

//   async getRejectedCardsByUserId(userId: string) {
//     return cardRepository.findByStatusAndUser("rejected", userId);
//   }
// }

// services/card/one-piece/card.service.ts
import { CardRepository } from "../../../repositories/card/one-piece/CardRepository.js";
import { deleteImageFiles } from "../../../utils/storage/deleteImages.js";
import type {
  CardQueryParams,
  CreateCardDTO,
  UpdateCardStatusDTO,
} from "../../../types/card/one-piece/card.types.js";

const cardRepository = new CardRepository();

export class CardService {
  async createCard(data: CreateCardDTO, images: string[], sellerId: string) {
    return cardRepository.create({
      ...data,
      images,
      seller: sellerId,
      status: "pending",
    });
  }

  async getApprovedCards(limit: number = 50) {
    return cardRepository.findByStatus("approved", limit);
  }

  async getPendingCards() {
    return cardRepository.findByStatus("pending");
  }

  async getRejectedCards() {
    return cardRepository.findByStatus("rejected");
  }

  async getAllCards(query: CardQueryParams) {
    const dbQuery: any = {};

    if (query.status) dbQuery.status = query.status;
    if (query.category) dbQuery.category = query.category;
    if (query.search) {
      const regex = new RegExp(query.search, "i");
      dbQuery.$or = [{ name: regex }, { description: regex }];
    }

    return cardRepository.findAll(dbQuery);
  }

  async getCardById(id: string) {
    return cardRepository.findById(id);
  }

  async updateCardStatus(id: string, data: UpdateCardStatusDTO) {
    const updateData: any = { status: data.status };

    if (data.status === "rejected" && data.rejectionReason) {
      updateData.rejectionReason = data.rejectionReason;
    } else if (data.status === "approved") {
      // Clear rejection reason when approving
      updateData.rejectionReason = null;
    }

    return cardRepository.updateStatus(id, updateData);
  }

  // services/card/one-piece/card.service.ts
  async deleteCard(id: string, userId?: string): Promise<boolean> {
    try {
      // Don't populate the seller when checking for deletion
      const card = await cardRepository.findByIdWithoutPopulate(id);

      if (!card) {
        throw new Error("Card not found");
      }

      // Check permissions
      if (userId) {
        // Get the seller ID - it should be a string or ObjectId, not a populated object
        const cardSellerId = card.seller.toString();
        const requestingUserId = userId.toString();

        console.log("Checking deletion permissions:", {
          cardId: id,
          cardSellerId,
          requestingUserId,
          sellerType: typeof card.seller,
          sellerValue: card.seller,
        });

        if (cardSellerId !== requestingUserId) {
          throw new Error("You can only delete your own cards");
        }
      }

      // Delete associated images
      if (card.images && card.images.length > 0) {
        deleteImageFiles(card.images);
      }

      // Delete from database
      await cardRepository.delete(id);

      return true;
    } catch (error) {
      console.error("Delete card error:", error);
      throw error;
    }
  }

  async getCardStats() {
    const [pending, approved, rejected] = await Promise.all([
      cardRepository.countByStatus("pending"),
      cardRepository.countByStatus("approved"),
      cardRepository.countByStatus("rejected"),
    ]);

    return { pending, approved, rejected };
  }

  async getPendingCardsByUserId(userId: string) {
    return cardRepository.findByStatusAndUser("pending", userId);
  }

  async getApprovedCardsByUserId(userId: string) {
    return cardRepository.findByStatusAndUser("approved", userId);
  }

  async getRejectedCardsByUserId(userId: string) {
    return cardRepository.findByStatusAndUser("rejected", userId);
  }
}
