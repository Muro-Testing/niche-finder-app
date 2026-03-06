const axios = require('axios');
const puppeteer = require('puppeteer');

class NicheService {
  constructor(db) {
    this.db = db;
  }

  // Mock Google Trends data for MVP
  async getTrendingNiches() {
    const mockNiches = [
      {
        name: "AI Content Creation",
        category: "Technology",
        description: "Tools and services for AI-generated content",
        trend_score: 95,
        competition_score: 70,
        profitability_score: 85,
        search_volume: 50000
      },
      {
        name: "Sustainable Packaging",
        category: "Eco-Friendly",
        description: "Environmentally conscious packaging solutions",
        trend_score: 88,
        competition_score: 45,
        profitability_score: 90,
        search_volume: 30000
      },
      {
        name: "Remote Work Tools",
        category: "Business",
        description: "Software for remote team collaboration",
        trend_score: 82,
        competition_score: 80,
        profitability_score: 75,
        search_volume: 100000
      },
      {
        name: "Plant-Based Alternatives",
        category: "Food & Beverage",
        description: "Vegan and plant-based food products",
        trend_score: 90,
        competition_score: 60,
        profitability_score: 88,
        search_volume: 45000
      },
      {
        name: "Cybersecurity for SMBs",
        category: "Technology",
        description: "Security solutions for small to medium businesses",
        trend_score: 92,
        competition_score: 50,
        profitability_score: 95,
        search_volume: 25000
      },
      {
        name: "Mental Health Apps",
        category: "Healthcare",
        description: "Digital mental health and wellness platforms",
        trend_score: 87,
        competition_score: 65,
        profitability_score: 82,
        search_volume: 35000
      },
      {
        name: "Electric Vehicle Accessories",
        category: "Automotive",
        description: "Charging stations and EV-related products",
        trend_score: 85,
        competition_score: 40,
        profitability_score: 90,
        search_volume: 20000
      },
      {
        name: "Personal Finance Apps",
        category: "Fintech",
        description: "Budgeting and financial management tools",
        trend_score: 78,
        competition_score: 75,
        profitability_score: 70,
        search_volume: 80000
      }
    ];

    return mockNiches;
  }

  // Calculate overall niche score
  calculateNicheScore(niche) {
    const { trend_score, competition_score, profitability_score } = niche;
    
    // Formula: (trend * 0.4) + (profitability * 0.4) - (competition * 0.2)
    const score = (trend_score * 0.4) + (profitability_score * 0.4) - (competition_score * 0.2);
    
    return Math.max(0, Math.min(100, score)); // Ensure score is between 0-100
  }

  // Get niches with scores
  async getNichesWithScores() {
    const niches = await this.getTrendingNiches();
    
    return niches.map(niche => ({
      ...niche,
      overall_score: this.calculateNicheScore(niche)
    })).sort((a, b) => b.overall_score - a.overall_score);
  }

  // Save niche to database
  async saveNiche(nicheData) {
    const { name, description, category, trend_score, competition_score, profitability_score, search_volume } = nicheData;
    
    const sql = `
      INSERT INTO niches (name, description, category, trend_score, competition_score, profitability_score, search_volume)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await this.db.run(sql, [name, description, category, trend_score, competition_score, profitability_score, search_volume]);
    
    return result.lastID;
  }

  // Get niches from database
  async getSavedNiches() {
    const sql = 'SELECT * FROM niches ORDER BY overall_score DESC';
    const niches = await this.db.all(sql);
    
    return niches.map(niche => ({
      ...niche,
      overall_score: this.calculateNicheScore(niche)
    }));
  }

  // Search niches by category or keyword
  async searchNiches(query, category = null) {
    let niches = await this.getTrendingNiches();
    
    // Filter by category if provided
    if (category) {
      niches = niches.filter(niche => niche.category.toLowerCase() === category.toLowerCase());
    }
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      niches = niches.filter(niche => 
        niche.name.toLowerCase().includes(lowerQuery) ||
        niche.description.toLowerCase().includes(lowerQuery) ||
        niche.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    return niches.map(niche => ({
      ...niche,
      overall_score: this.calculateNicheScore(niche)
    })).sort((a, b) => b.overall_score - a.overall_score);
  }
}

module.exports = NicheService;