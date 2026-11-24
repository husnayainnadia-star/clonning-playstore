import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const CATEGORIES = [
  { name: "Games", slug: "games", icon: "🎮", color: "#4CAF50", description: "Action, strategy, puzzle, and more" },
  { name: "Education", slug: "education", icon: "📚", color: "#2196F3", description: "Learn something new every day" },
  { name: "Entertainment", slug: "entertainment", icon: "📺", color: "#FF9800", description: "Stream, watch, and enjoy" },
  { name: "Social", slug: "social", icon: "👥", color: "#E91E63", description: "Connect with friends and family" },
  { name: "Productivity", slug: "productivity", icon: "💼", color: "#3F51B5", description: "Get more done every day" },
  { name: "Photography", slug: "photography", icon: "📷", color: "#9C27B0", description: "Capture and edit photos" },
  { name: "Finance", slug: "finance", icon: "💰", color: "#009688", description: "Manage your money" },
  { name: "Lifestyle", slug: "lifestyle", icon: "✨", color: "#FF5722", description: "Live your best life" },
  { name: "Health & Fitness", slug: "health-fitness", icon: "❤️", color: "#F44336", description: "Stay healthy and active" },
  { name: "Shopping", slug: "shopping", icon: "🛍️", color: "#00BCD4", description: "Shop from anywhere" },
  { name: "Music & Audio", slug: "music-audio", icon: "🎵", color: "#673AB7", description: "Listen to music and podcasts" },
  { name: "Tools", slug: "tools", icon: "🔧", color: "#607D8B", description: "Utilities and tools" },
];

