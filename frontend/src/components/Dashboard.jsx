import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Plus, Trash2, LogOut, BookOpen, Sparkles, Calendar } from 'lucide-react';

export default function Dashboard({ setIsAuthenticated }) {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊 Happy');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchJournals = async () => {
    try {
      const { data } = await API.get('/journals');
      setJournals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/journals', { title, content, mood });
      setTitle('');
      setContent('');
      setMood('😊 Happy');
      fetchJournals();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await API.delete(`/journals/${id}`);
        fetchJournals();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Digital Journal</h1>
              <p className="text-xs text-slate-400">Welcome back, <span className="text-indigo-400 font-medium">{user.username || 'Explorer'}</span></p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/20 transition"
          >
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form Section */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl h-fit sticky top-24">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">New Journal Entry</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="What's on your mind today?"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition" 
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">Mood</label>
              <select 
                value={mood} 
                onChange={(e) => setMood(e.target.value)} 
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition"
              >
                <option value="😊 Happy">😊 Happy</option>
                <option value="😌 Calm">😌 Calm</option>
                <option value="🚀 Productive">🚀 Productive</option>
                <option value="🤔 Reflective">🤔 Reflective</option>
                <option value="😢 Sad">😢 Sad</option>
                <option value="🔥 Motivated">🔥 Motivated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">Content</label>
              <textarea 
                rows="5" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
                placeholder="Write your thoughts, reflections, or events..."
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl text-sm shadow-lg shadow-indigo-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Plus size={18} /> <span>{loading ? 'Publishing...' : 'Publish Entry'}</span>
            </button>
          </form>
        </div>

        {/* Entries Feed Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white">Your Journal Timeline</h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-medium">
              {journals.length} {journals.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>

          {journals.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 p-12 rounded-3xl text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No journal entries found.</p>
              <p className="text-xs text-slate-500 mt-1">Start writing your thoughts using the form on the left!</p>
            </div>
          ) : (
            journals.map((j) => (
              <div 
                key={j._id} 
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-slate-700 p-6 rounded-3xl shadow-lg transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition">{j.title}</h3>
                  <span className="text-xs px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full font-medium">
                    {j.mood}
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed mb-4">
                  {j.content}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={14} />
                    <span>{new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(j._id)} 
                    className="flex items-center space-x-1 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}