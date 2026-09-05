import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding NAFI Lock Industries database...");

  // Clean existing tables
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dealerApplication.deleteMany();
  await prisma.productUseCase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.useCase.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const retailUser = await prisma.user.create({
    data: {
      email: "customer@nafilocks.com",
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      role: "retail",
    },
  });

  const dealerUser = await prisma.user.create({
    data: {
      email: "dealer@hardwarehub.in",
      name: "Vikram Mehta",
      phone: "+91 98111 22334",
      role: "dealer",
      companyName: "Hardware Hub Pvt Ltd",
      gstin: "27AAACH1234F1Z9",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@nafilocks.com",
      name: "Nafi Master Admin",
      phone: "+91 99999 00000",
      role: "admin",
    },
  });

  // Create Categories
  const catLocks = await prisma.category.create({
    data: {
      name: "Door Locks",
      slug: "door-locks",
      description: "Heavy duty mortise lock bodies, euro cylinders, and smart digital locking units.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
    },
  });

  const catHandles = await prisma.category.create({
    data: {
      name: "Handles",
      slug: "handles",
      description: "Architectural lever handles, pull handles, and tactile solid brass hardware.",
      image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800",
    },
  });

  const catBolts = await prisma.category.create({
    data: {
      name: "Bolts & Latches",
      slug: "bolts-latches",
      description: "Precision concealed deadbolts, tower bolts, magnetic latches, and night latches.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Concealed ball-bearing hinges, door closers, escutcheons, and keyways.",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
    },
  });

  // Create Use Cases
  const ucMain = await prisma.useCase.create({ data: { name: "Main Entrance", slug: "main-entrance" } });
  const ucBedroom = await prisma.useCase.create({ data: { name: "Bedroom", slug: "bedroom" } });
  const ucBathroom = await prisma.useCase.create({ data: { name: "Bathroom", slug: "bathroom" } });
  const ucKitchen = await prisma.useCase.create({ data: { name: "Kitchen", slug: "kitchen" } });
  const ucWardrobe = await prisma.useCase.create({ data: { name: "Wardrobe", slug: "wardrobe" } });
  const ucOffice = await prisma.useCase.create({ data: { name: "Office", slug: "office" } });

  // Create Products
  const productsData = [
    {
      name: "ProShield-X Heavy Mortise Lock Cylinder 70mm",
      sku: "NFL-LC-701",
      description: "High security 6-pin brass euro profile mortise lock cylinder engineered to 0.02mm tolerance with anti-drill hardened steel pins.",
      basePrice: 1850,
      dealerPrice: 1250,
      stock: 120,
      finish: "Brushed Brass",
      categoryId: catLocks.id,
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
      useCases: [ucMain.id, ucOffice.id],
    },
    {
      name: "Apex Series Solid Brass Lever Handle Pair",
      sku: "NFL-HD-302",
      description: "Minimalist ergonomic mortise handle set with spring-loaded brass rose and dual concealed screw fixing points.",
      basePrice: 3400,
      dealerPrice: 2200,
      stock: 85,
      finish: "Satin Chrome",
      categoryId: catHandles.id,
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
      useCases: [ucBedroom.id, ucOffice.id, ucMain.id],
    },
    {
      name: "Titan-Vault Biometric Smart Lock Handle",
      sku: "NFL-SL-900",
      description: "Integrated fingerprint, PIN, RFID card, and emergency mechanical key access mortise lock with dual-bolt deadlock.",
      basePrice: 14500,
      dealerPrice: 9800,
      stock: 40,
      finish: "Matte Black",
      categoryId: catLocks.id,
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
      useCases: [ucMain.id, ucOffice.id],
    },
    {
      name: "Precision Heavy Duty Concealed Tower Bolt 8-Inch",
      sku: "NFL-BL-108",
      description: "Flush fit mortise tower bolt for double doors with smooth rod action and dustproof strike socket.",
      basePrice: 780,
      dealerPrice: 490,
      stock: 200,
      finish: "Brushed Brass",
      categoryId: catBolts.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      ]),
      specs: JSON.stringify({
        Material: "Solid Extruded Brass",
        Length: "200mm (8 Inches)",
        Strike: "Floor & Frame Dustproof Socket",
        Warranty: "10 Years",
      }),
      useCases: [ucMain.id, ucBedroom.id, ucBathroom.id],
    },
    {
      name: "Silent-Close Magnetic Privacy Latch 50mm",
      sku: "NFL-LT-502",
      description: "Architectural magnetic mortise latch offering near-silent closing action without projecting latch bolt when door is open.",
      basePrice: 1150,
      dealerPrice: 750,
      stock: 150,
      finish: "Antique Bronze",
      categoryId: catBolts.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      ]),
      specs: JSON.stringify({
        "Latch Type": "Neodymium Magnetic Strike",
        Backset: "50mm Center",
        Operation: "Ultra Silent Spring Free Action",
        Warranty: "5 Years",
      }),
      useCases: [ucBathroom.id, ucBedroom.id],
    },
    {
      name: "Concealed 3D Adjustable Ball Bearing Hinge (Set of 3)",
      sku: "NFL-AC-404",
      description: "Heavy-capacity concealed door hinges supporting up to 80kg per door leaf with 3-way millimetric adjustment.",
      basePrice: 2890,
      dealerPrice: 1850,
      stock: 90,
      finish: "Satin Chrome",
      categoryId: catAccessories.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
      ]),
      specs: JSON.stringify({
        Capacity: "80kg Door Weight (3 Hinges)",
        Adjustability: "Height ±2.5mm, Side ±1.5mm, Depth ±1.0mm",
        "Opening Angle": "180 Degrees",
        Warranty: "10 Years",
      }),
      useCases: [ucMain.id, ucBedroom.id, ucOffice.id],
    },
    {
      name: "Heritage Cabinet Pull Handle 160mm",
      sku: "NFL-HD-088",
      description: "Solid milled brass cabinet pull handle tailored for custom wardrobes, kitchen cabinetry, and executive desk drawers.",
      basePrice: 620,
      dealerPrice: 380,
      stock: 250,
      finish: "Brushed Brass",
      categoryId: catHandles.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800",
      ]),
      specs: JSON.stringify({
        "Hole Centers": "160mm",
        "Overall Length": "192mm",
        Material: "Solid Milled Brass Bar",
        Warranty: "5 Years",
      }),
      useCases: [ucWardrobe.id, ucKitchen.id, ucOffice.id],
    },
    {
      name: "Hydraulic Overhead Soft-Close Door Closer",
      sku: "NFL-AC-990",
      description: "EN 1154 certified adjustable power overhead door closer with hydraulic latching speed control.",
      basePrice: 4200,
      dealerPrice: 2800,
      stock: 60,
      finish: "Matte Black",
      categoryId: catAccessories.id,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
      ]),
      specs: JSON.stringify({
        Power: "EN 2-4 Adjustable",
        "Max Door Width": "1100mm",
        "Max Door Weight": "80kg",
        Certification: "Fire Rated UL / EN 1634",
        Warranty: "5 Years",
      }),
      useCases: [ucOffice.id, ucMain.id],
    },
  ];

  for (const item of productsData) {
    const { useCases, ...pData } = item;
    const prod = await prisma.product.create({
      data: pData,
    });

    for (const ucId of useCases) {
      await prisma.productUseCase.create({
        data: {
          productId: prod.id,
          useCaseId: ucId,
        },
      });
    }
  }

  // Create sample Dealer Application
  await prisma.dealerApplication.create({
    data: {
      userId: dealerUser.id,
      companyName: "Hardware Hub Pvt Ltd",
      gstin: "27AAACH1234F1Z9",
      phone: "+91 98111 22334",
      address: "Industrial Area Phase 2, Mumbai, Maharashtra 400080",
      status: "approved",
    },
  });

  console.log("Database successfully seeded with categories, use-cases, products, users, and dealer profiles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
