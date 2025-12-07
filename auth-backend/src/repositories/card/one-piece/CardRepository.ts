import type { IOPCard } from "../../../models/card/one-piece/OPCard.js";
import OPCard from "../../../models/card/one-piece/OPCard.js";

export class CardRepository {
  async create(cardData: Partial<IOPCard>): Promise<IOPCard> {
    return OPCard.create(cardData);
  }

  async findById(id: string): Promise<IOPCard | null> {
    return OPCard.findById(id).populate("seller", "fullName email");
  }

  async findByStatus(status: string, limit: number = 50): Promise<IOPCard[]> {
    return OPCard.find({ status }).sort({ createdAt: -1 }).limit(limit);
  }

  async findAll(query: any = {}): Promise<IOPCard[]> {
    return OPCard.find(query)
      .sort({ createdAt: -1 })
      .populate("seller", "fullName email");
  }

  async updateStatus(id: string, status: string): Promise<IOPCard | null> {
    return OPCard.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
  }

  async countByStatus(status: string): Promise<number> {
    return OPCard.countDocuments({ status });
  }
}