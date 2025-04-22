import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '@config/db.js';
import bcrypt from 'bcryptjs';

interface UserModel
  extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
  > {
  id: CreationOptional<number>;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female';
  birthDate: Date;
  createdAt: CreationOptional<Date>;
}

class User
  extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>
  implements UserModel
{
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare middleName: string;
  declare gender: 'male' | 'female';
  declare birthDate: Date;
  declare createdAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[А-Яа-яЁё\s-]+$/i,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[А-Яа-яЁё\s-]+$/i,
      },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[А-Яа-яЁё\s-]+$/i,
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString(),
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: false,
  },
);

User.beforeCreate(async (user: User): Promise<void> => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get()) as Partial<UserModel>;
  delete values.password;
  return values;
};

export { User, UserModel };
