import { userRepository } from '../repositories/userRepository.js';

const userService = {
    createUser: async (userData) => {
        return await userRepository.createUser(userData);
    },
    getAllUsers: async () => {
        return await userRepository.getAllUsers();
    },
    findUserByEmail: async (email) => {
        return await userRepository.findUserByEmail(email);
    }
};

export { userService };
