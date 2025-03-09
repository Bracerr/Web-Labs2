import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '@config/db.js';

interface EventModel
  extends Model<
    InferAttributes<EventModel>,
    InferCreationAttributes<EventModel>
  > {
  id: CreationOptional<number>;
  title: string;
  description?: string;
  date: Date;
  createdBy: number;
  image_url?: string;
}

class Event
  extends Model<
    InferAttributes<EventModel>,
    InferCreationAttributes<EventModel>
  >
  implements EventModel
{
  declare id: CreationOptional<number>;
  declare title: string;
  declare description?: string;
  declare date: Date;
  declare createdBy: number;
  declare image_url?: string;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    timestamps: false,
  },
);

export { Event, EventModel };
