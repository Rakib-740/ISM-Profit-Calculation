import React, { useState } from 'react';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import ReturnForm from './components/ReturnForm';
import BulkInvestorInput from './components/BulkInvestorInput';
import InvestorTable from './components/InvestorTable';
import MessagePreview from './components/MessagePreview';
import {
  INITIAL_PROJECT_DATA,
  INITIAL_RETURNS_DATA,
  INITIAL_NEXT_RETURN,
  INITIAL_INVESTORS
} from './initialData';
import { calculateReturnMetrics } from './utils/messageGenerator';

export default function App() {
  const [project, setProject] = useState(INITIAL_PROJECT_DATA);
  const [returns, setReturns] = useState(INITIAL_RETURNS_DATA);
  const [activeReturnId, setActiveReturnId] = useState(INITIAL_RETURNS_DATA[0].id);
  const [nextReturnRange, setNextReturnRange] = useState(INITIAL_NEXT_RETURN);

  // Active return object
  const activeReturn = returns.find((r) => r.id === activeReturnId) || returns[0];

  // Calculate profit per lakh for current active return
  const { profitPerLakh } = activeReturn
    ? calculateReturnMetrics(
        activeReturn.totalInvestment,
        activeReturn.totalProfit,
        activeReturn.passivePercentage
      )
    : { profitPerLakh: 0 };

  // Handlers for Returns
  const handleAddReturn = () => {
    const nextNum = returns.length + 1;
    const newId = `ret-${Date.now()}`;
    const newReturn = {
      id: newId,
      returnNumber: nextNum,
      returnDate: '',
      daysTaken: '45',
      totalInvestment: activeReturn ? activeReturn.totalInvestment : 3900000,
      totalProfit: 400000,
      passivePercentage: 50,
      // Clone investor list from active return
      investors: JSON.parse(JSON.stringify(activeReturn?.investors || INITIAL_INVESTORS))
    };
    setReturns([...returns, newReturn]);
    setActiveReturnId(newId);
  };

  const handleDeleteReturn = (idToDelete) => {
    if (returns.length <= 1) return;
    const filtered = returns.filter((r) => r.id !== idToDelete);
    setReturns(filtered);
    if (activeReturnId === idToDelete) {
      setActiveReturnId(filtered[0].id);
    }
  };

  const handleUpdateReturn = (updatedReturn) => {
    const updatedList = returns.map((r) => (r.id === updatedReturn.id ? updatedReturn : r));
    setReturns(updatedList);
  };

  const handleUpdateInvestorsForActiveReturn = (newInvestorsList) => {
    if (!activeReturn) return;
    const updatedReturn = {
      ...activeReturn,
      investors: newInvestorsList
    };
    handleUpdateReturn(updatedReturn);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-16">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Section A: Project Information */}
        <ProjectForm project={project} onChange={setProject} />

        {/* Section B: Return Selector & Return Information */}
        <ReturnForm
          returns={returns}
          activeReturnId={activeReturnId}
          onSelectReturn={setActiveReturnId}
          onAddReturn={handleAddReturn}
          onDeleteReturn={handleDeleteReturn}
          onUpdateReturn={handleUpdateReturn}
        />

        {/* Bulk Investor Input */}
        <BulkInvestorInput
          investors={activeReturn?.investors || []}
          onUpdateInvestors={handleUpdateInvestorsForActiveReturn}
        />

        {/* Section C: Investor / ISM List */}
        <InvestorTable
          investors={activeReturn?.investors || []}
          profitPerLakh={profitPerLakh}
          onUpdateInvestors={handleUpdateInvestorsForActiveReturn}
        />

        {/* Section D: Generated Message & Copy */}
        <MessagePreview
          project={project}
          activeReturn={activeReturn}
          investors={activeReturn?.investors || []}
          nextReturnRange={nextReturnRange}
          onNextReturnRangeChange={setNextReturnRange}
        />
      </main>

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center text-xs text-slate-400">
        ISM Return Message Generator • All calculations executed locally in browser
      </footer>
    </div>
  );
}
