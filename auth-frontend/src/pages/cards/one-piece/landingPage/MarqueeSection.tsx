// A full-width premium marquee component showcasing One Piece characters.
// Uses Tailwind classes and a small CSS block for animation and custom colors.

export default function OnePieceMarquee() {
  const characters = [
    "Monkey D. Luffy",
    "Roronoa Zoro",
    "Nami",
    "Usopp",
    "Sanji",
    "Tony Tony Chopper",
    "Nico Robin",
    "Franky",
    "Brook",
    "Jinbe",
    "Portgas D. Ace",
    "Sabo",
    "Shanks",
    "Boa Hancock",
    "Trafalgar D. Water Law",
    "Eustass Kid",
    "Dracule Mihawk",
    "Crocodile",
    "Donquixote Doflamingo",
    "Charlotte Katakuri",
    "Big Mom",
    "Kaido",
    "Yamato",
    "Silvers Rayleigh",
    "Gol D. Roger",
    "Kozuki Oden",
    "Buggy",
    "Smoker",
    "Rob Lucci",
    "Enel"
  ];

  // Create a seamless loop by duplicating enough times
  // More duplicates ensure smooth animation
  const longList = [...characters, ...characters, ...characters, ...characters];

  return (
    <section className="w-full overflow-hidden">
      <style>{`
        :root{
          --luffy-yellow: #fdd18e;
          --straw-red: #c0392b;
          --anime-black: #1c1c1c;
          --sea-blue: #0097a7;
          --parchment: #f6f2ee;
        }

        .op-marquee-wrap {
          background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(28,28,28,0.9) 60%);
          padding: 14px 18px;
          box-shadow: 0 6px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.03);
          position: relative;
          overflow: hidden;
        }

        .op-marquee {
          display: flex;
          gap: 28px;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          /* Infinite animation at constant speed */
          animation: marquee 80s linear infinite;
        }

        /* Pause on hover for better UX */
        .op-marquee-wrap:hover .op-marquee {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%); /* Move half of the duplicated content */
          }
        }

        .op-chip {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.02) inset;
          background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.03);
          flex-shrink: 0; /* Prevent items from shrinking */
        }

        .op-avatar {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 999px;
          display: inline-grid;
          place-items: center;
          font-weight: 800;
          color: var(--anime-black);
          box-shadow: 0 4px 12px rgba(0,0,0,0.45);
          border: 2px solid rgba(0,0,0,0.25);
        }

        /* color variants */
        .c-luffy { background: var(--luffy-yellow); }
        .c-straw { background: var(--straw-red); color: #fff; }
        .c-sea { background: var(--sea-blue); color: #fff; }
        .c-parch { background: var(--parchment); }

        /* responsive tweaks */
        @media (max-width: 768px){
          .op-chip { padding: 8px 12px; font-size: 13px; gap: 8px; }
          .op-avatar { width: 30px; height: 30px; min-width: 30px; font-size: 12px; }
          .op-marquee { gap: 14px; animation-duration: 60s; }
        }

        /* For very small screens */
        @media (max-width: 480px){
          .op-marquee { animation-duration: 40s; }
          .op-chip { padding: 6px 10px; font-size: 12px; }
          .op-avatar { width: 26px; height: 26px; min-width: 26px; }
        }

      `}</style>

      <div className="op-marquee-wrap w-full">
        <div className="op-marquee" aria-label="One Piece characters marquee">
          {longList.map((name, idx) => {
            // choose a color variant by index for variety
            const mod = idx % 4;
            const avatarBg = mod === 0 ? "c-luffy" : mod === 1 ? "c-straw" : mod === 2 ? "c-sea" : "c-parch";
            const initials = name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("");

            return (
              <div className="op-chip" key={`${name}-${idx}`}>
                <div className={`op-avatar ${avatarBg}`} aria-hidden>
                  {initials}
                </div>
                <div className="text-white/90">{name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}