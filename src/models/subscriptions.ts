import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface subscriptionsAttributes {
  subscription_id: number;
  status: string;
  start_date: string;
  end_date: string;
  user_id: number;
}

export type subscriptionsPk = "subscription_id" | "user_id";
export type subscriptionsId = subscriptions[subscriptionsPk];
export type subscriptionsOptionalAttributes = "subscription_id" | "status";
export type subscriptionsCreationAttributes = Optional<subscriptionsAttributes, subscriptionsOptionalAttributes>;

export class subscriptions extends Model<subscriptionsAttributes, subscriptionsCreationAttributes> implements subscriptionsAttributes {
  subscription_id!: number;
  status!: string;
  start_date!: string;
  end_date!: string;
  user_id!: number;

  // subscriptions belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof subscriptions {
    return subscriptions.init({
    subscription_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "inactive"
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'subscriptions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "subscription_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "fk_subscriptions_users1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
