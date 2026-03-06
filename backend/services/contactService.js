const puppeteer = require('puppeteer');
const axios = require('axios');

class ContactService {
  constructor(db) {
    this.db = db;
  }

  // Mock companies for MVP
  getMockCompanies(niche) {
    const companies = {
      "AI Content Creation": [
        { name: "Jasper AI", website: "https://jasper.ai", industry: "AI Content", size: "50-200", location: "Austin, TX", founded_year: 2020 },
        { name: "Copy.ai", website: "https://www.copy.ai", industry: "AI Content", size: "200-500", location: "San Francisco, CA", founded_year: 2020 },
        { name: "Writesonic", website: "https://writesonic.com", industry: "AI Content", size: "50-200", location: "San Jose, CA", founded_year: 2020 },
        { name: "CopySmith", website: "https://www.copysmith.ai", industry: "AI Content", size: "10-50", location: "New York, NY", founded_year: 2018 },
        { name: "Rytr", website: "https://rytr.me", industry: "AI Content", size: "10-50", location: "San Francisco, CA", founded_year: 2020 }
      ],
      "Sustainable Packaging": [
        { name: "EcoEnclose", website: "https://www.ecoenclose.com", industry: "Sustainable Packaging", size: "50-200", location: "Denver, CO", founded_year: 2008 },
        { name: "Packhelp", website: "https://packhelp.com", industry: "Sustainable Packaging", size: "200-500", location: "Warsaw, Poland", founded_year: 2014 },
        { name: "TIPA", website: "https://www.tipa-corp.com", industry: "Sustainable Packaging", size: "50-200", location: "Tel Aviv, Israel", founded_year: 2010 },
        { name: "Loliware", website: "https://loliware.com", industry: "Sustainable Packaging", size: "10-50", location: "Boston, MA", founded_year: 2017 },
        { name: "Vegware", website: "https://www.vegware.com", industry: "Sustainable Packaging", size: "200-500", location: "Cornwall, UK", founded_year: 2006 }
      ],
      "Remote Work Tools": [
        { name: "Slack", website: "https://slack.com", industry: "Collaboration", size: "1000-5000", location: "San Francisco, CA", founded_year: 2009 },
        { name: "Zoom", website: "https://zoom.us", industry: "Video Conferencing", size: "5000+", location: "San Jose, CA", founded_year: 2011 },
        { name: "Asana", website: "https://asana.com", industry: "Project Management", size: "1000-5000", location: "San Francisco, CA", founded_year: 2008 },
        { name: "Notion", website: "https://www.notion.so", industry: "Productivity", size: "500-1000", location: "San Francisco, CA", founded_year: 2013 },
        { name: "Trello", website: "https://trello.com", industry: "Project Management", size: "500-1000", location: "New York, NY", founded_year: 2011 }
      ],
      "Plant-Based Alternatives": [
        { name: "Beyond Meat", website: "https://www.beyondmeat.com", industry: "Food & Beverage", size: "1000-5000", location: "El Segundo, CA", founded_year: 2009 },
        { name: "Impossible Foods", website: "https://impossiblefoods.com", industry: "Food & Beverage", size: "1000-5000", location: "Oakland, CA", founded_year: 2011 },
        { name: "Oatly", website: "https://www.oatly.com", industry: "Food & Beverage", size: "1000-5000", location: "Stockholm, Sweden", founded_year: 1994 },
        { name: "MorningStar Farms", website: "https://morningstarfarms.com", industry: "Food & Beverage", size: "5000+", location: "Rosemont, IL", founded_year: 1975 },
        { name: "Gardein", website: "https://www.eatgardein.com", industry: "Food & Beverage", size: "500-1000", location: "Los Angeles, CA", founded_year: 2004 }
      ]
    };

    return companies[niche] || [];
  }

