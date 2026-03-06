-- Database schema for Niche Finder App

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Niches table
CREATE TABLE IF NOT EXISTS niches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    trend_score REAL DEFAULT 0,
    competition_score REAL DEFAULT 0,
    profitability_score REAL DEFAULT 0,
    search_volume INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    niche_id INTEGER,
    website TEXT,
    industry TEXT,
    size TEXT,
    location TEXT,
    founded_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (niche_id) REFERENCES niches (id)
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    job_title TEXT,
    linkedin_url TEXT,
    department TEXT,
    seniority_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id)
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    search_query TEXT NOT NULL,
    search_type TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_niches_category ON niches(category);
CREATE INDEX IF NOT EXISTS idx_niches_trend_score ON niches(trend_score);
CREATE INDEX IF NOT EXISTS idx_companies_niche_id ON companies(niche_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);