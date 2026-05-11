require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Service = require("../models/Service");
const Settings = require("../models/Settings");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
};

const seedData = async () => {
  await connectDB();

  // Create super admin
  const adminExists = await Admin.findOne({ email: "admin@skyrisebuild.com" });
  if (!adminExists) {
    await Admin.create({
      name: "Skyrise Admin",
      email: "admin@skyrisebuild.com",
      password: "Admin@123",
      role: "superadmin",
    });
    console.log("✅ Super admin created: admin@skyrisebuild.com / Admin@123");
  }

  // Seed services
  const services = [
    { title: "House Plan & Design", shortDescription: "Innovative architectural designs tailored to your lifestyle", features: ["2D & 3D Floor Plans", "Architectural Drawings", "Structural Design", "Interior Layout Planning"], icon: "blueprint", order: 1 },
    { title: "Plan Approval", shortDescription: "Seamless government plan approval processing", features: ["DTCP Approval", "Panchayat Approval", "CMDA Approval", "Documentation Support"], icon: "stamp", order: 2 },
    { title: "Construction", shortDescription: "Premium quality construction with superior materials", features: ["RCC Frame Structure", "Quality Materials", "Skilled Workforce", "Project Management"], icon: "building", order: 3 },
    { title: "Interior Design", shortDescription: "Luxury interiors that reflect your personality", features: ["Space Planning", "Material Selection", "Furniture Design", "Lighting Design"], icon: "sofa", order: 4 },
    { title: "Turnkey Projects", shortDescription: "End-to-end project delivery from concept to completion", features: ["Design to Delivery", "Single Point Contact", "Quality Assurance", "Timely Completion"], icon: "key", order: 5 },
    { title: "2D & 3D Elevation", shortDescription: "Stunning facade designs that make lasting impressions", features: ["2D Elevation Drawing", "3D Visualization", "Facade Design", "Material Specification"], icon: "layers", order: 6 },
    { title: "Modular Kitchen", shortDescription: "Premium modular kitchens designed for modern living", features: ["Custom Cabinetry", "Premium Hardware", "Space Optimization", "Modern Finishes"], icon: "utensils", order: 7 },
    { title: "False Ceiling", shortDescription: "Elegant ceiling designs enhancing architectural beauty", features: ["Gypsum Ceiling", "POP Ceiling", "Wooden Ceiling", "LED Integrated Design"], icon: "ceiling", order: 8 },
  ];

  for (const s of services) {
    const exists = await Service.findOne({ title: s.title });
    if (!exists) await Service.create(s);
  }
  console.log("✅ Services seeded");

  // Seed settings
  const defaultSettings = [
    { key: "site_name", value: "Skyrise Build & Interiors", group: "general", label: "Site Name" },
    { key: "site_tagline", value: "Building Dreams, Crafting Excellence", group: "general", label: "Tagline" },
    { key: "phone", value: "+91 98765 43210", group: "contact", label: "Phone" },
    { key: "whatsapp", value: "+919876543210", group: "contact", label: "WhatsApp" },
    { key: "email", value: "info@skyrisebuild.com", group: "contact", label: "Email" },
    { key: "address", value: "123 Premium Avenue, Chennai, Tamil Nadu 600001", group: "contact", label: "Address" },
    { key: "instagram", value: "#", group: "social", label: "Instagram" },
    { key: "facebook", value: "#", group: "social", label: "Facebook" },
    { key: "youtube", value: "#", group: "social", label: "YouTube" },
    { key: "hero_heading", value: "Building Spaces That Inspire Excellence", group: "hero", label: "Hero Heading" },
    { key: "hero_subheading", value: "Premium Construction & Luxury Interiors", group: "hero", label: "Hero Subheading" },
    { key: "stat_projects", value: "500+", group: "stats", label: "Projects Completed" },
    { key: "stat_years", value: "15+", group: "stats", label: "Years Experience" },
    { key: "stat_clients", value: "450+", group: "stats", label: "Happy Clients" },
    { key: "stat_awards", value: "20+", group: "stats", label: "Awards Won" },
    { key: "map_embed", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.5!2d80.2!3d13.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzQ4LjAiTiA4MMKwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000", group: "contact", label: "Google Map Embed" },
    { key: "business_hours", value: "Mon – Sat: 9:00 AM – 7:00 PM", group: "contact", label: "Business Hours" },
  ];

  for (const s of defaultSettings) {
    await Settings.findOneAndUpdate({ key: s.key }, s, { upsert: true });
  }
  console.log("✅ Settings seeded");

  mongoose.connection.close();
  console.log("🎉 Seed complete");
};

seedData().catch(console.error);
