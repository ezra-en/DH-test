import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db } from "./db";
import { cartItems, products, users } from "./db/schema";
import { comparePassword, generateToken } from "./auth";
import { AuthContext, authMiddleware } from "./middleware";
import { and, eq } from "drizzle-orm";

const app = new Hono();

// Add logger middleware
app.use("/*", logger());

// CORS middleware
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check
app.get("/", (c) => {
  console.log("🏥 Health check requested");
  return c.json({ message: "eCommerce API is running!" });
});

// Authentication Routes
app.post("/api/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    console.log(`🔐 Login attempt for: ${email}`);

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Get user from database using Drizzle
    const user = await db.select().from(users).where(eq(users.email, email))
      .get();

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      console.log(`❌ Invalid password for: ${email}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Generate JWT token
    const token = await generateToken({ id: user.id, email: user.email });

    console.log(`✅ Login successful for: ${email}`);
    return c.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all products
app.get("/api/products", async (c) => {
  try {
    console.log("📦 Fetching products");
    const allProducts = await db.select().from(products);
    console.log(`✅ Found ${allProducts.length} products`);
    return c.json({ products: allProducts });
  } catch (error) {
    console.error("❌ Products error:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Protected Cart Routes
app.use("/api/cart/*", authMiddleware);

// Get cart
app.get("/api/cart", async (c: AuthContext) => {
  try {
    console.log(`🛒 Fetching cart for user: ${c.user!.id}`);

    // Join cart items with products to get full product info
    const userCartItems = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, c.user!.id));

    const total = userCartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0,
    );

    console.log(
      `✅ Cart fetched: ${userCartItems.length} items, total: $${
        total.toFixed(2)
      }`,
    );
    return c.json({
      cart: userCartItems,
      total: total.toFixed(2),
      itemCount: userCartItems.length,
    });
  } catch (error) {
    console.error("❌ Get cart error:", error);
    return c.json({ error: "Failed to fetch cart" }, 500);
  }
});

// Add to cart
app.post("/api/cart/add", async (c: AuthContext) => {
  try {
    const { productId, quantity = 1 } = await c.req.json();
    console.log(
      `🛒 Adding to cart - User: ${
        c.user!.id
      }, Product: ${productId}, Qty: ${quantity}`,
    );

    if (!productId) {
      console.log("❌ Missing product ID");
      return c.json({ error: "Product ID is required" }, 400);
    }

    // Check if product exists
    const product = await db.select().from(products).where(
      eq(products.id, productId),
    ).get();
    if (!product) {
      console.log(`❌ Product not found: ${productId}`);
      return c.json({ error: "Product not found" }, 404);
    }

    // Check if item already in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, c.user!.id),
          eq(cartItems.productId, productId),
        ),
      )
      .get();

    if (existingItem) {
      // Update quantity
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(
          and(
            eq(cartItems.userId, c.user!.id),
            eq(cartItems.productId, productId),
          ),
        );
      console.log(
        `✅ Updated cart item quantity: ${existingItem.quantity} + ${quantity}`,
      );
    } else {
      // Add new item
      await db.insert(cartItems).values({
        userId: c.user!.id,
        productId,
        quantity,
      });
      console.log("✅ Added new item to cart");
    }

    return c.json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error("❌ Add to cart error:", error);
    return c.json({ error: "Failed to add item to cart" }, 500);
  }
});

// Update cart item
app.patch("/api/cart/update", async (c: AuthContext) => {
  try {
    const { productId, quantity } = await c.req.json();
    console.log(
      `🛒 Updating cart - User: ${
        c.user!.id
      }, Product: ${productId}, New Qty: ${quantity}`,
    );

    if (!productId || quantity === undefined) {
      console.log("❌ Missing product ID or quantity");
      return c.json({ error: "Product ID and quantity are required" }, 400);
    }

    if (quantity <= 0) {
      console.log("❌ Invalid quantity");
      return c.json({ error: "Quantity must be greater than 0" }, 400);
    }

    const result = await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(
          eq(cartItems.userId, c.user!.id),
          eq(cartItems.productId, productId),
        ),
      );

    console.log("✅ Cart item updated successfully");
    return c.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("❌ Update cart error:", error);
    return c.json({ error: "Failed to update cart" }, 500);
  }
});

// Remove from cart
app.delete("/api/cart/remove", async (c: AuthContext) => {
  try {
    const { productId } = await c.req.json();
    console.log(
      `🛒 Removing from cart - User: ${c.user!.id}, Product: ${productId}`,
    );

    if (!productId) {
      console.log("❌ Missing product ID");
      return c.json({ error: "Product ID is required" }, 400);
    }

    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.userId, c.user!.id),
          eq(cartItems.productId, productId),
        ),
      );

    console.log("✅ Item removed from cart successfully");
    return c.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("❌ Remove from cart error:", error);
    return c.json({ error: "Failed to remove item from cart" }, 500);
  }
});

// Clear cart (for successful checkout)
app.delete("/api/cart/clear", async (c: AuthContext) => {
  try {
    console.log(`🛒 Clearing cart for user: ${c.user!.id}`);
    await db.delete(cartItems).where(eq(cartItems.userId, c.user!.id));
    console.log("✅ Cart cleared successfully");
    return c.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("❌ Clear cart error:", error);
    return c.json({ error: "Failed to clear cart" }, 500);
  }
});

export default {
  port: 3001,
  fetch: app.fetch,
};
