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
    },
    findUserById: async (id) => {
        return await userRepository.findUserById(id);
    }
};

export { userService };
