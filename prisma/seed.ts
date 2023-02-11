import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
    const shaggy = await prisma.user.create ({
        data: {
            id: "test_1",
            name: "Shaggy Rogers",
        }
    })
    const scooby = await prisma.user.create ({
        data: {
            id: "test_2",
            name: "Scooby Doo",
        }
    })
    const fred = await prisma.user.create ({
        data: {
            id: "test_3",
            name: "Fred Jones",
        }
    })
    const velma = await prisma.user.create ({
        data: {
            id: "test_4",
            name: "Velma Dinkley",
        }
    })
    const daphne = await prisma.user.create ({
        data: {
            id: "test_5",
            name: "Daphne Blake",
        }
    })

    const Jim = await prisma.user.create ({
        data: {
            id: "test_6",
            name: "Jim Halpert",
        }
    })
    const Pam = await prisma.user.create ({
        data: {
            id: "test_7",
            name: "Pam Beesly",
        }
    })
    const Dwight = await prisma.user.create ({
        data: {
            id: "test_8",
            name: "Dwight Schrute",
        }})
    const Michael = await prisma.user.create ({
        data: {
            id: "test_9",
            name: "Michael Scott",
        }})
    const Andy = await prisma.user.create ({
        data: {
            id: "test_10",
            name: "Andy Bernard",
        }})
    const Angela = await prisma.user.create ({
        data: {
            id: "test_11",
            name: "Angela Martin",
        }})
    const Kevin = await prisma.user.create ({
        data: {
            id: "test_12",
            name: "Kevin Malone",
        }})
    const Oscar = await prisma.user.create ({
        data: {
            id: "test_13",
            name: "Oscar Martinez",
        }})
    const Phyllis = await prisma.user.create ({
        data: {
            id: "test_14",
            name: "Phyllis Lapin",
        }})
    const Ryan = await prisma.user.create ({
        data: {
            id: "test_15",
            name: "Ryan Howard",
        }})
    const Stanley = await prisma.user.create ({
        data: {
            id: "test_16",
            name: "Stanley Hudson",
        }})
    const Toby = await prisma.user.create ({
        data: {
            id: "test_17",
            name: "Toby Flenderson",
        }})
    const Creed = await prisma.user.create ({
        data: {
            id: "test_18",
            name: "Creed Bratton",
        }})
    const Meredith = await prisma.user.create ({
        data: {
            id: "test_19",
            name: "Meredith Palmer",
        }})
    const Kelly = await prisma.user.create ({
        data: {
            id: "test_20",
            name: "Kelly Kapoor",
        }})
    const Erin = await prisma.user.create ({
        data: {
            id: "test_21",
            name: "Erin Hannon",
        }})
    const Holly = await prisma.user.create ({
        data: {
            id: "test_22",
            name: "Holly Flax",
        }})
    const Jan = await prisma.user.create ({
        data: {
            id: "test_23",
            name: "Jan Levinson",
        }})
    const Robert = await prisma.user.create ({
        data: {
            id: "test_24",
            name: "Robert California",
        }})
    const Gabe = await prisma.user.create ({
        data: {
            id: "test_25",
            name: "Gabe Lewis",
        }})
    const David = await prisma.user.create ({
        data: {
            id: "test_26",
            name: "David Wallace",
        }})
    const Barney = await prisma.user.create ({
        data: {
            id: "test_27",
            name: "Barney Stinson",
        }})
    const Ted = await prisma.user.create ({
        data: {
            id: "test_28",
            name: "Ted Mosby",
        }})
    const Marshall = await prisma.user.create ({
        data: {
            id: "test_29",
            name: "Marshall Eriksen",
        }})
    const Lily = await prisma.user.create ({
        data: {
            id: "test_30",
            name: "Lily Aldrin",
        }})
    const Robin = await prisma.user.create ({
        data: {
            id: "test_31",
            name: "Robin Scherbatsky",
        }})
    const Jess = await prisma.user.create ({
        data: {
            id: "test_32",
            name: "Jessica Day",
        }})
    const Nick = await prisma.user.create ({
        data: {
            id: "test_33",
            name: "Nick Miller",
        }})
    const Schmidt = await prisma.user.create ({
        data: {
            id: "test_34",
            name: "Winston Schmidt",
        }})
    const Winston = await prisma.user.create ({
        data: {
            id: "test_35",
            name: "Winston Bishop",
        }})
    const Cece = await prisma.user.create ({
        data: {
            id: "test_36",
            name: "Cece Parekh",
        }})
    const Coach = await prisma.user.create ({
        data: {
            id: "test_37",
            name: "Ernie Tagliaboo",
        }})

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })