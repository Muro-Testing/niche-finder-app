import { useState } from 'react';
import NicheList from './components/NicheList';
import ContactList from './components/ContactList';
import type { Niche } from './services/api';

function App() {
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [view, setView] = useState<'niches' | 'contacts'>('niches');

  const handleSelectNiche = (niche: Niche) => {
    setSelectedNiche(niche);
    setSelectedCompany(null);
    setView('contacts');
  };

  const handleBackToNiches = () => {
    setSelectedNiche(null);
    setSelectedCompany(null);
    setView('niches');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Niche Finder Pro</h1>
              <p className="text-gray-600 mt-1">Discover profitable niches and find decision makers</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView('niches')}
                className={`btn-primary ${
                  view === 'contacts' 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : ''
                }`}
              >
                Find Niches
              </button>
              <button
                onClick={() => setView('contacts')}
                className={`btn-primary ${
                  view === 'niches' 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : ''
                }`}
              >
                View Contacts
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'niches' && (
          <NicheList onSelectNiche={handleSelectNiche} />
        )}

        {view === 'contacts' && (
          <div>
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <button
                  onClick={handleBackToNiches}
                  className="hover:text-gray-900 transition-colors"
                >
                  All Niches
                </button>
                <span>›</span>
                {selectedNiche && (
                  <>
                    <span className="text-gray-900 font-medium">{selectedNiche.name}</span>
                    <span>›</span>
                  </>
                )}
                {selectedCompany && (
                  <span className="text-gray-900 font-medium">{selectedCompany}</span>
                )}
              </nav>
            </div>

            <ContactList 
              nicheName={selectedNiche?.name}
              companyName={selectedCompany || undefined}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Niche Finder Pro - Your partner in market research and lead generation</p>
            <p className="mt-2">Note: This is a demo application using mock data for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;