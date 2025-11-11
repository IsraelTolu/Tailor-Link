import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Dispute extends Model {}

  Dispute.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      booking_id: { type: DataTypes.UUID, allowNull: false },
      raised_by_user_id: { type: DataTypes.UUID, allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM('open', 'resolved', 'rejected'), defaultValue: 'open' },
      resolution_note: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: 'Dispute',
      tableName: 'disputes',
      underscored: true,
    }
  );

  return Dispute;
};