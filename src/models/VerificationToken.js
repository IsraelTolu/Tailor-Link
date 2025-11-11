import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class VerificationToken extends Model {}

  VerificationToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      consumed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'VerificationToken',
      tableName: 'verification_tokens',
      underscored: true,
    }
  );

  return VerificationToken;
};