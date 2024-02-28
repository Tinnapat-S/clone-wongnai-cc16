const { PrismaClient, Role } = require("@prisma/client")
const prisma = new PrismaClient()
const provinces = require("../data/provinces.json")
const districts = require("../data/districts.json")

const subDistricts = require("../data/subDistricts.json")

const seeding = async () => {
    try {
        await prisma.$transaction([
            prisma.province.createMany({ data: provinces }),
            prisma.district.createMany({ data: districts }),
            prisma.subDistrict.createMany({ data: subDistricts }),
        ])
    } catch (err) {
        console.log(err)
    }
}

const user = [
    { id: 1, name: "hun", email: "test", mobile: "0123456789", password: "test", gender: "MALE" },
    { id: 2, facebookId: "facebookId" },
    { id: 3, googleId: "googleId" },
]
const merchant = [{ id: 1, name: "hunhunhun", username: "everthing", mobile: "0123456789", password: "test" }]
const openHours = [
    {
        id: 1,
        restaurantId: 1,
        date: "monday",
        openTime: new Date("2024-02-02T10:00:00"),
        closeTime: new Date("2024-02-02T20:00:00"),
    },
    {
        id: 2,
        restaurantId: 1,
        date: "tuesday",
        openTime: new Date("2024-02-02T10:00:00"),
        closeTime: new Date("2024-02-02T20:00:00"),
    },
]
const category = [
    { id: 1, categoryName: "ร้านกาแฟ" },
    { id: 2, categoryName: "ร้านต้ม" },
    { id: 3, categoryName: "ผับ/เที่ยวกลางคืน" },
    { id: 4, categoryName: "สตรีทฟู้ด/รถเข็น" },
    { id: 5, categoryName: "Food Truck" },
    { id: 6, categoryName: "ร้านไวน์" },
    { id: 7, categoryName: "อาหารกล่อง/ข้าวกล่อง เดลิเวอรี่" },
    { id: 8, categoryName: "ร้านริมน้ำ" },
    { id: 9, categoryName: "อิซากายะ" },
    { id: 10, categoryName: "คาเฟ่" },
    { id: 11, categoryName: "คาราโอเกะ" },
    { id: 12, categoryName: "บุปเฟ่ต์โรงแรม" },
    { id: 13, categoryName: "กึ่งผับ/ร้านเหล้า/บาร์" },
    { id: 14, categoryName: "อาหารเจ" },
    { id: 15, categoryName: "ร้านบนดาดฟ้า" },
]
const restaurant = [
    {
        id: 1,
        merchantId: 1,
        restaurantName: "hunhunkai",
        subtitle: "pommaikai",
        lat: "13.7575237",
        lng: "100.5317077",
        provinceCode: 10,
        districtCode: 1001,
        subDistrictCode: 100101,
        address: "wannason",
        priceLength: "0-500",
        categoryId: 1,
    },
]
const restaurantImage = [{ id: 1, restaurantId: 1, img: "https://img.wongnai.com/p/1920x0/2023/02/08/220954c28afc44c68227ff6c0e076cb6.jpg" }]

const menu = [
    {
        id: 1,
        restaurantId: 1,
        menuName: "jimhun",
        subtitle: "kodloi",
        price: 100,
        img: "https://img.wongnai.com/p/1920x0/2023/02/08/220954c28afc44c68227ff6c0e076cb6.jpg",
    },
]
const ReviewImg = [{ reviewId: 1, img: "https://img.wongnai.com/p/1920x0/2023/02/08/220954c28afc44c68227ff6c0e076cb6.jpg" }]
const Review = [{ userId: 1, restaurantId: 1, description: "huntamayoungReview", star: 3 }]
const facility = [
    { id: 1, facilityName: "ที่จอดรถ" },
    { id: 2, facilityName: "ไวไฟ" },
    { id: 3, facilityName: "รับบัตรเครดิต" },
    { id: 4, facilityName: "แอลกอฮอลล์" },
]
const FacilityWithRestaurantId = [
    { id: 1, facilityId: 1, restaurantId: 1 },
    { id: 2, facilityId: 2, restaurantId: 1 },
    { id: 3, facilityId: 3, restaurantId: 1 },
    { id: 4, facilityId: 4, restaurantId: 1 },
]
const admin = {
    id: 1,
    username: "admin",
    password: "admin",
}

const Bookmark = {
    id: 1,
    userId: 1,
    restaurantId: 1,
}
const seedMockData = async () => {
    try {
        await prisma.$transaction([
            await prisma.user.createMany({ data: user }),
            await prisma.merchant.createMany({ data: merchant }),
            await prisma.category.createMany({ data: category }),
            await prisma.restaurant.createMany({ data: restaurant }),
            await prisma.restaurantImage.createMany({ data: restaurantImage }),
            await prisma.menu.createMany({ data: menu }),

            await prisma.review.createMany({ data: Review }),
            await prisma.reviewImg.createMany({ data: ReviewImg }),
            await prisma.facility.createMany({ data: facility }),
            await prisma.facilityWithRestaurantId.createMany({ data: FacilityWithRestaurantId }),
            await prisma.admin.createMany({ data: admin }),
            await prisma.bookmark.createMany({ data: Bookmark }),
            await prisma.openHours.createMany({ data: openHours }),
        ])
    } catch (err) {
        console.log(err)
    }
}
seeding()
seedMockData()
