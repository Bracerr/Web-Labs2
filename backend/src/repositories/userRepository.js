import {User} from '../models/user.js';

const userRepository = {
    createUser: async (userData) => {
        return await User.create(userData);
    },
    getAllUsers: async () => {
        return await User.findAll();
    },
    findUserByEmail: async (email) => {
        return await User.findOne({where: {email}});
    }
};

export { userRepository };
