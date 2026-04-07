"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Trash2, Check, BookOpen } from 'lucide-react';

// Dynamic import for Rich Text Editor (SSR disable zaroori hai Nextjs me)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AdminKnowledgeBase() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nighwan-tech-webbackend.onrender.com";

    // States
    const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');
    const [categories, setCategories] = useState<any[]>([]);
    
    // New Category Form State
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [newCatIcon, setNewCatIcon] = useState('Rocket');

    // New Article Form State
    const [newArtTitle, setNewArtTitle] = useState('');
    const [newArtCategory, setNewArtCategory] = useState('');
    const [newArtContent, setNewArtContent] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    // ─── FETCH CATEGORIES ───
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/support/knowledgebase/categories`);
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    // ─── CREATE CATEGORY ───
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/support/knowledgebase/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newCatName,
                    slug: newCatName.toLowerCase().replace(/ /g, '-'),
                    icon: newCatIcon,
                    description: newCatDesc,
                    order: 1
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Category Created!");
                setNewCatName(''); setNewCatDesc('');
                fetchCategories();
            }
        } catch (err) {
            alert("Error creating category");
        }
    };

    // ─── CREATE ARTICLE ───
    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newArtCategory) return alert("Select a category!");
        try {
            const res = await fetch(`${API_URL}/api/support/knowledgebase`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newArtTitle,
                    slug: newArtTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    content: newArtContent,
                    category: newArtCategory,
                    isActive: true
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Article Live Created Successfully!");
                setNewArtTitle(''); setNewArtContent('');
            }
        } catch (err) {
            alert("Error creating article");
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <BookOpen className="text-blue-600"/> 
                Knowledge Base Admin
            </h1>

            {/* TAB NAVIGATION */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setActiveTab('articles')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border'}`}
                >
                    Create Article
                </button>
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border'}`}
                >
                    Manage Categories
                </button>
            </div>

            {/* CREATE ARTICLE TAB */}
            {activeTab === 'articles' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Publish New Article</h2>
                    <form onSubmit={handleCreateArticle} className="space-y-6">
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Article Title</label>
                            <input 
                                required type="text" value={newArtTitle} onChange={(e) => setNewArtTitle(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" 
                                placeholder="How to reset password?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Select Category</label>
                            <select 
                                required value={newArtCategory} onChange={(e) => setNewArtCategory(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                            >
                                <option value="">Select a logical category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* RICH TEXT EDITOR */}
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-2">Detailed Content (HTML Enabled)</label>
                            <div className="bg-white border flex-col rounded-xl overflow-hidden border-slate-200">
                                <ReactQuill 
                                    theme="snow" 
                                    value={newArtContent} 
                                    onChange={setNewArtContent} 
                                    className="h-64 mb-10"
                                />
                            </div>
                        </div>

                        <button type="submit" className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                            <Check size={18} /> Publish Live Article
                        </button>
                    </form>
                </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Category</h2>
                    <form onSubmit={handleCreateCategory} className="flex flex-wrap gap-4 items-end mb-10">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-bold text-slate-600 mb-2">Category Name</label>
                            <input required type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" placeholder="e.g. Server Setup" />
                        </div>
                        <div className="w-[150px]">
                            <label className="block text-sm font-bold text-slate-600 mb-2">Icon (Lucide)</label>
                            <input required type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" placeholder="e.g. Rocket" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-bold text-slate-600 mb-2">Description</label>
                            <input required type="text" value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
                            <Plus size={18} /> Add
                        </button>
                    </form>

                    <h2 className="text-lg font-bold text-slate-800 mb-4">Existing Categories</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-800">{cat.name}</p>
                                    <p className="text-xs text-slate-500">{cat.slug}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}