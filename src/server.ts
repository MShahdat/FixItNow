import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 5000;

const main = async () => {
  try{
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
    await prisma.$connect()
    console.log("database connected successfully!");
  }
  catch(err){
    await prisma.$disconnect()
    console.error("Error starting server: ", err);
    process.exit(1);
  }
}

main()