const APPS = [
  // Games
  {
    name: "PUBG Mobile",
    developer: "Krafton",
    categorySlug: "games",
    icon: "https://play-lh.googleusercontent.com/JRd05pyBH41qjgsJuWduRJpDeZG0Hnb0yjf2nWqO7VaGKL10-G5UIygxED-WNggVBA",
    screenshots: [
      "https://play-lh.googleusercontent.com/wSZRcfHt8r3UJKvCTKJLJHmZZDPZJ1X4fFRqkekiY9e7WT9qLvQT4lYNYKB7iSI0QoI",
    ],
    description: "PUBG MOBILE is the original battle royale experience from BATTLEGROUNDS. It's the official free-to-play battle royale game on mobile.",
    whatsNew: "New season update with improved graphics and gameplay mechanics.",
    version: "3.4.0",
    size: "1.5 GB",
    minAndroid: "5.1 and up",
    downloads: 500000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: true,
    isEditor: false,
    rating: 4.3,
  },
  {
    name: "Candy Crush Saga",
    developer: "King",
    categorySlug: "games",
    icon: "https://play-lh.googleusercontent.com/DSCwMVSWE-OFxhzGCWbLiRCWUOi7OD0Z6mBpfJHBEkIPl8F-I9gy7L7uh5FMNBo1Kw",
    screenshots: [],
    description: "Start playing Candy Crush Saga today – a legendary puzzle game loved by millions of players around the world.",
    version: "1.280.0",
    size: "140 MB",
    minAndroid: "6.0 and up",
    downloads: 1000000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: true,
    isEditor: true,
    rating: 4.5,
  },
  {
    name: "Subway Surfers",
    developer: "Sybo",
    categorySlug: "games",
    icon: "https://play-lh.googleusercontent.com/vFHQ7KzHlHfBtGvpnkqtqz5m7uVFSzfE5JfSPHmxJJMIxqbN_4JxKJcHpNJm5vOqsA",
    screenshots: [],
    description: "Dash as fast as you can! Dodge the oncoming trains as you help Jack, Tricky and Fresh escape from the grumpy Inspector and his dog.",
    version: "3.44.0",
    size: "158 MB",
    minAndroid: "6.0 and up",
    downloads: 1000000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: false,
    rating: 4.5,
  },
  {
    name: "Roblox",
    developer: "Roblox Corporation",
    categorySlug: "games",
    icon: "https://play-lh.googleusercontent.com/x0hBjAiMZBHMzUdcaRCeznFLQ2rIlJrsTxqILFVnlViqxY3XJRrpNWfCVHJBFkI-r2o",
    screenshots: [],
    description: "Explore millions of immersive experiences created by a global community! Roblox is the ultimate virtual universe that lets you play, create, and be anything you can imagine.",
    version: "2.629.605",
    size: "95 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Everyone 10+",
    isFeatured: true,
    isEditor: true,
    rating: 4.3,
  },

  // Social
  {
    name: "WhatsApp",
    developer: "WhatsApp LLC",
    categorySlug: "social",
    icon: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN",
    screenshots: [],
    description: "WhatsApp Messenger: More than 2 billion people in over 180 countries use WhatsApp to stay in touch with friends and family, anytime and anywhere.",
    version: "2.24.11.73",
    size: "55 MB",
    downloads: 5000000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: true,
    isEditor: false,
    rating: 4.0,
  },
  {
    name: "Instagram",
    developer: "Instagram",
    categorySlug: "social",
    icon: "https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fMrYZqnEFpk0IoVP4LM",
    screenshots: [],
    description: "Instagram is a simple way to capture and share the world's moments. Follow your friends and family to see what they're up to.",
    version: "346.0.0",
    size: "45 MB",
    downloads: 5000000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: true,
    isEditor: false,
    rating: 4.0,
  },
  {
    name: "TikTok",
    developer: "TikTok Pte. Ltd.",
    categorySlug: "social",
    icon: "https://play-lh.googleusercontent.com/iBYjvYuNq8BB7EEEHkturl33nSW8POLKNwLXBVTFbFtOOLSASRkCVvNMiKkH2BzjVE8",
    screenshots: [],
    description: "TikTok is the leading short video platform and destination for short-form mobile videos.",
    version: "36.4.3",
    size: "78 MB",
    downloads: 3000000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: false,
    isEditor: false,
    rating: 4.4,
  },

  // Productivity
  {
    name: "Microsoft Office",
    developer: "Microsoft Corporation",
    categorySlug: "productivity",
    icon: "https://play-lh.googleusercontent.com/jMCdJL6VYNGENZQxBQGqj9UX4fT2kLUSCQS97XNyxA6lqHZXWVvLSMiaqeQIZJTi2w",
    screenshots: [],
    description: "The Microsoft 365 productivity suite includes Word, Excel, and PowerPoint — the world's most popular productivity apps.",
    version: "16.0.17628",
    size: "90 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: true,
    isEditor: true,
    rating: 4.6,
  },
  {
    name: "Google Drive",
    developer: "Google LLC",
    categorySlug: "productivity",
    icon: "https://play-lh.googleusercontent.com/8sBUjUY2YoqQ64_Rxq9v6mNa4Mwg0EYmUbwVdyvkzKNRe5uK8-LT-S9HA6nH3zqnPCW",
    screenshots: [],
    description: "Google Drive is a safe place for all your files. Put anything in Drive – your documents, videos, photos, and more.",
    version: "2.24.137",
    size: "35 MB",
    downloads: 5000000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: false,
    rating: 4.3,
  },
  {
    name: "Notion",
    developer: "Notion Labs, Inc.",
    categorySlug: "productivity",
    icon: "https://play-lh.googleusercontent.com/MFqXHSSAA6Rr2hGPGBr5NZPl-uc4FvCU2gBODQ62CdYLPONT8Hf_5P-kkMvHFyH3P2Y",
    screenshots: [],
    description: "Notion is a workspace that adapts to your needs. It's as minimal or as powerful as you need it to be.",
    version: "0.6.2271",
    size: "50 MB",
    downloads: 10000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: true,
    rating: 4.4,
  },

  // Music
  {
    name: "Spotify",
    developer: "Spotify AB",
    categorySlug: "music-audio",
    icon: "https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM",
    screenshots: [],
    description: "With Spotify, you have access to a world of music. You can listen to artists and albums, or create your own playlist of your favorite songs.",
    version: "8.9.98",
    size: "50 MB",
    downloads: 1000000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: true,
    isEditor: true,
    rating: 4.3,
  },
  {
    name: "YouTube Music",
    developer: "Google LLC",
    categorySlug: "music-audio",
    icon: "https://play-lh.googleusercontent.com/GnYmP_p8HeTGflOjvbqeN6gIHYbijWQS6b7GQ3UHMl5J9bJd7TMxjR_HjkRN8ZeG03RB",
    screenshots: [],
    description: "YouTube Music offers a fresh take on music discovery and listening. YouTube Music offers the official songs, albums, thousands of playlists and artist radio.",
    version: "7.07.53",
    size: "36 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: false,
    isEditor: false,
    rating: 4.0,
  },

  // Finance
  {
    name: "PayPal",
    developer: "PayPal Mobile",
    categorySlug: "finance",
    icon: "https://play-lh.googleusercontent.com/F1YVB-ZbxRHJbQC4DKJJF0mBpVAQqxZmEjhLfVuHMjTd0rVHZ1b1uRIkLgOSqJkLCE",
    screenshots: [],
    description: "PayPal is the faster, safer way to send money, make an online payment, receive money or set up a merchant account.",
    version: "8.75.1",
    size: "60 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: false,
    rating: 4.3,
  },

  // Health
  {
    name: "Samsung Health",
    developer: "Samsung Electronics Co., Ltd.",
    categorySlug: "health-fitness",
    icon: "https://play-lh.googleusercontent.com/YrVjI-sFaqy7NjGrI8tKfxN9xP1HB9YZ-IaEkF6NbeSXiRLERi6mQTZsVSWTkFaGKg",
    screenshots: [],
    description: "Samsung Health helps to create a balanced lifestyle pattern by recording a variety of information like your food, activity and sleep.",
    version: "6.26.0",
    size: "112 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: false,
    rating: 4.3,
  },

  // Shopping
  {
    name: "Amazon Shopping",
    developer: "Amazon Mobile LLC",
    categorySlug: "shopping",
    icon: "https://play-lh.googleusercontent.com/EhBzCjCjuoNHiEMDkdKRXRZRdSJfBIRPIHC7h9CdVovpf7vJ6lX9jPRSLnG0LaDFQ4A",
    screenshots: [],
    description: "Shop millions of products from Amazon and thousands of other sellers. Search, compare prices, pay, and track orders.",
    version: "32.14.0",
    size: "52 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: false,
    rating: 4.3,
  },

  // Entertainment
  {
    name: "Netflix",
    developer: "Netflix, Inc.",
    categorySlug: "entertainment",
    icon: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI",
    screenshots: [],
    description: "Netflix is the world's leading streaming entertainment service with 220 million paid memberships in over 190 countries.",
    version: "8.117.0",
    size: "30 MB",
    downloads: 1000000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: true,
    isEditor: false,
    rating: 4.3,
  },
  {
    name: "YouTube",
    developer: "Google LLC",
    categorySlug: "entertainment",
    icon: "https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc",
    screenshots: [],
    description: "See what the world is watching – from the hottest music videos to what's trending in gaming, entertainment, news and more.",
    version: "19.21.33",
    size: "35 MB",
    downloads: 10000000000,
    isFree: true,
    contentRating: "Teen",
    isFeatured: true,
    isEditor: true,
    rating: 4.3,
  },

  // Photography
  {
    name: "Snapseed",
    developer: "Google LLC",
    categorySlug: "photography",
    icon: "https://play-lh.googleusercontent.com/drAFPQ4hklaBGDPVEkJmeSoxqJz0dQdK3AqpTT5bGMoJoFhfH5JyOxvPvVcBvW0iBQ",
    screenshots: [],
    description: "Snapseed is a complete and professional photo editor developed by Google. It's intuitive, beautiful, and free.",
    version: "2.21.0",
    size: "30 MB",
    downloads: 100000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: true,
    rating: 4.5,
  },

  // Education
  {
    name: "Duolingo",
    developer: "Duolingo",
    categorySlug: "education",
    icon: "https://play-lh.googleusercontent.com/N3NKBgJG27VeSVrlrAYKJbh8pHTlBo5Dri3rk9X-hT_MfQfPGl9nsBwxEMQ35ZJFN4s",
    screenshots: [],
    description: "Learn a new language for free with Duolingo. The most fun and effective way to learn a language!",
    version: "5.161.1",
    size: "50 MB",
    downloads: 500000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: true,
    isEditor: true,
    rating: 4.6,
  },
  {
    name: "Khan Academy",
    developer: "Khan Academy",
    categorySlug: "education",
    icon: "https://play-lh.googleusercontent.com/VLpLK2l_x8AuAE2Y3AFEuOGG3Jl1qUJnWVFjGSmYrRWqMNVN6_l4WfG3B1O6oCT1nQ",
    screenshots: [],
    description: "Khan Academy offers practice exercises, instructional videos, and a personalized learning dashboard.",
    version: "6.3.0",
    size: "24 MB",
    downloads: 10000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: true,
    rating: 4.6,
  },

  // Tools
  {
    name: "Google Chrome",
    developer: "Google LLC",
    categorySlug: "tools",
    icon: "https://play-lh.googleusercontent.com/KwUBNPbMTk9jDXYS2AeX3illtVRTkrKVh5xR1Mg4WHd0CG2tV4mrh1z3kXi5z_warlk",
    screenshots: [],
    description: "Google Chrome is a fast, easy to use, and secure web browser. Designed for Android, Chrome brings you personalized news articles.",
    version: "131.0.6778.135",
    size: "80 MB",
    downloads: 10000000000,
    isFree: true,
    contentRating: "Everyone",
    isFeatured: false,
    isEditor: false,
    rating: 4.3,
  },
];

