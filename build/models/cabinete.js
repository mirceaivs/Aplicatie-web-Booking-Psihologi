"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cabinete = void 0;
const sequelize_1 = require("sequelize");
class cabinete extends sequelize_1.Model {
    static initModel(sequelize) {
        return cabinete.init({
            cabinet_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            judet: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            localitate: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            adresa: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            denumire_Cabinet: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                }
            }
        }, {
            sequelize,
            tableName: 'cabinete',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "cabinet_id" },
                    ]
                },
                {
                    name: "fk_cabinete_users1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "user_id" },
                    ]
                },
            ]
        });
    }
}
exports.cabinete = cabinete;
//# sourceMappingURL=cabinete.js.map