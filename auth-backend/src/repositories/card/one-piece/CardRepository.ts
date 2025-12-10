// 11/12 10:52
// import type { IOPCard } from "../../../models/card/one-piece/OPCard.js";
// import OPCard from "../../../models/card/one-piece/OPCard.js";

// export class CardRepository {
//   async create(cardData: Partial<IOPCard>): Promise<IOPCard> {
//     return OPCard.create(cardData);
//   }

//   async findById(id: string): Promise<IOPCard | null> {
//     return OPCard.findById(id).populate("seller", "fullName email");
//   }

//   async findByStatus(status: string, limit: number = 50): Promise<IOPCard[]> {
//     return OPCard.find({ status }).sort({ createdAt: -1 }).limit(limit);
//   }

//   async findAll(query: any = {}): Promise<IOPCard[]> {
//     return OPCard.find(query)
//       .sort({ createdAt: -1 })
//       .populate("seller", "fullName email");
//   }

//   async updateStatus(id: string, status: string): Promise<IOPCard | null> {
//     return OPCard.findByIdAndUpdate(id, { status }, { new: true });
//   }

//   async countByStatus(status: string): Promise<number> {
//     return OPCard.countDocuments({ status });
//   }

//   async findByStatusAndUser(status: string, userId: string) {
//     try {
//       return await OPCard.find({
//         status,
//         seller: userId,
//       })
//         .sort({ createdAt: -1 })
//         .populate("seller", "username email"); // Optional: populate seller info
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// repositories/card/one-piece/CardRepository.ts
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

  async updateStatus(id: string, updateData: { status: string; rejectionReason?: string | null }): Promise<IOPCard | null> {
    return OPCard.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await OPCard.findByIdAndDelete(id);
    return result !== null;
  }

  async countByStatus(status: string): Promise<number> {
    return OPCard.countDocuments({ status });
  }

  async findByStatusAndUser(status: string, userId: string): Promise<IOPCard[]> {
    return OPCard.find({ 
      status, 
      seller: userId 
    })
      .sort({ createdAt: -1 })
      .populate("seller", "fullName email");
  }

  async findByIdWithoutPopulate(id: string): Promise<IOPCard | null> {
    // Don't populate the seller - just get the raw document
    return OPCard.findById(id);
  }
}