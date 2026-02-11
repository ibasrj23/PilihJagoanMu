const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createElection = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate, isPublic } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Field wajib harus diisi' });
    }

    const election = await Election.create({
      title,
      description,
      type,
      startDate,
      endDate,
      isPublic,
      createdBy: req.user.id
    });

    // Broadcast notification ke semua user
    const users = await User.findAll();
    const notifications = users.map(user => ({
      userId: user.id,
      type: 'new_election',
      title: 'Pemilihan Baru',
      message: `Pemilihan baru telah dibuat: ${title}`,
      relatedId: election.id,
      relatedModel: 'Election'
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json({
      message: 'Pemilihan berhasil dibuat',
      election
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat membuat pemilihan' });
  }
};

exports.getElections = async (req, res) => {
  try {
    const { status, type } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const elections = await Election.findAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: Candidate, as: 'candidates' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullName', 'email'] },
        { model: Candidate, as: 'candidates' }
      ]
    });

    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.updateElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, isPublic } = req.body;
    const electionId = req.params.id;

    const election = await Election.findByPk(electionId);

    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    // Check authorization
    if (election.createdBy !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Anda tidak berhak mengubah pemilihan ini' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (status) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    await election.update(updateData);

    res.json({
      message: 'Pemilihan berhasil diperbarui',
      election
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id);

    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    // Check authorization
    if (election.createdBy !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Anda tidak berhak menghapus pemilihan ini' });
    }

    await Candidate.destroy({ where: { electionId: election.id } });
    await election.destroy();

    res.json({ message: 'Pemilihan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.getElectionStats = async (req, res) => {
  try {
    const electionId = req.params.id;
    
    const election = await Election.findByPk(electionId, {
      include: [{ model: Candidate, as: 'candidates' }]
    });

    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    const stats = {
      totalVotes: election.totalVotes,
      totalParticipants: election.totalParticipants,
      candidates: election.candidates.map(c => ({
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
