import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const shaggy = await prisma.user.create({
    data: {
      id: "test_1",
      fullName: "Shaggy Rogers",
    },
  });
  const scooby = await prisma.user.create({
    data: {
      id: "test_2",
      fullName: "Scooby Doo",
    },
  });
  const fred = await prisma.user.create({
    data: {
      id: "test_3",
      fullName: "Fred Jones",
    },
  });
  const velma = await prisma.user.create({
    data: {
      id: "test_4",
      fullName: "Velma Dinkley",
    },
  });
  const daphne = await prisma.user.create({
    data: {
      id: "test_5",
      fullName: "Daphne Blake",
    },
  });

  const Jim = await prisma.user.create({
    data: {
      id: "test_6",
      fullName: "Jim Halpert",
    },
  });
  const Pam = await prisma.user.create({
    data: {
      id: "test_7",
      fullName: "Pam Beesly",
    },
  });
  const Dwight = await prisma.user.create({
    data: {
      id: "test_8",
      fullName: "Dwight Schrute",
    },
  });
  const Michael = await prisma.user.create({
    data: {
      id: "test_9",
      fullName: "Michael Scott",
    },
  });
  const Andy = await prisma.user.create({
    data: {
      id: "test_10",
      fullName: "Andy Bernard",
    },
  });
  const Angela = await prisma.user.create({
    data: {
      id: "test_11",
      fullName: "Angela Martin",
    },
  });
  const Kevin = await prisma.user.create({
    data: {
      id: "test_12",
      fullName: "Kevin Malone",
    },
  });
  const Oscar = await prisma.user.create({
    data: {
      id: "test_13",
      fullName: "Oscar Martinez",
    },
  });
  const Phyllis = await prisma.user.create({
    data: {
      id: "test_14",
      fullName: "Phyllis Lapin",
    },
  });
  const Ryan = await prisma.user.create({
    data: {
      id: "test_15",
      fullName: "Ryan Howard",
    },
  });
  const Stanley = await prisma.user.create({
    data: {
      id: "test_16",
      fullName: "Stanley Hudson",
    },
  });
  const Toby = await prisma.user.create({
    data: {
      id: "test_17",
      fullName: "Toby Flenderson",
    },
  });
  const Creed = await prisma.user.create({
    data: {
      id: "test_18",
      fullName: "Creed Bratton",
    },
  });
  const Meredith = await prisma.user.create({
    data: {
      id: "test_19",
      fullName: "Meredith Palmer",
    },
  });
  const Kelly = await prisma.user.create({
    data: {
      id: "test_20",
      fullName: "Kelly Kapoor",
    },
  });
  const Erin = await prisma.user.create({
    data: {
      id: "test_21",
      fullName: "Erin Hannon",
    },
  });
  const Holly = await prisma.user.create({
    data: {
      id: "test_22",
      fullName: "Holly Flax",
    },
  });
  const Jan = await prisma.user.create({
    data: {
      id: "test_23",
      fullName: "Jan Levinson",
    },
  });
  const Robert = await prisma.user.create({
    data: {
      id: "test_24",
      fullName: "Robert California",
    },
  });
  const Gabe = await prisma.user.create({
    data: {
      id: "test_25",
      fullName: "Gabe Lewis",
    },
  });
  const David = await prisma.user.create({
    data: {
      id: "test_26",
      fullName: "David Wallace",
    },
  });
  const Barney = await prisma.user.create({
    data: {
      id: "test_27",
      fullName: "Barney Stinson",
    },
  });
  const Ted = await prisma.user.create({
    data: {
      id: "test_28",
      fullName: "Ted Mosby",
    },
  });
  const Marshall = await prisma.user.create({
    data: {
      id: "test_29",
      fullName: "Marshall Eriksen",
    },
  });
  const Lily = await prisma.user.create({
    data: {
      id: "test_30",
      fullName: "Lily Aldrin",
    },
  });
  const Robin = await prisma.user.create({
    data: {
      id: "test_31",
      fullName: "Robin Scherbatsky",
    },
  });
  const Jess = await prisma.user.create({
    data: {
      id: "test_32",
      fullName: "Jessica Day",
    },
  });
  const Nick = await prisma.user.create({
    data: {
      id: "test_33",
      fullName: "Nick Miller",
    },
  });
  const Schmidt = await prisma.user.create({
    data: {
      id: "test_34",
      fullName: "Winston Schmidt",
    },
  });
  const Winston = await prisma.user.create({
    data: {
      id: "test_35",
      fullName: "Winston Bishop",
    },
  });
  const Cece = await prisma.user.create({
    data: {
      id: "test_36",
      fullName: "Cece Parekh",
    },
  });
  const Coach = await prisma.user.create({
    data: {
      id: "test_37",
      fullName: "Ernie Tagliaboo",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
