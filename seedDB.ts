const { connectDB, closeDB } = require("./config/mongodb");
const Product = require("./models/Product");

const seedDatabase = async () => {
  console.log("Seeding database...");

  const rawData = await fetch("https://fakestoreapi.com/products");
  const allProducts = await rawData.json();

  const products = allProducts.slice(10).map((p) => {
    return {
      name: p.title,
      price: p.price,
      image: p.image,
      description: p.description,
      stock: Math.floor(Math.random() * 50),
    };
  });

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log("Database seeded");
  closeDB();
};

connectDB().then(() => {
  seedDatabase();
});
