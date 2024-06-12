const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function createRooms() {
  try {
    await db.room.createMany({
      data: [
        { name: "Maracanã", capacity: 12, location: "4° andar" },
        { name: "Wembley", capacity: 8, location: "3° andar" },
        { name: "Santiago Bernabéu", capacity: 8, location: "3° andar" },
        { name: "San Siro", capacity: 4, location: "5° andar" },
        { name: "Old Trafford", capacity: 4, location: "5° andar" },
        { name: "Camp Nou", capacity: 4, location: "5° andar" },
        { name: "Anfield", capacity: 4, location: "5° andar" },
      ],
    });
  } catch (error) {
    throw error;
  }
}

async function main() {
  await createRooms();
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await db.$disconnect();
  });
