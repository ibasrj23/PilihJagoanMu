const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vote = sequelize.define(
  'Vote',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    electionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'elections',
        key: 'id',
      },
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id',
      },
    },
    votedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: 'votes',
  }
);

// Define associations
Vote.associate = (models) => {
  Vote.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Vote.belongsTo(models.Election, {
    foreignKey: 'electionId',
    as: 'election'
  });
  Vote.belongsTo(models.Candidate, {
    foreignKey: 'candidateId',
    as: 'candidate'
  });
};

module.exports = Vote;
