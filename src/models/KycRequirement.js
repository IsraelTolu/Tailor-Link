import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class KycRequirement extends Model {}

  KycRequirement.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      key: { type: DataTypes.STRING, allowNull: false, unique: true },
      label: { type: DataTypes.STRING, allowNull: false },
      is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'KycRequirement',
      tableName: 'kyc_requirements',
      underscored: true,
    }
  );

  return KycRequirement;
};