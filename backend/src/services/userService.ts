import { userRepository } from '@repositories/userRepository.js';
import { User, UserModel } from '@models/user.js';
import { InferCreationAttributes } from 'sequelize';
import { NotFoundError } from '@errors/customErrors.js';

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
  updateUser: async (
    userId: number,
    userData: Partial<Omit<UserData, 'password' | 'email'>>,
  ): Promise<User> => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    if (userData.firstName && !/^[А-Яа-яЁё\s-]+$/i.test(userData.firstName)) {
      throw new Error('Некорректное имя');
    }
    if (userData.lastName && !/^[А-Яа-яЁё\s-]+$/i.test(userData.lastName)) {
      throw new Error('Некорректная фамилия');
    }
    if (userData.middleName && !/^[А-Яа-яЁё\s-]+$/i.test(userData.middleName)) {
      throw new Error('Некорректное отчество');
    }

    return await userRepository.updateUser(userId, userData);
  },
  getUserProfile: async (userId: number) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as Omit<
      ReturnType<UserModel['toJSON']>,
      'password'
    >;
  },
};

export { userService, UserData };