const BANNERS = [
  {
    title: "New Games This Week",
    subtitle: "Discover the hottest new games",
    imageUrl: "https://play-lh.googleusercontent.com/DSCwMVSWE-OFxhzGCWbLiRCWUOi7OD0Z6mBpfJHBEkIPl8F-I9gy7L7uh5FMNBo1Kw",
    isActive: true,
    order: 1,
  },
  {
    title: "Editor's Choice",
    subtitle: "The best apps of the month",
    imageUrl: "https://play-lh.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM",
    isActive: true,
    order: 2,
  },
  {
    title: "Learn Something New",
    subtitle: "Education apps to boost your skills",
    imageUrl: "https://play-lh.googleusercontent.com/N3NKBgJG27VeSVrlrAYKJbh8pHTlBo5Dri3rk9X-hT_MfQfPGl9nsBwxEMQ35ZJFN4s",
    isActive: true,
    order: 3,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Categories
  console.log("Creating categories...");
  const categoryMap: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    const existing = await db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.slug, cat.slug),
    });
    if (!existing) {
      const [inserted] = await db.insert(schema.categories).values(cat).returning({ id: schema.categories.id, slug: schema.categories.slug });
      categoryMap[cat.slug] = inserted.id;
    } else {
      categoryMap[cat.slug] = existing.id;
    }
  }

  // Apps
  console.log("Creating apps...");
  for (const appData of APPS) {
    const { categorySlug, rating: appRating, ...rest } = appData;
    const categoryId = categoryMap[categorySlug];
    const slug = rest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const existing = await db.query.applications.findFirst({
      where: (a, { eq }) => eq(a.name, rest.name),
    });

    if (!existing) {
      await db.insert(schema.applications).values({
        ...rest,
        slug,
        categoryId,
        rating: String(appRating),
        screenshots: rest.screenshots || [],
      });
    }
  }

  // Admin user
  console.log("Creating admin user...");
  const adminEmail = "admin@playstore.com";
  const existingAdmin = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, adminEmail),
  });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123456", 12);
    await db.insert(schema.users).values({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin created: admin@playstore.com / admin123456");
  }

  // Banners
  console.log("Creating banners...");
  for (const banner of BANNERS) {
    await db.insert(schema.banners).values(banner).onConflictDoNothing();
  }

  console.log("✅ Seeding complete!");
}

seed().catch(console.error);
