const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function createRooms() {
  try {
    await db.room.createMany({
      data: [
        { name: "Maracanã", capacity: 12, location: "ANDAR3" },
        { name: "Wembley", capacity: 8, location: "ANDAR3" },
        { name: "Santiago Bernabéu", capacity: 8, location: "ANDAR4" },
        { name: "San Siro", capacity: 4, location: "ANDAR4" },
        { name: "Old Trafford", capacity: 4, location: "ANDAR5" },
        { name: "Camp Nou", capacity: 4, location: "ANDAR5" },
        { name: "Anfield", capacity: 4, location: "ANDAR5" },
      ],
    });
  } catch (error) {
    throw error;
  }
}

async function deleteUser() {
  await db.user.deleteMany({});
}

async function main() {
  await deleteUser();
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
