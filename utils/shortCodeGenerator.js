    const { Link } = require('../models');

    // Function to generate a random string of length 6
    function generateRandomCode(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async function generateShortCode(preferredCode) {
        preferredCode = preferredCode.trim();
        let uniqueCode = preferredCode.length > 0 ? preferredCode : generateRandomCode();
    
        while (true) {
            const existingLink = await Link.findOne({ where: { shortenedUrl: uniqueCode } });
            
            if (!existingLink) {
                return { success: true, code: uniqueCode }; // Unique code found or generated
            } else {
                if (uniqueCode === preferredCode && preferredCode.length > 0) {
                    return { success: false, message: "Preferred Short Code is already in use." }; // Preferred code is not unique
                }
                uniqueCode = generateRandomCode(); // Generate a new random code
            }
        }
    }
    

    module.exports = generateShortCode;
