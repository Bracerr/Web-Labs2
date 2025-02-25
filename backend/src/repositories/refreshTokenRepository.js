import { RefreshToken } from "../models/refreshToken.js";

const refreshTokenRepository = {
    findTokenByString: async (tokenString) => {
        return await RefreshToken.findOne({where: {token: tokenString}})
    },
    saveOrUpdateToken: async (userId, newTokenObject) => {
        const existingToken = await RefreshToken.findOne({where: {userId: userId}});

        if (existingToken) {
            existingToken.token = newTokenObject.token;
            existingToken.expiresAt = newTokenObject.expiresAt;
            return await existingToken.save();
        } else {
            return await RefreshToken.create({
                userId: userId,
                token: newTokenObject.token,
                expiresAt: newTokenObject.expiresAt
            });
        }
    }
}
export { refreshTokenRepository };