import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class PricingPlan extends Model {}

  PricingPlan.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING, defaultValue: 'NGN' },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'PricingPlan',
      tableName: 'pricing_plans',
      underscored: true,
    }
  );

  return PricingPlan;
};