import React, { useState, useEffect } from 'react';
import type { Niche } from '../services/api';
import { apiService } from '../services/api';

interface NicheListProps {
  onSelectNiche: (niche: Niche) => void;
}

const NicheList: React.FC<NicheListProps> = ({ onSelectNiche }) => {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNiches();
      setNiches(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(n => n.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch niches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await apiService.searchNiches(searchQuery, selectedCategory);
      setNiches(data);
    } catch (error) {
      console.error('Failed to search niches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Profitable Niches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search niches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSearch}
              className="btn-primary flex-1"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                fetchNiches();
              }}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Niches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <div
            key={niche.name}
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => onSelectNiche(niche)}
          >
            <div className={`h-2 ${getScoreClass(niche.overall_score || 0).split(' ')[1]}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{niche.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{niche.description}</p>
                </div>
                <div className={`score-badge ${getScoreClass(niche.overall_score || 0)}`}>
                  Score: {(niche.overall_score || 0).toFixed(0)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="tag">{niche.category}</span>
                <span className="tag bg-green-100 text-green-800">Trend: {niche.trend_score}</span>
                <span className="tag bg-purple-100 text-purple-800">Profit: {niche.profitability_score}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
                <span className="text-gray-500">Competition: {niche.competition_score}</span>
                <span className="text-gray-500">Volume: {niche.search_volume.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {niches.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No niches found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default NicheList;