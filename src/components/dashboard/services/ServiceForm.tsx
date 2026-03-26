"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, Settings, LayoutTemplate, Shield, Lightbulb, Briefcase, Cpu, Target, CheckCircle, Megaphone, X } from "lucide-react";
import Link from "next/link";

// 🚀 FIXED: API Actions ab imported hain
import { createService, updateService } from "../../../actions/services";

export default function ServiceForm({ initialData = null, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 100% SYNCED WITH YOUR SCHEMA AND JSON DATA (NO LOGIC CHANGED)
  const [formData, setFormData] = useState(
    initialData || {
      // 1. Core Settings
      title: "", slug: "", iconName: "", templateType: "standard",
      isNew: false, isFeatured: false, showOnHome: true,
      metaTitle: "", metaDescription: "",

      // 2. Hero
      heroTitle: "", heroSubtitle: "", heroImage: "",

      // 3. Stats (Array of {v, l, d})
      statsTitle: "", statsSubtitle: "", statsList: [],

      // 4. Capabilities (Array of {t, d, backTitle, points: []})
      capabilitiesTitle: "", capabilitiesSubtitle: "", capabilitiesList: [],

      // 5. Architecture (Array of Strings)
      architectureTitle: "", architectureSubtitle: "", architectureList: [],

      // 6. Use Cases (Array of {title, desc})
      useCasesTitle: "", useCasesSubtitle: "", useCasesList: [],

      // 7. Philosophy (Array of {p, d})
      philosophyTitle: "", philosophyList: [],

      // 8. Security (Array of {t, d})
      securityTitle: "", securityList: [],

      // 9. Challenges (Array of {t, d})
      challengeTitle: "", challengeSubtitle: "", challengesList: [],

      // 10. CTA Section
      ctaTitle: "", ctaSubtitle: "", ctaButtonText: "",

      // 11. Pricing (Optional based on schema)
      essentialPrice: 0, essentialFeatures: [],
      premiumPrice: 0, premiumFeatures: [],
      enterprisePrice: "Custom", enterpriseFeatures: []
    }
  );

  // --- HANDLERS (NO LOGIC CHANGED) ---
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleStringArrayChange = (index: number, field: string, value: string) => {
    const newArray = [...(formData as any)[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleObjectArrayChange = (index: number, field: string, key: string, value: any) => {
    const newArray = [...(formData as any)[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: string, template: any) => {
    const currentArray = (formData as any)[field] || [];
    setFormData({ ...formData, [field]: [...currentArray, template] });
  };

  const removeArrayItem = (index: number, field: string) => {
    const newArray = [...(formData as any)[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  // --- SUBMIT LOGIC (NO LOGIC CHANGED) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalData = { ...formData };

    if (!finalData.slug) {
      finalData.slug = finalData.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    console.log("Sending Data to DB:", finalData);

    try {
      const res = (isEdit && initialData?.id)
        ? await updateService(initialData.id, finalData)
        : await createService(finalData);

      if (res?.success) {
        alert(`Service ${isEdit ? 'Updated' : 'Created'} Successfully! 🚀`);
        router.push("/services"); // Save hone ke baad table par wapas bhej dega
      } else {
        alert("Error: " + (res?.error || "Database mein save nahi hua."));
      }
    } catch (error) {
      alert("System Error: Backend se connect nahi ho paya.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🔥 UI UPGRADED TO MATCH SCREENSHOT MODAL STYLE
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300">
      
      {/* Dark Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>

      {/* Form Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] relative z-10 animate-in zoom-in-95 duration-200 font-sans">

        {/* 🔥 MODAL HEADER (Fixed at Top) */}
        <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-100 shrink-0 bg-white rounded-t-xl">
          <h2 className="text-[20px] font-semibold text-slate-800">
            {isEdit ? "Update Service Details" : "Add New Service"}
          </h2>
          <Link href="/services" className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={22} />
          </Link>
        </div>

        {/* 🔥 MODAL SCROLLABLE BODY */}
        <div className="overflow-y-auto flex-grow bg-white custom-scrollbar">
          <form id="serviceForm" onSubmit={handleSubmit} className="flex flex-col h-full">

            <div className="p-6 md:p-8 space-y-10">

              {/* 1. CORE SETTINGS */}
              <div>
                <h3 className="text-[#00b4d8] text-[13px] font-bold tracking-wider uppercase mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Settings size={16} /> 1. Core Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Service Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Custom Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Icon Name</label>
                    <input type="text" name="iconName" value={formData.iconName} onChange={handleChange} placeholder="e.g. Sparkles" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Template</label>
                    <select name="templateType" value={formData.templateType} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none appearance-none cursor-pointer transition-all">
                      <option value="standard">Standard</option>
                      <option value="landing-page">Landing Page</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                  <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#00b4d8] focus:ring-[#00b4d8] cursor-pointer" /> 
                    Show in Navbar Box
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
                    <input type="checkbox" name="showOnHome" checked={formData.showOnHome} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#00b4d8] focus:ring-[#00b4d8] cursor-pointer" /> 
                    Show on Home Grid
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
                    <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-[#00b4d8] focus:ring-[#00b4d8] cursor-pointer" /> 
                    "NEW" Badge
                  </label>
                </div>
              </div>

              {/* 2. HERO SECTION */}
              <div>
                <h3 className="text-[#3ed4b2] text-[13px] font-bold tracking-wider uppercase mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <LayoutTemplate size={16} /> 2. Hero Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Hero Main Title</label>
                    <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Hero Image URL</label>
                    <input type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} placeholder="https://..." className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] text-slate-500">Hero Subtitle</label>
                  <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-20 resize-none focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                </div>
              </div>

              {/* 3. CHALLENGES ({t, d}) */}
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                  <h3 className="text-[#00b4d8] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                    <CheckCircle size={16} /> 3. Challenges Solved
                  </h3>
                  <button type="button" onClick={() => addArrayItem('challengesList', { t: "", d: "" })} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Challenge
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="challengeTitle" value={formData.challengeTitle} onChange={handleChange} placeholder="Section Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  <input type="text" name="challengeSubtitle" value={formData.challengeSubtitle} onChange={handleChange} placeholder="Section Subtitle" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  {formData.challengesList?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                      <div className="flex-grow space-y-3">
                        <input type="text" value={item.t} onChange={(e) => handleObjectArrayChange(i, 'challengesList', 't', e.target.value)} placeholder="Challenge Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                        <textarea value={item.d} onChange={(e) => handleObjectArrayChange(i, 'challengesList', 'd', e.target.value)} placeholder="Description" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-16 resize-none focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                      </div>
                      <button type="button" onClick={() => removeArrayItem(i, 'challengesList')} className="text-slate-400 hover:text-red-500 transition-colors pt-2">
                        <Trash2 size={18} className="stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. ARCHITECTURE (Strings) */}
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                  <h3 className="text-[#3ed4b2] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                    <LayoutTemplate size={16} /> 4. Architecture / Process
                  </h3>
                  <button type="button" onClick={() => addArrayItem('architectureList', "")} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Step
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="architectureTitle" value={formData.architectureTitle} onChange={handleChange} placeholder="Section Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                  <input type="text" name="architectureSubtitle" value={formData.architectureSubtitle} onChange={handleChange} placeholder="Section Subtitle" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  {formData.architectureList?.map((item: string, i: number) => (
                    <div key={i} className="flex gap-3 items-center p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                      <span className="text-[13px] text-slate-400 w-6 text-center">{i + 1}.</span>
                      <input type="text" value={item} onChange={(e) => handleStringArrayChange(i, 'architectureList', e.target.value)} className="flex-grow p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" placeholder="e.g. Data Pre-processing" />
                      <button type="button" onClick={() => removeArrayItem(i, 'architectureList')} className="text-slate-400 hover:text-red-500 transition-colors px-2">
                        <Trash2 size={18} className="stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. STATS ({v, l, d}) */}
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                  <h3 className="text-[#00b4d8] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                    <Target size={16} /> 5. Key Stats
                  </h3>
                  <button type="button" onClick={() => addArrayItem('statsList', { v: "", l: "", d: "" })} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Stat
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="statsTitle" value={formData.statsTitle} onChange={handleChange} placeholder="Section Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  <input type="text" name="statsSubtitle" value={formData.statsSubtitle} onChange={handleChange} placeholder="Section Subtitle" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  {formData.statsList?.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                      <input type="text" value={item.v} onChange={(e) => handleObjectArrayChange(i, 'statsList', 'v', e.target.value)} placeholder="Value (98%)" className="w-full sm:w-1/4 p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                      <input type="text" value={item.l} onChange={(e) => handleObjectArrayChange(i, 'statsList', 'l', e.target.value)} placeholder="Label" className="w-full sm:w-1/4 p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                      <input type="text" value={item.d} onChange={(e) => handleObjectArrayChange(i, 'statsList', 'd', e.target.value)} placeholder="Description" className="w-full sm:w-1/2 p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                      <button type="button" onClick={() => removeArrayItem(i, 'statsList')} className="text-slate-400 hover:text-red-500 transition-colors sm:pt-2 text-right sm:text-left">
                        <Trash2 size={18} className="stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. CAPABILITIES ({t, d, backTitle, points}) */}
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                  <h3 className="text-[#3ed4b2] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                    <Cpu size={16} /> 6. Capabilities Stack
                  </h3>
                  <button type="button" onClick={() => addArrayItem('capabilitiesList', { t: "", d: "", backTitle: "", points: [] })} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Stack
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="capabilitiesTitle" value={formData.capabilitiesTitle} onChange={handleChange} placeholder="Section Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                  <input type="text" name="capabilitiesSubtitle" value={formData.capabilitiesSubtitle} onChange={handleChange} placeholder="Section Subtitle" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                </div>
                <div className="space-y-4">
                  {formData.capabilitiesList?.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-slate-100 rounded-lg bg-slate-50/50 relative">
                      <button type="button" onClick={() => removeArrayItem(i, 'capabilitiesList')} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} className="stroke-[1.5]" />
                      </button>

                      <div className="space-y-3">
                        <label className="text-[12px] font-semibold text-slate-500 uppercase">Front of Card</label>
                        <input type="text" value={item.t} onChange={(e) => handleObjectArrayChange(i, 'capabilitiesList', 't', e.target.value)} placeholder="Title (e.g. Predictive Analytics)" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                        <textarea value={item.d} onChange={(e) => handleObjectArrayChange(i, 'capabilitiesList', 'd', e.target.value)} placeholder="Description" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-24 resize-none focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[12px] font-semibold text-slate-500 uppercase">Back of Card</label>
                        <input type="text" value={item.backTitle} onChange={(e) => handleObjectArrayChange(i, 'capabilitiesList', 'backTitle', e.target.value)} placeholder="Back Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                        <textarea
                          value={item.points ? item.points.join('\n') : ''}
                          onChange={(e) => handleObjectArrayChange(i, 'capabilitiesList', 'points', e.target.value.split('\n'))}
                          placeholder="Enter bullet points (One per line)"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded text-[13px] text-slate-700 h-24 resize-none whitespace-pre-wrap font-mono focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. USE CASES ({title, desc}) */}
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                  <h3 className="text-[#00b4d8] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                    <Briefcase size={16} /> 7. Industry Use Cases
                  </h3>
                  <button type="button" onClick={() => addArrayItem('useCasesList', { title: "", desc: "" })} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Use Case
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="useCasesTitle" value={formData.useCasesTitle} onChange={handleChange} placeholder="Section Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  <input type="text" name="useCasesSubtitle" value={formData.useCasesSubtitle} onChange={handleChange} placeholder="Section Subtitle" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.useCasesList?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-3 p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex-col relative">
                      <input type="text" value={item.title} onChange={(e) => handleObjectArrayChange(i, 'useCasesList', 'title', e.target.value)} placeholder="Industry (e.g. FinTech)" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 pr-10 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                      <textarea value={item.desc} onChange={(e) => handleObjectArrayChange(i, 'useCasesList', 'desc', e.target.value)} placeholder="Description" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-16 resize-none focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                      <button type="button" onClick={() => removeArrayItem(i, 'useCasesList')} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} className="stroke-[1.5]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. PHILOSOPHY ({p, d}) & 9. SECURITY ({t, d}) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* PHILOSOPHY */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                    <h3 className="text-[#3ed4b2] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                      <Lightbulb size={16} /> 8. Philosophy
                    </h3>
                    <button type="button" onClick={() => addArrayItem('philosophyList', { p: "", d: "" })} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <input type="text" name="philosophyTitle" value={formData.philosophyTitle} onChange={handleChange} placeholder="Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 mb-4 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                  <div className="space-y-3">
                    {formData.philosophyList?.map((item: any, i: number) => (
                      <div key={i} className="flex gap-2 p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex-col relative">
                        <input type="text" value={item.p} onChange={(e) => handleObjectArrayChange(i, 'philosophyList', 'p', e.target.value)} placeholder="Philosophy Point" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 pr-10 focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                        <textarea value={item.d} onChange={(e) => handleObjectArrayChange(i, 'philosophyList', 'd', e.target.value)} placeholder="Description" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-16 resize-none focus:border-[#3ed4b2] focus:ring-1 focus:ring-[#3ed4b2] outline-none transition-all" />
                        <button type="button" onClick={() => removeArrayItem(i, 'philosophyList')} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} className="stroke-[1.5]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECURITY */}
                <div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                    <h3 className="text-[#00b4d8] text-[13px] font-bold tracking-wider uppercase flex items-center gap-2">
                      <Shield size={16} /> 9. Security
                    </h3>
                    <button type="button" onClick={() => addArrayItem('securityList', { t: "", d: "" })} className="px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded text-[12px] font-medium hover:bg-slate-50 transition-colors flex items-center gap-1">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <input type="text" name="securityTitle" value={formData.securityTitle} onChange={handleChange} placeholder="Title" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 mb-4 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                  <div className="space-y-3">
                    {formData.securityList?.map((item: any, i: number) => (
                      <div key={i} className="flex gap-2 p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex-col relative">
                        <input type="text" value={item.t} onChange={(e) => handleObjectArrayChange(i, 'securityList', 't', e.target.value)} placeholder="Security Feature" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 pr-10 focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                        <textarea value={item.d} onChange={(e) => handleObjectArrayChange(i, 'securityList', 'd', e.target.value)} placeholder="Description" className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-16 resize-none focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] outline-none transition-all" />
                        <button type="button" onClick={() => removeArrayItem(i, 'securityList')} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} className="stroke-[1.5]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 10. CTA SECTION (Made clean and consistent) */}
              <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                <h3 className="text-slate-600 text-[13px] font-bold tracking-wider uppercase mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Megaphone size={16} /> 10. Call to Action (CTA)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">CTA Title</label>
                    <input type="text" name="ctaTitle" value={formData.ctaTitle} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all" placeholder="e.g. Ready to Build the Autonomous Future?" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">CTA Subtitle</label>
                    <textarea name="ctaSubtitle" value={formData.ctaSubtitle} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 h-20 resize-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all" placeholder="e.g. Let's discuss your AI roadmap..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-500">Button Text</label>
                    <input type="text" name="ctaButtonText" value={formData.ctaButtonText} onChange={handleChange} className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all" placeholder="e.g. Build Your AI Model" />
                  </div>
                </div>
              </div>

            </div>

            {/* 🔥 MODAL FOOTER (Fixed at Bottom) */}
            <div className="px-6 md:px-8 py-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0 rounded-b-xl">
              <Link 
                href="/services" 
                className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded text-[14px] font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="px-6 py-2.5 bg-[#0e8bf1] text-white rounded text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : <><Save size={16} /> {isEdit ? "Update Service" : "Save Service"}</>}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}