"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicii = void 0;
const sequelize_1 = require("sequelize");
class servicii extends sequelize_1.Model {
    static initModel(sequelize) {
        return servicii.init({
            seriviciu_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            denumire: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: true
            },
            pret: {
                type: sequelize_1.DataTypes.DECIMAL(10, 0),
                allowNull: false
            },
            durata: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            descriere: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            specializare_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'specializari',
                    key: 'specializare_id'
                }
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'specializari',
                    key: 'user_id'
                }
            }
        }, {
            sequelize,
            tableName: 'servicii',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "seriviciu_id" },
                        { name: "specializare_id" },
                        { name: "user_id" },
                    ]
                },
                {
                    name: "fk_servicii_specializari1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "specializare_id" },
                        { name: "user_id" },
                    ]
                },
            ]
        });
    }
}
exports.servicii = servicii;
//# sourceMappingURL=servicii.js.map