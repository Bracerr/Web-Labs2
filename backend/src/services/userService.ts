import { userRepository } from '@repositories/userRepository.js';
import { User, UserModel } from '@models/user.js';
import { InferCreationAttributes } from 'sequelize';

type UserData = Omit<InferCreationAttributes<UserModel>, 'id'>;

const userService = {
  createUser: async (userData: UserData): Promise<User> => {
    return await userRepository.createUser(userData);
  },
  getAllUsers: async (): Promise<User[]> => {
    return await userRepository.getAllUsers();
  },
  findUserByEmail: async (email: string): Promise<User | null> => {
    return await userRepository.findUserByEmail(email);
  },
  findUserById: async (id: number): Promise<User | null> => {
    return await userRepository.findUserById(id);
  },
};

export { userService, UserData };
