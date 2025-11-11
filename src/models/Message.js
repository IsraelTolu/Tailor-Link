import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Message extends Model {}

  Message.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      booking_id: { type: DataTypes.UUID, allowNull: false },
      sender_id: { type: DataTypes.UUID, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      underscored: true,
    }
  );

  return Message;
};