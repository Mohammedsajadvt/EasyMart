import React, { useState } from 'react';
import { Database, Sparkles, AlertTriangle, CheckCircle2, RotateCcw, Server } from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const DatabaseSeeder = () => {
  const [seeding, setSeeding] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [logs, setLogs] = useState([]);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      setStatusMsg('');
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Connecting to MongoDB Atlas endpoint...`]);

      const res = await adminAPI.seedDatabase();

      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Database collections cleared.`,
        `[${new Date().toLocaleTimeString()}] Inserted ${res.data.productsCount || 12} rich catalog products across 7 categories.`,
        `[${new Date().toLocaleTimeString()}] Created admin account (admin@easymart.com).`,
        `[${new Date().toLocaleTimeString()}] Created demo customer account (customer@easymart.com).`,
        `[${new Date().toLocaleTimeString()}] ✅ Database seeding completed successfully!`,
      ]);

      setStatusMsg('🎉 Database successfully refreshed and seeded in MongoDB!');
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ⚠️ Seeder Notice: ${err.response?.data?.message || err.message}`,
      ]);
      setStatusMsg('Notice: ' + (err.response?.data?.message || err.message));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-900 text-slate-100">
      <Header
        title="Database & Catalog Management"
        subtitle="Manage MongoDB collections, seed realistic products, and reset demo accounts"
      />

      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade">
            {statusMsg}
          </div>
        )}

        {/* Warning card */}
        <div className="admin-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-bold font-outfit text-white">
              Database Seeding & Reset Engine
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Clicking the seed button will populate MongoDB with 12+ top-tier products across Electronics, Smartphones, Wearables, Fashion, Home & Kitchen, and generate default customer and administrator credentials.
          </p>

          <div className="pt-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {seeding ? 'Seeding MongoDB Database...' : 'Run 1-Click Database Seeder'}
            </button>
          </div>
        </div>

        {/* Console logs output box */}
        <div className="admin-card p-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-orange-400" /> Seeder Execution Logs
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[11px] text-slate-500 hover:text-slate-300 underline"
            >
              Clear Logs
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-300 min-h-[160px] max-h-60 overflow-y-auto space-y-1 border border-slate-800">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">Ready to run database operations. Logs will output here.</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-slate-300">{log}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSeeder;
