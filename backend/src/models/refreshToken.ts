import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '@config/db.js';

interface RefreshTokenModel
  extends Model<
    InferAttributes<RefreshTokenModel>,
    InferCreationAttributes<RefreshTokenModel>
  > {
  id: CreationOptional<number>;
  userId: number;
  token: string;
  expiresAt: Date;
}

class RefreshToken
  extends Model<
    InferAttributes<RefreshTokenModel>,
    InferCreationAttributes<RefreshTokenModel>
  >
  implements RefreshTokenModel
{
  declare id: CreationOptional<number>;
  declare userId: number;
  declare token: string;
  declare expiresAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    timestamps: false,
  },
);

export { RefreshToken, RefreshTokenModel };
