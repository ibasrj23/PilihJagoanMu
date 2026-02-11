const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Candidate = sequelize.define(
  'Candidate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vissionMission: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    experience: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    achievement: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    electionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'elections',
        key: 'id',
      },
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'candidates',
  }
);

// Define associations
Candidate.associate = (models) => {
  Candidate.belongsTo(models.Election, {
    foreignKey: 'electionId',
    as: 'election'
  });
  Candidate.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });
  Candidate.hasMany(models.Vote, {
    foreignKey: 'candidateId',
    as: 'votes'
  });
};

module.exports = Candidate;

