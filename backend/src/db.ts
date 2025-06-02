import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq } from "drizzle-orm";
import { type NewProduct, type NewUser, products, users } from "./db/schema";
import { hashPassword } from "./auth";

const sqlite = new Database(process.env.DB_filename!);
export const db = drizzle(sqlite);

// Seed with test data
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if user already exists
    const existingUser = await db.select().from(users).where(
      eq(users.email, "test@example.com"),
    ).get();

    if (!existingUser) {
      const hashedPassword = await hashPassword("password123");
      const newUser: NewUser = {
        email: "test@example.com",
        password: hashedPassword,
      };
      await db.insert(users).values(newUser);
      console.log("✅ Test user created");
    } else {
      console.log("👤 Test user already exists");
    }

    // Check if products already exist
    const existingProducts = await db.select().from(products);

    if (existingProducts.length === 0) {
      const sampleProducts: NewProduct[] = [
        {
          name: "Laptop",
          price: 999.99,
          imageUrl:
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Headphones",
          price: 199.99,
          imageUrl:
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Mouse",
          price: 49.99,
          imageUrl:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ];

      await db.insert(products).values(sampleProducts);
      console.log("✅ Sample products created");
    } else {
      console.log(
        `📦 ${existingProducts.length} products already exist, skipping seed`,
      );
    }

    console.log("🎉 Database seeding completed");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
};

// Seed on import
seedDatabase();
