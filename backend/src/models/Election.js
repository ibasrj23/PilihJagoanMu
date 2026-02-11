const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Election = sequelize.define(
  'Election',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    type: {
      type: DataTypes.ENUM('kepala_desa', 'bupati', 'gubernur', 'presiden', 'rapat_rt', 'kepala_sekolah', 'other'),
      defaultValue: 'other',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed'),
      defaultValue: 'pending',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalParticipants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'elections',
  }
);

// Define associations
Election.associate = (models) => {
  Election.hasMany(models.Candidate, {
    foreignKey: 'electionId',
    as: 'candidates'
  });
  Election.hasMany(models.Vote, {
    foreignKey: 'electionId',
    as: 'votes'
  });
  Election.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });
};

module.exports = Election;

