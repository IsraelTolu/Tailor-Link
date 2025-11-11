import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Review extends Model {}

  Review.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      booking_id: { type: DataTypes.UUID, allowNull: false },
      customer_id: { type: DataTypes.UUID, allowNull: false },
      tailor_id: { type: DataTypes.UUID, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      comment: { type: DataTypes.TEXT },
      approved_by_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
      underscored: true,
    }
  );

  return Review;
};