"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program_psihologi = void 0;
const sequelize_1 = require("sequelize");
class program_psihologi extends sequelize_1.Model {
    static initModel(sequelize) {
        return program_psihologi.init({
            program_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            ziua_saptamanii: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false
            },
            ora_inceput: {
                type: sequelize_1.DataTypes.TIME,
                allowNull: false
            },
            ora_sfarsit: {
                type: sequelize_1.DataTypes.TIME,
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
            tableName: 'program_psihologi',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "program_id" },
                        { name: "user_id" },
                    ]
                },
                {
                    name: "fk_program_psihologi_users1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "user_id" },
                    ]
                },
            ]
        });
    }
}
exports.program_psihologi = program_psihologi;
//# sourceMappingURL=program_psihologi.js.map