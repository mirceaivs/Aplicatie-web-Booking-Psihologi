"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programari = void 0;
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
class programari extends sequelize_1.Model {
    static initModel(sequelize) {
        return programari.init({
            data_programare: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                get() {
                    const value = this.getDataValue('data_programare');
                    if (value)
                        return (0, date_fns_1.format)(value, 'yyyy-MM-dd HH:mm');
                }
            },
            data_realizare: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                get() {
                    const value = this.getDataValue('data_realizare');
                    if (value)
                        return (0, date_fns_1.format)(value, 'yyyy-MM-dd HH:mm');
                }
            },
            programare_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'users',
                    key: 'user_id'
                }
            },
            aprobat: {
                type: sequelize_1.DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'programari',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "programare_id" },
                        { name: "user_id" },
                    ]
                },
                {
                    name: "fk_programari_users1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "user_id" },
                    ]
                },
            ]
        });
    }
}
exports.programari = programari;
//# sourceMappingURL=programari.js.map