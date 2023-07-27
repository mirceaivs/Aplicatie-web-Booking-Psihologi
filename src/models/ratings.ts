import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { reviews, reviewsId } from './reviews';
import type { users, usersId } from './users';

export interface ratingsAttributes {
  review_id: number;
  user_id: number;
}

export type ratingsPk = "review_id" | "user_id";
export type ratingsId = ratings[ratingsPk];
export type ratingsCreationAttributes = ratingsAttributes;

export class ratings extends Model<ratingsAttributes, ratingsCreationAttributes> implements ratingsAttributes {
  review_id!: number;
  user_id!: number;

  // ratings belongsTo reviews via review_id
  review!: reviews;
  getReview!: Sequelize.BelongsToGetAssociationMixin<reviews>;
  setReview!: Sequelize.BelongsToSetAssociationMixin<reviews, reviewsId>;
  createReview!: Sequelize.BelongsToCreateAssociationMixin<reviews>;
  // ratings belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ratings {
    return ratings.init({
    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reviews',
        key: 'review_id'
      }
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
    tableName: 'ratings',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "review_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "fk_Reviews_has_Users_Users1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "fk_Reviews_has_Users_Reviews1_idx",
        using: "BTREE",
        fields: [
          { name: "review_id" },
        ]
      },
    ]
  });
  }
}
