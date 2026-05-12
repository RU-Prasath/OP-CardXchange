import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../services/api";
import { Building, Gem, Handshake, Flame, Heart } from "lucide-react";

function PageHero() {
  return (
    <section className="relative pt-32 pb-20 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 60%)" }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="section-tag">Our Story</p>
          <h1 className="heading-display text-white mb-4">
            About <span className="text-gold">Skyrise</span>
          </h1>
          <div className="gold-divider" />
          <p className="text-silver/50 max-w-xl leading-relaxed">
            A legacy of excellence, trust, and architectural brilliance spanning over 15 years.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CompanyIntro({ settings }) {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-tag">Who We Are</p>
          <h2 className="heading-section text-white mb-6">
            Building Excellence<br />Since <span className="text-gold">2009</span>
          </h2>
          <p className="text-silver/50 leading-relaxed mb-4">
            Skyrise Build & Interiors was founded with a singular vision: to redefine the standards of construction and interior design in Tamil Nadu. What began as a small architectural firm has grown into one of the region's most trusted premium construction companies.
          </p>
          <p className="text-silver/50 leading-relaxed mb-8">
            We bring together the finest architects, engineers, and interior designers to create spaces that are not just built — they are crafted with passion, precision, and an unwavering commitment to excellence.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[["500+", "Projects Delivered"], ["15+", "Years of Excellence"], ["450+", "Happy Families"], ["100%", "Client Satisfaction"]].map(([num, label]) => (
              <div key={label} className="border border-white/5 p-4">
                <div className="text-3xl font-display font-semibold text-gold">{num}</div>
                <div className="text-silver/40 text-xs tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="aspect-[4/5] bg-navy border border-white/5 overflow-hidden">
            {settings?.about_image ? (
              <img src={settings.about_image} alt="Skyrise HQ" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-silver/10">
                <div className="text-center">
                  <Building size={80} className="mx-auto mb-4 opacity-20" />
                  <p className="font-display text-2xl">Skyrise HQ</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-gold/20 -z-10" />
          <div className="absolute -top-6 -right-6 w-32 h-32 border border-gold/10 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}

function FounderMessage() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-5xl mx-auto px-6">
        <div className="border border-gold/15 p-10 md:p-16 relative">
          <div className="absolute top-0 left-10 w-24 h-px bg-gold" />
          <div className="absolute bottom-0 right-10 w-24 h-px bg-gold" />
          <div className="text-gold text-6xl font-display leading-none mb-6 opacity-30">"</div>
          <blockquote className="font-display text-xl md:text-2xl text-white/80 leading-relaxed italic mb-8">
            Our philosophy is simple: every project we undertake is a reflection of our client's dreams. We don't build houses — we build homes that become the backdrop of life's most precious moments. Quality is not just our standard; it is our identity.
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gold/10 border border-gold/20 flex items-center justify-center">
              <span className="text-gold font-display font-bold text-xl">SK</span>
            </div>
            <div>
              <p className="text-white font-semibold">Suresh Kumar</p>
              <p className="text-gold text-xs tracking-widest uppercase">Founder & Managing Director</p>
              <p className="text-silver/40 text-xs">Skyrise Build & Interiors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {[
          { tag: "Our Vision", title: "A World-Class", highlight: "Legacy", desc: "To be the most trusted name in premium construction and luxury interiors across South India, setting new benchmarks of excellence in every project we deliver." },
          { tag: "Our Mission", title: "Crafting Dreams", highlight: "Into Reality", desc: "To deliver exceptional construction and interior design solutions that exceed client expectations through innovative design, superior craftsmanship, and transparent processes." },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="border border-white/5 p-10 hover:border-gold/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <p className="section-tag">{item.tag}</p>
            <h3 className="font-display text-3xl text-white mb-2">
              {item.title} <span className="text-gold">{item.highlight}</span>
            </h3>
            <div className="gold-divider" />
            <p className="text-silver/50 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Values() {
  const values = [
    { Icon: Gem, title: "Quality", desc: "Uncompromising standards in materials and workmanship" },
    { Icon: Handshake, title: "Integrity", desc: "Honest pricing, transparent processes, and ethical practices" },
    { Icon: Flame, title: "Innovation", desc: "Embracing cutting-edge designs and construction technologies" },
    { Icon: Heart, title: "Client-First", desc: "Your satisfaction is our primary measure of success" },
  ];
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-tag mx-auto justify-center">Core Values</p>
          <h2 className="heading-section text-white">What <span className="text-gold">Drives</span> Us</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={i}
              className="text-center p-8 border border-white/5 hover:border-gold/20 group transition-all"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-gold mb-4 flex justify-center"><v.Icon size={36} /></div>
              <h4 className="font-display text-xl text-white group-hover:text-gold transition-colors mb-2">{v.title}</h4>
              <p className="text-silver/40 text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ team }) {
  if (!team?.length) return null;
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-tag mx-auto justify-center">The People</p>
          <h2 className="heading-section text-white">Meet Our <span className="text-gold">Team</span></h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member._id}
              className="group text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="relative mb-4 overflow-hidden">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full aspect-square bg-navy border border-white/5 flex items-center justify-center">
                    <span className="text-4xl text-gold/30 font-display font-bold">{member.name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all" />
              </div>
              <h4 className="text-white font-semibold group-hover:text-gold transition-colors text-sm">{member.name}</h4>
              <p className="text-gold text-xs tracking-widest uppercase mt-1">{member.designation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const { data: teamData } = useQuery({ queryKey: ["team"], queryFn: () => publicApi.getTeam() });
  const { data: settingsData } = useQuery({ queryKey: ["settings"], queryFn: () => publicApi.getSettings(), staleTime: 600000 });
  const team = teamData?.data?.team;
  const settings = settingsData?.data?.settings || {};

  return (
    <div>
      <PageHero />
      <CompanyIntro settings={settings} />
      <FounderMessage />
      <VisionMission />
      <Values />
      <Team team={team} />
    </div>
  );
}
