import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryTile {
  slug: string;
  name: string;
  count: string;
  image: string;
  desc: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    slug: "door-locks",
    name: "Door Locks",
    count: "18 SKUs",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
    desc: "Mortise cylinders, euro profile bodies & smart biometric locks.",
  },
  {
    slug: "handles",
    name: "Handles",
    count: "14 SKUs",
    image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800",
    desc: "Forged brass lever sets, pull handles & architectural hardware.",
  },
  {
    slug: "bolts-latches",
    name: "Bolts & Latches",
    count: "12 SKUs",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    desc: "Flush tower bolts, magnetic latches & concealed deadbolts.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    count: "9 SKUs",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
    desc: "Concealed 3D ball hinges, hydraulic closers & escutcheons.",
  },
];

export default function CategoryShelf() {
  return (
    <section className="py-16 bg-steel-100/50 border-b border-steel-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-space font-bold text-2xl sm:text-3xl text-graphite-900">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/category/door-locks"
            className="text-xs font-mono font-semibold text-brass-600 hover:text-brass-700 flex items-center gap-1 uppercase tracking-wider whitespace-nowrap"
          >
            View all categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group bg-white hairline-border hover:border-brass-600 transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative w-full h-48 bg-steel-100 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-[1.05]"
                />
                <div className="absolute top-3 right-3 bg-graphite-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {cat.count}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-space font-bold text-lg text-graphite-900 group-hover:text-brass-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-steel-500 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-steel-100 flex items-center justify-between text-xs font-semibold text-graphite-900 group-hover:text-brass-600">
                  <span>Explore items</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
