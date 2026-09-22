import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Engineering Journal & Insights — Nafi Lock Industries",
  description:
    "Expert articles on lock metallurgy, security standards, precision pin tumbler mechanics, and architectural hardware from Nafi Lock Industries.",
};

interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
}

const POSTS: BlogPost[] = [
  {
    slug: "solid-brass-vs-zinc-alloy-padlocks",
    title: "Solid Forged Brass vs. Zinc Alloy: Why Foundry Purity Matters in Padlock Security",
    category: "Metallurgy & Foundry",
    date: "Sep 2026",
    readTime: "5 min read",
    excerpt:
      "A microscopic look into grain density, tensile fracture thresholds, and why virgin copper-zinc alloys resist hydraulic wedge and cold-chisel attacks.",
    image: "/products/s-nafi-classic-50.jpg",
  },
  {
    slug: "understanding-boron-alloy-shackles",
    title: "Understanding Case-Hardened Boron Steel Shackles: 60+ HRC Rockwell Defense",
    category: "Security Engineering",
    date: "Aug 2026",
    readTime: "7 min read",
    excerpt:
      "How cryogenic quenching and induction case-hardening create shackles that break manual 42-inch bolt cutters and defeat abrasive hacksaw blades.",
    image: "/products/raksham-armored-block.jpg",
  },
  {
    slug: "architectural-mortise-cylinder-pin-tumblers",
    title: "The Anatomy of High-Security Mortise Cylinders: Anti-Pick Spool Pins & Paracentric Keyways",
    category: "Architectural Hardware",
    date: "Jul 2026",
    readTime: "6 min read",
    excerpt:
      "Inside the 6-pin precision core: exploring how staggered radial pin chambers and mushroom spool pins render bump keys and lockpicks ineffective.",
    image: "/products/s-nafi-mortise-set.jpg",
  },
  {
    slug: "coastal-corrosion-neutral-salt-spray-standards",
    title: "Defeating Coastal Corrosion: Tri-Layer Electroplating and 240h ASTM B117 Standards",
    category: "Finishing & Durability",
    date: "Jun 2026",
    readTime: "4 min read",
    excerpt:
      "Why marine, exterior, and industrial environments demand copper undercoats, bright nickel barrier layers, and micro-lacquer sealing.",
    image: "/products/s-nafi-classic-65.jpg",
  },
];

export default function BlogPage() {
  return (
    <div className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBFBFA]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#A67C2E] border border-[#E8DFCF] text-[11px] font-mono uppercase tracking-widest mb-4">
            <span>Nafi Engineering Journal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4">
            Lockmaking Insights & Technical Rigor
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Deep-dives into metallurgy, high-security cylinder mechanics, ISO certification benchmarks,
            and industrial hardware craftsmanship from our Aligarh foundries.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-[#EBEBEB] hover:border-[#C49A45]/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#A67C2E] border border-[#E8DFCF] shadow-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-xs text-muted mb-3 font-mono">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary group-hover:text-[#A67C2E] transition-colors leading-snug mb-3">
                    {post.title}
                  </h2>

                  <p className="text-muted text-xs sm:text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-6 pt-2">
                <span className="text-xs font-bold text-[#A67C2E] group-hover:text-[#8C6420] flex items-center gap-1">
                  <span>Read Article</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / Factory Consultation */}
        <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Need Custom OEM Lock Specifications?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Consult directly with our metallurgical engineers and CAD designers for bespoke
              keyways, master-keyed suites, and heavy-duty architectural locksets.
            </p>
            <Link
              href="/contact?type=technical_inquiry"
              className="inline-block px-8 py-3.5 rounded-xl bg-[#C49A45] hover:bg-[#B8923F] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:scale-102"
            >
              Consult Engineering Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