  // Mock contacts for companies
  getMockContacts(companyName, industry) {
    const departments = ["Sales", "Marketing", "Product", "Engineering", "Operations"];
    const seniorityLevels = ["Entry", "Mid", "Senior", "Manager", "Director", "VP", "C-Level"];
    const jobTitles = [
      "Sales Manager", "Marketing Director", "Product Manager", "Engineering Lead", 
      "Operations Manager", "Business Development", "Customer Success", "VP of Sales",
      "CMO", "CTO", "CEO", "Founder"
    ];

    const contacts = [];
    const contactCount = Math.floor(Math.random() * 5) + 3; // 3-7 contacts per company

    for (let i = 0; i < contactCount; i++) {
      const firstName = this.getRandomFirstName();
      const lastName = this.getRandomLastName();
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const seniority = seniorityLevels[Math.floor(Math.random() * seniorityLevels.length)];
      
      contacts.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.replace(/\s+/g, '').toLowerCase()}.com`,
        phone: this.generatePhoneNumber(),
        job_title: jobTitle,
        linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        department: department,
        seniority_level: seniority
      });
    }

    return contacts;
  }

  getRandomFirstName() {
    const names = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Maria", "Chris", "Anna", "Daniel", "Karen", "Mark", "Nancy"];
    return names[Math.floor(Math.random() * names.length)];
  }

  getRandomLastName() {
    const names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson"];
    return names[Math.floor(Math.random() * names.length)];
  }

  generatePhoneNumber() {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }

  // Get companies for a niche
  async getCompaniesForNiche(nicheName) {
    const companies = this.getMockCompanies(nicheName);
    
    // Save companies to database
    for (const company of companies) {
      await this.saveCompany(company, nicheName);
    }

    return companies;
  }

  // Get contacts for a company
  async getContactsForCompany(companyName, industry) {
    const contacts = this.getMockContacts(companyName, industry);
    
    // Find company ID
    const company = await this.db.get('SELECT id FROM companies WHERE name = ?', [companyName]);
    if (!company) return contacts;

    // Save contacts to database
    for (const contact of contacts) {
      await this.saveContact({ ...contact, company_id: company.id });
    }

    return contacts;
  }

  // Save company to database
  async saveCompany(companyData, nicheName) {
    // First get or create niche
    let niche = await this.db.get('SELECT id FROM niches WHERE name = ?', [nicheName]);
    if (!niche) {
      const nicheResult = await this.db.run(
        'INSERT INTO niches (name, category, trend_score, competition_score, profitability_score) VALUES (?, ?, ?, ?, ?)',
        [nicheName, companyData.industry, 80, 50, 75]
      );
      niche = { id: nicheResult.lastID };
    }

    const { name, website, industry, size, location, founded_year } = companyData;
    
    const sql = `
      INSERT INTO companies (name, niche_id, website, industry, size, location, founded_year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.run(sql, [name, niche.id, website, industry, size, location, founded_year]);
  }

  // Save contact to database
  async saveContact(contactData) {
    const { company_id, name, email, phone, job_title, linkedin_url, department, seniority_level } = contactData;
    
    const sql = `
      INSERT INTO contacts (company_id, name, email, phone, job_title, linkedin_url, department, seniority_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db.run(sql, [company_id, name, email, phone, job_title, linkedin_url, department, seniority_level]);
  }

  // Get all contacts for a niche
  async getContactsForNiche(nicheName) {
    const companies = await this.getCompaniesForNiche(nicheName);
    const allContacts = [];

    for (const company of companies) {
      const contacts = await this.getContactsForCompany(company.name, company.industry);
      allContacts.push(...contacts.map(contact => ({
        ...contact,
        company_name: company.name,
        company_website: company.website,
        company_industry: company.industry
      })));
    }

    return allContacts;
  }

  // Search contacts by criteria
  async searchContacts(query, company = null, department = null, seniority = null) {
    // For MVP, we'll use mock data and filter it
    const allNiches = ["AI Content Creation", "Sustainable Packaging", "Remote Work Tools", "Plant-Based Alternatives"];
    let allContacts = [];

    for (const niche of allNiches) {
      const companies = this.getMockCompanies(niche);
      for (const comp of companies) {
        const contacts = this.getMockContacts(comp.name, comp.industry);
        allContacts.push(...contacts.map(contact => ({
          ...contact,
          company_name: comp.name,
          company_website: comp.website,
          company_industry: comp.industry
        })));
      }
    }

    // Apply filters
    if (company) {
      allContacts = allContacts.filter(c => c.company_name.toLowerCase().includes(company.toLowerCase()));
    }

    if (department) {
      allContacts = allContacts.filter(c => c.department.toLowerCase() === department.toLowerCase());
    }

    if (seniority) {
      allContacts = allContacts.filter(c => c.seniority_level.toLowerCase() === seniority.toLowerCase());
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      allContacts = allContacts.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.job_title.toLowerCase().includes(lowerQuery) ||
        c.company_name.toLowerCase().includes(lowerQuery) ||
        c.department.toLowerCase().includes(lowerQuery)
      );
    }

    return allContacts;
  }
}

module.exports = ContactService;