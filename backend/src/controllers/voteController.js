const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Notification = require('../models/Notification');
const Vote = require('../models/Vote');
const { sequelize } = require('../config/database');

exports.vote = async (req, res, io) => {
  try {
    const { electionId, candidateId } = req.body;
    const userId = req.user.id;

    if (!electionId || !candidateId) {
      return res.status(400).json({ message: 'Election ID dan Candidate ID harus diisi' });
    }

    // Check election exists
    const election = await Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      where: {
        userId,
        electionId
      }
    });

    if (existingVote) {
      return res.status(409).json({ message: 'Anda sudah melakukan voting di pemilihan ini' });
    }

    // Check candidate exists
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    // Record vote
    const vote = await Vote.create({
      userId,
      electionId,
      candidateId
    });

    // Update candidate vote count
    await candidate.increment('voteCount');

    // Update election stats
    await election.increment('totalVotes');

    const totalParticipants = await sequelize.query(`
      SELECT COUNT(DISTINCT userId) as count FROM votes WHERE electionId = ?
    `, { replacements: [electionId], type: sequelize.QueryTypes.SELECT });

    await election.update({
      totalParticipants: totalParticipants[0].count
    });

    // Create notification
    await Notification.create({
      userId,
      type: 'vote',
      title: 'Voting Berhasil',
      message: `Anda berhasil melakukan voting untuk ${candidate.name}`,
      relatedId: electionId
    });

    // Broadcast real-time update
    if (io) {
      io.emit('vote:updated', {
        electionId,
        candidateId,
        newVoteCount: candidate.voteCount + 1,
        newTotalVotes: election.totalVotes + 1
      });
    }

    res.json({
      message: 'Voting berhasil',
      vote: {
        candidateId,
        electionId,
        votedAt: vote.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat voting' });
  }
};

exports.getUserVotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const votes = await Vote.findAll({
      where: { userId },
      include: [
        {
          model: Election,
          as: 'election',
          attributes: ['id', 'title']
        },
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'name', 'position']
        }
      ]
    });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.getVoteStats = async (req, res) => {
  try {
    const { electionId } = req.query;

    const election = await Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    const candidates = await Candidate.findAll({
      where: { electionId },
      attributes: ['id', 'name', 'position', 'voteCount'],
      raw: true
    });

    const stats = {
      totalVotes: election.totalVotes,
      totalParticipants: election.totalParticipants,
      candidates: candidates.map(c => ({
        id: c.id,
        name: c.name,
        position: c.position,
        voteCount: c.voteCount,
        percentage: election.totalVotes > 0 
          ? ((c.voteCount / election.totalVotes) * 100).toFixed(2)
          : 0
      }))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.hasUserVoted = async (req, res) => {
  try {
    const { electionId } = req.query;
    const userId = req.user.id;

    const vote = await Vote.findOne({
      where: {
        userId,
        electionId
      }
    });

    res.json({ hasVoted: !!vote });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};
