import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

class RefreshToken extends Model {}

RefreshToken.init({
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
    }
);

export { RefreshToken };