import { User } from '@models/user.js';
import { Event } from '@models/event.js';
import { RefreshToken } from '@models/refreshToken.js';

const setRelation = async (): Promise<void> => {
  try {
    User.hasMany(Event, { foreignKey: 'createdBy' });
    Event.belongsTo(User, { foreignKey: 'createdBy' });

    User.hasOne(RefreshToken, { foreignKey: 'userId' });
    RefreshToken.belongsTo(User, { foreignKey: 'userId' });

    console.log('Установлены связи в таблицах');
  } catch (error: unknown) {
    console.error('Ошибка при установлении связи в таблицах');
    throw error;
  }
};

export { setRelation };
