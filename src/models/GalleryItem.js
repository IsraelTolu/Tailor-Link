import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class GalleryItem extends Model {}

  GalleryItem.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { type: DataTypes.UUID, allowNull: false },
      image_path: { type: DataTypes.STRING, allowNull: false },
      original_name: { type: DataTypes.STRING },
      mime_type: { type: DataTypes.STRING },
      size_bytes: { type: DataTypes.INTEGER },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'GalleryItem',
      tableName: 'gallery_items',
      underscored: true,
    }
  );

  return GalleryItem;
};