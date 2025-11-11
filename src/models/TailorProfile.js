import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class TailorProfile extends Model {}

  TailorProfile.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      bio: { type: DataTypes.TEXT },
      address_line: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      availability: { type: DataTypes.BOOLEAN, defaultValue: true },
      approval_status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'TailorProfile',
      tableName: 'tailor_profiles',
      underscored: true,
    }
  );

  return TailorProfile;
};