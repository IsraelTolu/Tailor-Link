import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class KycDocument extends Model {}

  KycDocument.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false }, // e.g., govt_id, address_proof
      file_path: { type: DataTypes.STRING, allowNull: false },
      original_name: { type: DataTypes.STRING },
      mime_type: { type: DataTypes.STRING },
      size_bytes: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: 'KycDocument',
      tableName: 'kyc_documents',
      underscored: true,
    }
  );

  return KycDocument;
};