import { db } from "@/lib/db";

export interface ProductData {
  id: string;
  name: string;
  sku: string;
  description: string;
  basePrice: number;
  dealerPrice: number;
  stock: number;
  finish: string;
  images: string;
  specs: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const FALLBACK_PRODUCTS: ProductData[] = [
  {
    id: "prod-1",
    name: "ProShield-X Heavy Mortise Lock Cylinder 70mm",
    sku: "NFL-LC-701",
    description:
      "High security 6-pin brass euro profile mortise lock cylinder engineered to 0.02mm tolerance with anti-drill hardened steel pins.",
    basePrice: 1850,
    dealerPrice: 1250,
    stock: 120,
    finish: "Brushed Brass",
    categoryId: "door-locks",
    category: { id: "cat-locks", name: "Door Locks", slug: "door-locks" },
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    ]),
    specs: JSON.stringify({
      Material: "Forged Solid Brass",
      "Keying Type": "Computerised Dimple Keys (5 Included)",
      "Security Grade": "ANSI Grade 1 / EN 1303",
      "Mechanism Life": "Tested to 250,000 Cycles",
      "Backset Compatibility": "50mm / 60mm Standard Mortise",
      Warranty: "10 Years Mechanical",
    }),
  },
  {
    id: "prod-2",
    name: "Apex Series Solid Brass Lever Handle Pair",
    sku: "NFL-HD-302",
    description:
      "Minimalist ergonomic mortise handle set with spring-loaded brass rose and dual concealed screw fixing points.",
    basePrice: 3400,
    dealerPrice: 2200,
    stock: 85,
    finish: "Satin Chrome",
    categoryId: "handles",
    category: { id: "cat-handles", name: "Handles", slug: "handles" },
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800",
    ]),
    specs: JSON.stringify({
      Material: "Grade 304 Solid Brass",
      Spindle: "8x8mm Hardened Steel",
      Rosette: "52mm Diameter x 10mm Slim Rose",
      Coating: "PVD Anti-Fingerprint Finish",
      Warranty: "5 Years Mechanical",
    }),
  },
  {
    id: "prod-3",
    name: "Titan-Vault Biometric Smart Lock Handle",
    sku: "NFL-SL-900",
    description:
      "Integrated fingerprint, PIN, RFID card, and emergency mechanical key access mortise lock with dual-bolt deadlock.",
    basePrice: 14500,
    dealerPrice: 9800,
    stock: 40,
    finish: "Matte Black",
    categoryId: "door-locks",
    category: { id: "cat-locks", name: "Door Locks", slug: "door-locks" },
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
    ]),
    specs: JSON.stringify({
      "Authentication Methods": "Biometric 0.3s, Passcode, RFID, Mechanical Key",
      Power: "4x AA Alkaline (12-month battery life)",
      Emergency: "USB-C Power Port + Override Key",
      "Mortise Body": "Stainless Steel 3-Latch Deadlock",
      Warranty: "3 Years Electronic & Mechanical",
    }),
  },
  {
    id: "prod-4",
    name: "Precision Heavy Duty Concealed Tower Bolt 8-Inch",
    sku: "NFL-BL-108",
    description:
      "Flush fit mortise tower bolt for double doors with smooth rod action and dustproof strike socket.",
    basePrice: 780,
    dealerPrice: 490,
    stock: 200,
    finish: "Brushed Brass",
    categoryId: "bolts-latches",
    category: { id: "cat-bolts", name: "Bolts & Latches", slug: "bolts-latches" },
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    ]),
    specs: JSON.stringify({
      Material: "Solid Extruded Brass",
      Length: "200mm (8 Inches)",
      Strike: "Floor & Frame Dustproof Socket",
      Warranty: "10 Years",
    }),
  },
  {
    id: "prod-5",
    name: "Silent-Close Magnetic Privacy Latch 50mm",
    sku: "NFL-LT-502",
    description:
      "Architectural magnetic mortise latch offering near-silent closing action without projecting latch bolt when door is open.",
    basePrice: 1150,
    dealerPrice: 750,
    stock: 150,
    finish: "Antique Bronze",
    categoryId: "bolts-latches",
    category: { id: "cat-bolts", name: "Bolts & Latches", slug: "bolts-latches" },
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    ]),
    specs: JSON.stringify({
      "Latch Type": "Neodymium Magnetic Strike",
      Backset: "50mm Center",
      Operation: "Ultra Silent Spring Free Action",
      Warranty: "5 Years",
    }),
  },
  {
    id: "prod-6",
    name: "Concealed 3D Adjustable Ball Bearing Hinge (Set of 3)",
    sku: "NFL-AC-404",
    description:
      "Heavy-capacity concealed door hinges supporting up to 80kg per door leaf with 3-way millimetric adjustment.",
    basePrice: 2890,
    dealerPrice: 1850,
    stock: 90,
    finish: "Satin Chrome",
    categoryId: "accessories",
    category: { id: "cat-accessories", name: "Accessories", slug: "accessories" },
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
    ]),
    specs: JSON.stringify({
      Capacity: "80kg Door Weight (3 Hinges)",
      Adjustability: "Height ±2.5mm, Side ±1.5mm, Depth ±1.0mm",
      "Opening Angle": "180 Degrees",
      Warranty: "10 Years",
    }),
  },
];

export async function getProducts(): Promise<ProductData[]> {
  try {
    const products = await db.product.findMany({
      include: { category: true },
    });
    if (products && products.length > 0) return products;
  } catch (e) {
    // Database fallback during static export / dev init
  }
  return FALLBACK_PRODUCTS;
}

export async function getProductById(id: string): Promise<ProductData | null> {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (product) return product;
  } catch (e) {
    // DB fallback
  }
  return FALLBACK_PRODUCTS.find((p) => p.id === id) || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductData[]> {
  try {
    const products = await db.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: { category: true },
    });
    if (products && products.length > 0) return products;
  } catch (e) {
    // DB fallback
  }
  return FALLBACK_PRODUCTS.filter(
    (p) => p.category?.slug === categorySlug || p.categoryId === categorySlug
  );
}

export async function getProductsByUseCase(useCaseSlug: string): Promise<ProductData[]> {
  try {
    const uc = await db.useCase.findUnique({
      where: { slug: useCaseSlug },
      include: {
        products: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (uc && uc.products) {
      return uc.products.map((p) => p.product);
    }
  } catch (e) {
    // DB fallback
  }

  // Fallback matching
  if (useCaseSlug === "main-entrance") {
    return FALLBACK_PRODUCTS.filter((p) => ["prod-1", "prod-3", "prod-4"].includes(p.id));
  } else if (useCaseSlug === "bedroom") {
    return FALLBACK_PRODUCTS.filter((p) => ["prod-2", "prod-4", "prod-5"].includes(p.id));
  } else if (useCaseSlug === "bathroom") {
    return FALLBACK_PRODUCTS.filter((p) => ["prod-4", "prod-5"].includes(p.id));
  } else if (useCaseSlug === "office") {
    return FALLBACK_PRODUCTS.filter((p) => ["prod-1", "prod-2", "prod-3", "prod-6"].includes(p.id));
  }

  return FALLBACK_PRODUCTS;
}
