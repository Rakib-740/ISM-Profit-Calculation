import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import ReturnForm from './components/ReturnForm';
import BulkInvestorInput from './components/BulkInvestorInput';
import InvestorTable from './components/InvestorTable';
import MessagePreview from './components/MessagePreview';
import DocGenerator from './components/DocGenerator';
import {
  INITIAL_PROJECT_DATA,
  INITIAL_RETURNS_DATA,
  INITIAL_NEXT_RETURN,
  INITIAL_INVESTORS
} from './initialData';
import { calculateReturnMetrics } from './utils/messageGenerator';

// ─── Pages ────────────────────────────────────────────────────────────────────
// 'home'   → ISM Workshop home page (tool selector)
// 'profit' → Profit Calculator (existing app)
// 'docs'   → Project Documentation Management (new feature)

export default function App() {
  // ── Page routing ─────────────────────────────────────────────────────────
  const [page, setPage] = useState('home');

  // ── Profit Calculator state ───────────────────────────────────────────────
  const [project, setProject] = useState(INITIAL_PROJECT_DATA);
  const [returns, setReturns] = useState(INITIAL_RETURNS_DATA);
  const [activeReturnId, setActiveReturnId] = useState(INITIAL_RETURNS_DATA[0].id);
  const [nextReturnRange, setNextReturnRange] = useState(INITIAL_NEXT_RETURN);

  const activeReturn = returns.find((r) => r.id === activeReturnId) || returns[0];

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
      totalInvestment: activeReturn ? activeReturn.totalInvestment : '',
      totalProfit: '',
      passivePercentage: 50,
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
    handleUpdateReturn({ ...activeReturn, investors: newInvestorsList });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (page === 'home') {
    return <HomePage onSelectTool={setPage} />;
  }

  if (page === 'docs') {
    return <DocGenerator onBack={() => setPage('home')} />;
  }

  // page === 'profit'
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-16">
      <Header onBack={() => setPage('home')} />

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
        ISM Workshop • Profit Calculator • All calculations executed locally in browser
      </footer>
    </div>
  );
}
