const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Function to generate a random string of length 6
function generateRandomCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function generateShortCode(preferredCode) {
    preferredCode = preferredCode.trim().toUpperCase();

    let uniqueCode = preferredCode || generateRandomCode();
    while (true) {
        const existingLink = await prisma.link.findFirst({ where: { shortUrl: uniqueCode } });

        if (!existingLink) {
            return { success: true, code: uniqueCode }; // Unique code found or generated
        } else if (uniqueCode === preferredCode) {
            return { success: false,code: uniqueCode, message: "Preferred Short Code is already in use." }; // Preferred code is not unique
        }
        uniqueCode = generateRandomCode(); // Generate a new random code
    }
}


module.exports = generateShortCode;
