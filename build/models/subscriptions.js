"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = void 0;
const sequelize_1 = require("sequelize");
class subscriptions extends sequelize_1.Model {
    static initModel(sequelize) {
        return subscriptions.init({
            subscription_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            status: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false,
                defaultValue: "inactive"
            },
            start_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
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
exports.subscriptions = subscriptions;
//# sourceMappingURL=subscriptions.js.map