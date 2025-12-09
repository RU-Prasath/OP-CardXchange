import { CardRepository } from "../../../repositories/card/one-piece/CardRepository.js";
import type { CardQueryParams, CreateCardDTO, UpdateCardStatusDTO } from "../../../types/card/one-piece/card.types.js";

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
    const dbQuery: any = { game: "one-piece" };
    
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
    return cardRepository.updateStatus(id, data.status);
  }

  async getCardStats() {
    const [pending, approved, rejected] = await Promise.all([
      cardRepository.countByStatus("pending"),
      cardRepository.countByStatus("approved"),
      cardRepository.countByStatus("rejected"),
    ]);

    return { pending, approved, rejected };
  }
}