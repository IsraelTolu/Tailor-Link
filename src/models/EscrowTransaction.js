import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class EscrowTransaction extends Model {}

  EscrowTransaction.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      booking_id: { type: DataTypes.UUID, allowNull: false },
      provider: { type: DataTypes.ENUM('flutterwave', 'paga'), allowNull: false },
      reference: { type: DataTypes.STRING },
      amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING, defaultValue: 'NGN' },
      status: { type: DataTypes.ENUM('initialized', 'funded', 'released', 'refunded', 'held'), defaultValue: 'initialized' },
      metadata: { type: DataTypes.JSONB },
    },
    {
      sequelize,
      modelName: 'EscrowTransaction',
      tableName: 'escrow_transactions',
      underscored: true,
    }
  );

  return EscrowTransaction;
};