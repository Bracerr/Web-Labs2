import { User } from './user.js';
import { Event } from './event.js';

const setRelation = async () => {
    try{
        User.hasMany(Event, { foreignKey: "createdBy" });
        Event.belongsTo(User, { foreignKey: "createdBy" });
        console.log("Установлены связи в таблицах")
    } catch (err) {
        console.error("Ошибка при установлении связи в таблицах")
        throw err;
    }
};

export { setRelation }
