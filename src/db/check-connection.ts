import { checkDatabaseConnection } from "./index";

async function main() {
  try {
    await checkDatabaseConnection();

    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
  }
}

main();
