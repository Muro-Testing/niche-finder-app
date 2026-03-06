const express = require('express');
const ContactService = require('../services/contactService');
const Database = require('../utils/database');

const router = express.Router();
const db = new Database();
const contactService = new ContactService(db);

// Get contacts for a niche
router.get('/contacts/niche/:nicheName', async (req, res) => {
  try {
    const { nicheName } = req.params;
    const contacts = await contactService.getContactsForNiche(nicheName);
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts for niche:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts', error: error.message });
  }
});

// Get contacts for a company
router.get('/contacts/company/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const contacts = await contactService.getContactsForCompany(companyName, 'Technology');
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts for company:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch company contacts', error: error.message });
  }
});

// Search contacts
router.get('/contacts/search', async (req, res) => {
  try {
    const { q: query, company, department, seniority } = req.query;
    const contacts = await contactService.searchContacts(query, company, department, seniority);
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).json({ success: false, message: 'Failed to search contacts', error: error.message });
  }
});

// Save contact
router.post('/contacts/save', async (req, res) => {
  try {
    const contactData = req.body;
    await contactService.saveContact(contactData);
    res.json({ success: true, message: 'Contact saved successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Failed to save contact', error: error.message });
  }
});

// Get all contacts
router.get('/contacts', async (req, res) => {
  try {
    const allNiches = ["AI Content Creation", "Sustainable Packaging", "Remote Work Tools", "Plant-Based Alternatives"];
    let allContacts = [];

    for (const niche of allNiches) {
      const contacts = await contactService.getContactsForNiche(niche);
      allContacts.push(...contacts);
    }

    res.json({ success: true, data: allContacts });
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts', error: error.message });
  }
});

module.exports = router;