const { PrismaClient, Role } = require("@prisma/client")
const prisma = new PrismaClient()
const provinces = require("./data/provinces.json")
const districts = require("./data/districts.json")
const priceLength = require("./data/priceLength.json")
const subDistricts = require("./data/subDistricts.json")

const seeding = async () => {
    try {
        prisma.$transaction([
            await prisma.priceLength.createMany({
                data: priceLength,
            }),
            await prisma.provinces.createMany({ data: provinces }),
            await prisma.districts.createMany({ data: districts }),
            await prisma.subDistricts.createMany({ data: subDistricts }),
        ])
    } catch (err) {
        console.log(err)
    }
}
seeding()
