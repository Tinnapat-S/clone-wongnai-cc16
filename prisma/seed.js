const { PrismaClient, Role } = require("@prisma/client")
const prisma = new PrismaClient()
const provinces = require("./data/provinces.json")
const districts = require("./data/districts.json")
const priceLength = require("./data/priceLength.json")
const subDistricts = require("./data/subDistricts.json")

async function seeding() {
    try {
    } catch (err) {
        console.log(err)
    }
    await prisma.priceLength.createMany({
        data: priceLength,
    })
}
seeding()
