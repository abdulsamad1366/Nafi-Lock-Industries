import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Brands ---
  const snafi = await prisma.brand.upsert({
    where: { slug: "s-nafi" },
    update: {},
    create: {
      slug: "s-nafi",
      name: "S-Nafi",
      tagline: "Premium brass craftsmanship",
      description:
        "S-Nafi represents the flagship line of Nafi Lock Industries — precision-engineered brass locks built to last generations.",
      themeKey: "nafi",
      order: 1,
    },
  });

  const greek = await prisma.brand.upsert({
    where: { slug: "greek" },
    update: {},
    create: {
      slug: "greek",
      name: "Greek",
      tagline: "Classical strength, modern security",
      description:
        "Inspired by the enduring architecture of the ancient world, Greek locks combine iron resilience with timeless design.",
      themeKey: "greek",
      order: 2,
    },
  });

  const raksham = await prisma.brand.upsert({
    where: { slug: "raksham" },
    update: {},
    create: {
      slug: "raksham",
      name: "Raksham",
      tagline: "Guardian-grade protection",
      description:
        "Raksham — meaning protection — delivers hardened steel security for homes, warehouses, and commercial premises.",
      themeKey: "raksham",
      order: 3,
    },
  });

  // --- Categories ---
  const padlocks = await prisma.category.upsert({
    where: { slug: "padlocks" },
    update: {},
    create: { slug: "padlocks", name: "Padlocks" },
  });

  const doorLocks = await prisma.category.upsert({
    where: { slug: "door-locks-mortise" },
    update: {},
    create: { slug: "door-locks-mortise", name: "Door Locks (Mortise)" },
  });

  const cylindrical = await prisma.category.upsert({
    where: { slug: "cylindrical-knob-locks" },
    update: {},
    create: { slug: "cylindrical-knob-locks", name: "Cylindrical/Knob Locks" },
  });

  const cabinet = await prisma.category.upsert({
    where: { slug: "cabinet-drawer-locks" },
    update: {},
    create: { slug: "cabinet-drawer-locks", name: "Cabinet/Drawer Locks" },
  });

  const hasp = await prisma.category.upsert({
    where: { slug: "hasp-staple" },
    update: {},
    create: { slug: "hasp-staple", name: "Hasp & Staple" },
  });

  // --- Products (sample catalog from 09-SAMPLE-PRODUCT-CATALOG.md) ---

  // S-Nafi products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: "s-nafi-classic-padlock-50",
        name: "S-Nafi Classic Padlock 50",
        brandId: snafi.id,
        categoryId: padlocks.id,
        description: "Premium 50mm brass padlock with single bolt mechanism.",
        material: "Brass",
        size: "50mm",
        finish: "Brass Polish",
        numberOfKeys: 3,
        lockingMechanism: "Single bolt",
        warranty: "1 year",
        images: ["/placeholders/padlock.svg"],
      },
      {
        slug: "s-nafi-classic-padlock-65",
        name: "S-Nafi Classic Padlock 65",
        brandId: snafi.id,
        categoryId: padlocks.id,
        description: "Premium 65mm brass padlock with double bolt security.",
        material: "Brass",
        size: "65mm",
        finish: "Chrome",
        numberOfKeys: 3,
        lockingMechanism: "Double bolt",
        warranty: "1 year",
        images: ["/placeholders/padlock.svg"],
      },
      {
        slug: "s-nafi-mortise-lock-set",
        name: "S-Nafi Mortise Lock Set",
        brandId: snafi.id,
        categoryId: doorLocks.id,
        description: "Stainless steel mortise lock set with double bolt action.",
        material: "Stainless Steel",
        size: "Standard",
        finish: "Satin Steel",
        numberOfKeys: 3,
        lockingMechanism: "Double bolt",
        warranty: "1 year",
        images: ["/placeholders/mortise-lock.svg"],
      },
      {
        slug: "s-nafi-cylindrical-knob-lock",
        name: "S-Nafi Cylindrical Knob Lock",
        brandId: snafi.id,
        categoryId: cylindrical.id,
        description: "Zinc alloy cylindrical knob lock with antique brass finish.",
        material: "Zinc Alloy",
        size: "Standard",
        finish: "Antique Brass",
        numberOfKeys: 2,
        lockingMechanism: "Single bolt",
        warranty: "1 year",
        images: ["/placeholders/cylindrical-lock.svg"],
      },
    ],
  });

  // Greek products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: "greek-heritage-padlock-40",
        name: "Greek Heritage Padlock 40",
        brandId: greek.id,
        categoryId: padlocks.id,
        description: "Iron padlock with classical design, 40mm body.",
        material: "Iron",
        size: "40mm",
        finish: "Black",
        numberOfKeys: 2,
        lockingMechanism: "Single bolt",
        warranty: "1 year",
        images: ["/placeholders/greek-padlock.svg"],
      },
      {
        slug: "greek-heritage-padlock-50",
        name: "Greek Heritage Padlock 50",
        brandId: greek.id,
        categoryId: padlocks.id,
        description: "Iron padlock with antique bronze finish, 50mm body.",
        material: "Iron",
        size: "50mm",
        finish: "Antique Bronze",
        numberOfKeys: 2,
        lockingMechanism: "Single bolt",
        warranty: "1 year",
        images: ["/placeholders/greek-padlock.svg"],
      },
      {
        slug: "greek-cabinet-lock-set",
        name: "Greek Cabinet Lock Set",
        brandId: greek.id,
        categoryId: cabinet.id,
        description: "Zinc alloy cabinet lock with chrome finish.",
        material: "Zinc Alloy",
        size: "Standard",
        finish: "Chrome",
        numberOfKeys: 2,
        lockingMechanism: "Single bolt",
        warranty: "1 year",
        images: ["/placeholders/cabinet-lock.svg"],
      },
    ],
  });

  // Raksham products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: "raksham-guard-padlock-50",
        name: "Raksham Guard Padlock 50",
        brandId: raksham.id,
        categoryId: padlocks.id,
        description: "Hardened steel padlock with double bolt, 50mm body.",
        material: "Hardened Steel",
        size: "50mm",
        finish: "Black",
        numberOfKeys: 3,
        lockingMechanism: "Double bolt",
        warranty: "1 year",
        images: ["/placeholders/raksham-padlock.svg"],
      },
      {
        slug: "raksham-guard-padlock-65",
        name: "Raksham Guard Padlock 65",
        brandId: raksham.id,
        categoryId: padlocks.id,
        description: "Hardened steel padlock with gunmetal finish, 65mm body.",
        material: "Hardened Steel",
        size: "65mm",
        finish: "Gunmetal",
        numberOfKeys: 3,
        lockingMechanism: "Double bolt",
        warranty: "1 year",
        images: ["/placeholders/raksham-padlock.svg"],
      },
      {
        slug: "raksham-hasp-staple-heavy-duty",
        name: "Raksham Hasp & Staple Heavy Duty",
        brandId: raksham.id,
        categoryId: hasp.id,
        description: "Heavy-duty steel hasp and staple, zinc plated for corrosion resistance.",
        material: "Steel",
        size: "6 inch",
        finish: "Zinc Plated",
        numberOfKeys: 0,
        lockingMechanism: "N/A",
        warranty: "1 year",
        images: ["/placeholders/hasp-staple.svg"],
      },
      {
        slug: "raksham-mortise-lock-set",
        name: "Raksham Mortise Lock Set",
        brandId: raksham.id,
        categoryId: doorLocks.id,
        description: "Steel mortise lock set with black finish and double bolt action.",
        material: "Steel",
        size: "Standard",
        finish: "Black",
        numberOfKeys: 3,
        lockingMechanism: "Double bolt",
        warranty: "1 year",
        images: ["/placeholders/raksham-padlock.svg"],
      },
    ],
  });

  console.log("✅ Seed complete: 3 brands, 5 categories, 11 sample products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
