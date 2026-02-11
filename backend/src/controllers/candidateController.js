const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');

exports.createCandidate = async (req, res) => {
  try {
    const { name, description, position, vissionMission, experience, electionId } = req.body;

    if (!name || !position || !electionId) {
      return res.status(400).json({ message: 'Field wajib harus diisi' });
    }

    // Check election exists
    const election = await Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Pemilihan tidak ditemukan' });
    }

    // Check authorization
    if (election.createdBy !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak berhak membuat kandidat untuk pemilihan ini' });
    }

    const candidate = await Candidate.create({
      name,
      description,
      position,
      vissionMission,
      experience,
      electionId,
      createdBy: req.user.id,
      photo: req.file ? `/uploads/candidates/${req.file.filename}` : null
    });

    res.status(201).json({
      message: 'Kandidat berhasil ditambahkan',
      candidate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error saat menambah kandidat' });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const { electionId } = req.query;
    
    const where = {};
    if (electionId) where.electionId = electionId;

    const candidates = await Candidate.findAll({
      where,
      include: [
        { model: Election, as: 'election', attributes: ['id', 'title'] },
        { model: User, as: 'creator', attributes: ['id', 'fullName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id, {
      include: [
        { model: Election, as: 'election' },
        { model: User, as: 'creator', attributes: ['id', 'fullName'] }
      ]
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { name, description, position, vissionMission, experience, status } = req.body;
    const candidateId = req.params.id;

    const candidate = await Candidate.findByPk(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    // Check authorization
    if (candidate.createdBy !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak berhak mengubah kandidat ini' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (position) updateData.position = position;
    if (vissionMission) updateData.vissionMission = vissionMission;
    if (experience) updateData.experience = experience;
    if (status) updateData.status = status;
    if (req.file) updateData.photo = `/uploads/candidates/${req.file.filename}`;

    await candidate.update(updateData);

    res.json({
      message: 'Kandidat berhasil diperbarui',
      candidate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi error' });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: 'Kandidat tidak ditemukan' });
    }

    // Check authorization
    if (candidate.createdBy !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak berhak menghapus kandidat ini' });
    }

    await candidate.destroy();

    res.json({ message: 'Kandidat berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi error' });
  }
};
