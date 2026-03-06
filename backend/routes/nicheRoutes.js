const express = require('express');
const NicheService = require('../services/nicheService');
const Database = require('../utils/database');

const router = express.Router();
const db = new Database();
const nicheService = new NicheService(db);

// Get all niches with scores
router.get('/niches', async (req, res) => {
  try {
    const niches = await nicheService.getNichesWithScores();
    res.json({ success: true, data: niches });
  } catch (error) {
    console.error('Error fetching niches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch niches', error: error.message });
  }
});

// Search niches
router.get('/niches/search', async (req, res) => {
  try {
    const { q: query, category } = req.query;
    const niches = await nicheService.searchNiches(query, category);
    res.json({ success: true, data: niches });
  } catch (error) {
    console.error('Error searching niches:', error);
    res.status(500).json({ success: false, message: 'Failed to search niches', error: error.message });
  }
});

// Get niche details
router.get('/niches/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const niches = await nicheService.getTrendingNiches();
    const niche = niches.find(n => n.name.toLowerCase() === name.toLowerCase());
    
    if (!niche) {
      return res.status(404).json({ success: false, message: 'Niche not found' });
    }
    
    const companies = await nicheService.getCompaniesForNiche(niche.name);
    const contacts = await nicheService.getContactsForNiche(niche.name);
    
    res.json({ 
      success: true, 
      data: { 
        ...niche, 
        overall_score: nicheService.calculateNicheScore(niche),
        companies,
        contacts 
      } 
    });
  } catch (error) {
    console.error('Error fetching niche details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch niche details', error: error.message });
  }
});

// Save niche
router.post('/niches/save', async (req, res) => {
  try {
    const nicheData = req.body;
    const nicheId = await nicheService.saveNiche(nicheData);
    res.json({ success: true, message: 'Niche saved successfully', data: { id: nicheId } });
  } catch (error) {
    console.error('Error saving niche:', error);
    res.status(500).json({ success: false, message: 'Failed to save niche', error: error.message });
  }
});

// Get saved niches
router.get('/niches/saved', async (req, res) => {
  try {
    const niches = await nicheService.getSavedNiches();
    res.json({ success: true, data: niches });
  } catch (error) {
    console.error('Error fetching saved niches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch saved niches', error: error.message });
  }
});

module.exports = router;