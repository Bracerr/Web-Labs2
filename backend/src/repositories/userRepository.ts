import { User, UserModel } from '@models/user.js';
import { InferCreationAttributes } from 'sequelize';
import { NotFoundError } from '@errors/customErrors.js';

type UserData = Omit<InferCreationAttributes<UserModel>, 'id' | 'createdAt'>;

const userRepository = {
  findUserById: async (id: number): Promise<User | null> => {
    return await User.findByPk(id);
  },
  createUser: async (userData: UserData): Promise<User> => {
    return await User.create(userData);
  },
  getAllUsers: async (): Promise<User[]> => {
    return await User.findAll();
  },
  findUserByEmail: async (email: string): Promise<User | null> => {
    return await User.findOne({ where: { email } });
  },
  updateUser: async (
    userId: number,
    userData: Partial<Omit<UserData, 'password' | 'email'>>,
  ): Promise<User> => {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return await user.update(userData);
  },
};

export { userRepository, UserData };
