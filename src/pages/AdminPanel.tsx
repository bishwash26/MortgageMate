import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Save, X, Trash2, Building2 } from 'lucide-react';
import { BankService } from '../services/bankService';
import { EmbeddingService } from '../services/embeddingService';
import { Bank, PolicyText } from '../types/database';

export function AdminPanel() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [policies, setPolicies] = useState<Record<number, PolicyText>>({});
  const [editingPolicy, setEditingPolicy] = useState<number | null>(null);
  const [policyText, setPolicyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [showNewBankForm, setShowNewBankForm] = useState(false);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      const banksData = await BankService.getAllBanks();
      setBanks(banksData);
      if (banksData.length > 0 && activeTab === null) {
        setActiveTab(banksData[0].id);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
    }
  };

  const loadPolicy = async (bankId: number) => {
    try {
      const policy = await BankService.getPolicyByBankId(bankId);
      if (policy) {
        setPolicies(prev => ({ ...prev, [bankId]: policy }));
      }
    } catch (error) {
      console.error('Error loading policy:', error);
    }
  };

  const handleTabClick = (bankId: number) => {
    setActiveTab(bankId);
    if (!policies[bankId]) {
      loadPolicy(bankId);
    }
  };

  const handleEditPolicy = (bankId: number) => {
    setEditingPolicy(bankId);
    setPolicyText(policies[bankId]?.policy_text || '');
  };

  const handleSavePolicy = async (bankId: number) => {
    if (!policyText.trim()) return;
    
    setIsLoading(true);
    try {
      const embedding = await EmbeddingService.generateEmbedding(policyText);
      const updatedPolicy = await BankService.createOrUpdatePolicy(bankId, policyText, embedding);
      setPolicies(prev => ({ ...prev, [bankId]: updatedPolicy }));
      setEditingPolicy(null);
      setPolicyText('');
    } catch (error) {
      console.error('Error saving policy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPolicy(null);
    setPolicyText('');
  };

  const handleAddBank = async () => {
    if (!newBankName.trim()) return;
    
    try {
      const newBank = await BankService.createBank(newBankName);
      setBanks(prev => [...prev, newBank]);
      setNewBankName('');
      setShowNewBankForm(false);
      setActiveTab(newBank.id);
    } catch (error) {
      console.error('Error creating bank:', error);
    }
  };

  const handleDeleteBank = async (bankId: number) => {
    if (!confirm('Are you sure you want to delete this bank? This will also delete all associated policies.')) {
      return;
    }
    
    try {
      await BankService.deleteBank(bankId);
      setBanks(prev => prev.filter(bank => bank.id !== bankId));
      setPolicies(prev => {
        const newPolicies = { ...prev };
        delete newPolicies[bankId];
        return newPolicies;
      });
      if (activeTab === bankId) {
        const remainingBanks = banks.filter(bank => bank.id !== bankId);
        setActiveTab(remainingBanks.length > 0 ? remainingBanks[0].id : null);
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
    }
  };

  const activeBank = banks.find(bank => bank.id === activeTab);
  const activePolicy = activeTab ? policies[activeTab] : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Bank Policy Administration</h1>
            <button
              onClick={() => setShowNewBankForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Bank
            </button>
          </div>
          
          {showNewBankForm && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="Enter bank name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBank()}
                />
                <button
                  onClick={handleAddBank}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowNewBankForm(false);
                    setNewBankName('');
                  }}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {banks.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No banks found</h2>
            <p className="text-gray-600">Add your first bank to get started with policy management.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Bank Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleTabClick(bank.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === bank.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    {bank.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBank(bank.id);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </button>
                ))}
              </nav>
            </div>

            {/* Policy Content */}
            {activeBank && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Policy for {activeBank.name}
                  </h2>
                  {!editingPolicy && (
                    <button
                      onClick={() => handleEditPolicy(activeBank.id)}
                      className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {activePolicy ? 'Edit Policy' : 'Add Policy'}
                    </button>
                  )}
                </div>

                {editingPolicy === activeBank.id ? (
                  <div className="space-y-4">
                    <textarea
                      value={policyText}
                      onChange={(e) => setPolicyText(e.target.value)}
                      placeholder="Enter the bank policy text here..."
                      className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSavePolicy(activeBank.id)}
                        disabled={isLoading || !policyText.trim()}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Policy'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activePolicy ? (
                      <>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                            {activePolicy.policy_text}
                          </pre>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date(activePolicy.updated_at).toLocaleString()}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No policy has been set for this bank yet.</p>
                        <p className="text-sm mt-1">Click "Add Policy" to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}