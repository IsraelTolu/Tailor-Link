import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class DeliveryTracking extends Model {}

  DeliveryTracking.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      booking_id: { type: DataTypes.UUID, allowNull: false },
      tracking_code: { type: DataTypes.STRING, unique: true, allowNull: false },
      status: { type: DataTypes.ENUM('created', 'shipped', 'in_transit', 'delivered', 'failed', 'returned'), defaultValue: 'created' },
      carrier: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'DeliveryTracking',
      tableName: 'delivery_tracking',
      underscored: true,
    }
  );

  return DeliveryTracking;
};