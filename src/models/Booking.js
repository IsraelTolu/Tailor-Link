import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Booking extends Model {}

  Booking.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      customer_id: { type: DataTypes.UUID, allowNull: false },
      tailor_id: { type: DataTypes.UUID, allowNull: false },
      status: {
        type: DataTypes.ENUM('requested', 'accepted', 'in_progress', 'completed', 'delivered', 'cancelled', 'disputed'),
        defaultValue: 'requested',
      },
      title: { type: DataTypes.STRING },
      notes: { type: DataTypes.TEXT },
      price_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING, defaultValue: 'NGN' },
      schedule_date: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'bookings',
      underscored: true,
    }
  );

  return Booking;
};