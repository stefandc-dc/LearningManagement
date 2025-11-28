import { PrismaClient, Role } from "@prisma/client";
// import bcrypt from "bcryptjs"; // In a real app, use bcrypt

const prisma = new PrismaClient();

async function main() {
    // const password = await bcrypt.hash("password123", 10);
    // For this demo, we are storing plain text passwords temporarily or using a simple check
    // In production, ALWAYS hash passwords.
    const password = "password123";

    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            email: "admin@example.com",
            name: "Admin User",
            role: Role.ADMIN,
            password,
        },
    });

    const manager = await prisma.user.upsert({
        where: { email: "manager@example.com" },
        update: {},
        create: {
            email: "manager@example.com",
            name: "Manager User",
            role: Role.MANAGER,
            password,
        },
    });

    const creator = await prisma.user.upsert({
        where: { email: "creator@example.com" },
        update: {},
        create: {
            email: "creator@example.com",
            name: "Content Creator",
            role: Role.CREATOR,
            password,
        },
    });

    const learner = await prisma.user.upsert({
        where: { email: "learner@example.com" },
        update: {},
        create: {
            email: "learner@example.com",
            name: "Learner User",
            role: Role.LEARNER,
            password,
            managerId: manager.id,
        },
    });

    console.log({ admin, manager, creator, learner });
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
