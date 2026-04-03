"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// 🔥 Naye icons CreditCard aur Check add kiye hain Pricing UI ke liye
import { Save, Plus, Trash2, Settings, LayoutTemplate, Shield, Lightbulb, Briefcase, Cpu, Target, CheckCircle, Megaphone, X, CreditCard, Check, Sparkles, Minus } from "lucide-react";
import Link from "next/link";

// 🚀 FIXED: API Actions ab imported hain
import { createService, updateService } from "../../../actions/services";

export default function ServiceForm({ initialData = null, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 100% SYNCED WITH YOUR SCHEMA AND JSON DATA
  const [formData, setFormData] = useState(
    initialData || {
      // 1. Core Settings
      title: "", slug: "", iconName: "", templateType: "standard",
      isNew: false, isFeatured: false, showOnHome: true,
      metaTitle: "", metaDescription: "",

      // 2. Hero
      heroTitle: "", heroSubtitle: "", heroImage: "",

      // 3. Stats
      statsTitle: "", statsSubtitle: "", statsList: [],

      // 4. Capabilities
      capabilitiesTitle: "", capabilitiesSubtitle: "", capabilitiesList: [],

      // 5. Architecture
      architectureTitle: "", architectureSubtitle: "", architectureList: [],

      // 6. Use Cases
      useCasesTitle: "", useCasesSubtitle: "", useCasesList: [],

      // 7. Philosophy
      philosophyTitle: "", philosophyList: [],

      // 8. Security
      securityTitle: "", securityList: [],

      // 9. Challenges
      challengeTitle: "", challengeSubtitle: "", challengesList: [],

      // 10. CTA Section
      ctaTitle: "", ctaSubtitle: "", ctaButtonText: "",

      // 🔥 11. PRICING (UPDATED TO MATCH NEW JSON)
      pricingTitle: "", 
      pricingSubtitle: "", 
      pricingPlans: [] // Array of Objects (with nested features)
    }
  );

  // --- STANDARD HANDLERS ---
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

  // 🔥 NESTED HANDLERS FOR PRICING PLANS 🔥
  const handlePlanChange = (planIndex: number, field: string, value: any) => {
    const newPlans = [...formData.pricingPlans];
    newPlans[planIndex] = { ...newPlans[planIndex], [field]: value };
    setFormData({ ...formData, pricingPlans: newPlans });
  };

  const removePlan = (planIndex: number) => {
    const newPlans = [...formData.pricingPlans];
    newPlans.splice(planIndex, 1);
    setFormData({ ...formData, pricingPlans: newPlans });
  };

  const addFeatureToPlan = (planIndex: number) => {
    const newPlans = [...formData.pricingPlans];
    if (!newPlans[planIndex].features) newPlans[planIndex].features = [];
    newPlans[planIndex].features.push({ name: '', detail: '', included: true, isAI: false });
    setFormData({ ...formData, pricingPlans: newPlans });
  };

  const handleFeatureChange = (planIndex: number, featureIndex: number, field: string, value: any) => {
    const newPlans = [...formData.pricingPlans];
    newPlans[planIndex].features[featureIndex] = { ...newPlans[planIndex].features[featureIndex], [field]: value };
    setFormData({ ...formData, pricingPlans: newPlans });
  };

  const removeFeatureFromPlan = (planIndex: number, featureIndex: number) => {
    const newPlans = [...formData.pricingPlans];
    newPlans[planIndex].features.splice(featureIndex, 1);
    setFormData({ ...formData, pricingPlans: newPlans });
  };


  // --- SUBMIT LOGIC ---
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
        router.push("/services"); 
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300">
      
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] relative z-10 animate-in zoom-in-95 duration-200 font-sans">

        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-100 shrink-0 bg-white rounded-t-xl">
          <h2 className="text-[20px] font-semibold text-slate-800">
            {isEdit ? "Update Service Details" : "Add New Service"}
          </h2>
          <Link href="/services" className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={22} />
          </Link>
        </div>

        {/* MODAL SCROLLABLE BODY */}
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

              {/* 3. CHALLENGES */}
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

              {/* 4. ARCHITECTURE */}
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

              {/* 5. STATS */}
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

              {/* 6. CAPABILITIES */}
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

              {/* 7. USE CASES */}
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

              {/* 8. PHILOSOPHY & 9. SECURITY */}
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

              {/* 10. CTA SECTION */}
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


              {/* 🔥 11. PRICING PLANS SECTION (NEW DYNAMIC UI) 🔥 */}
              <div className="bg-[#f8fafc] p-6 rounded-xl border border-slate-200 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
                  <h3 className="text-[#5c2d91] text-[15px] font-bold tracking-wider uppercase flex items-center gap-2">
                    <CreditCard size={18} /> 11. Pricing Plans & Features
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => {
                        const newPlan = { id: Date.now().toString(), name: '', price: '', originalPrice: '', billingCycle: '', description: '', isPopular: false, btnText: 'Get Started', features: [] };
                        setFormData({ ...formData, pricingPlans: [...(formData.pricingPlans || []), newPlan] });
                    }} 
                    className="px-4 py-2 bg-white border border-slate-300 text-[#5c2d91] font-bold rounded-lg text-[13px] hover:bg-slate-50 hover:border-[#5c2d91] transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={16} /> Add New Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-600 font-medium">Pricing Section Title</label>
                    <input type="text" name="pricingTitle" value={formData.pricingTitle || ""} onChange={handleChange} placeholder="e.g. Choose your growth plan" className="w-full p-2.5 bg-white border border-slate-300 rounded text-sm text-slate-800 focus:border-[#5c2d91] focus:ring-1 focus:ring-[#5c2d91] outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] text-slate-600 font-medium">Pricing Section Subtitle</label>
                    <input type="text" name="pricingSubtitle" value={formData.pricingSubtitle || ""} onChange={handleChange} placeholder="e.g. Transparent pricing tailored for you." className="w-full p-2.5 bg-white border border-slate-300 rounded text-sm text-slate-800 focus:border-[#5c2d91] focus:ring-1 focus:ring-[#5c2d91] outline-none" />
                  </div>
                </div>

                {/* PLANS LOOP */}
                <div className="space-y-6">
                  {formData.pricingPlans?.map((plan: any, pIndex: number) => (
                    <div key={pIndex} className={`bg-white border ${plan.isPopular ? 'border-[#5c2d91] shadow-md' : 'border-slate-300'} rounded-xl p-5 relative transition-all`}>
                      
                      {/* Plan Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                           <h4 className="font-bold text-lg text-slate-800">Plan #{pIndex + 1}</h4>
                           <label className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                              <input type="checkbox" checked={plan.isPopular} onChange={(e) => handlePlanChange(pIndex, 'isPopular', e.target.checked)} className="w-4 h-4 rounded text-[#5c2d91] cursor-pointer" />
                              🌟 Mark as Popular
                           </label>
                        </div>
                        <button type="button" onClick={() => removePlan(pIndex)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Plan Basic Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input type="text" value={plan.name} onChange={(e) => handlePlanChange(pIndex, 'name', e.target.value)} placeholder="Plan Name (e.g. Premium)" className="p-2.5 border border-slate-200 rounded text-sm" />
                        <input type="text" value={plan.price} onChange={(e) => handlePlanChange(pIndex, 'price', e.target.value)} placeholder="Price (e.g. 49,999 or Custom)" className="p-2.5 border border-slate-200 rounded text-sm font-bold text-slate-800" />
                        <input type="text" value={plan.originalPrice} onChange={(e) => handlePlanChange(pIndex, 'originalPrice', e.target.value)} placeholder="Original Price (Crossed out)" className="p-2.5 border border-slate-200 rounded text-sm line-through text-slate-500" />
                        <input type="text" value={plan.billingCycle} onChange={(e) => handlePlanChange(pIndex, 'billingCycle', e.target.value)} placeholder="Billing Cycle (e.g. per month)" className="p-2.5 border border-slate-200 rounded text-sm" />
                        <input type="text" value={plan.btnText} onChange={(e) => handlePlanChange(pIndex, 'btnText', e.target.value)} placeholder="Button Text" className="p-2.5 border border-slate-200 rounded text-sm" />
                        <input type="text" value={plan.description} onChange={(e) => handlePlanChange(pIndex, 'description', e.target.value)} placeholder="Short Description" className="p-2.5 border border-slate-200 rounded text-sm md:col-span-3" />
                      </div>

                      {/* Plan Features Loop */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-slate-700 text-sm">Features for {plan.name || `Plan #${pIndex + 1}`}</h5>
                          <button type="button" onClick={() => addFeatureToPlan(pIndex)} className="text-[12px] font-bold text-[#00b4d8] hover:text-[#008ba8] flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                            <Plus size={12} /> Add Feature
                          </button>
                        </div>

                        <div className="space-y-2">
                          {plan.features?.map((feat: any, fIndex: number) => (
                            <div key={fIndex} className="flex flex-col md:flex-row items-center gap-3 bg-white p-2.5 rounded border border-slate-200">
                              
                              {/* Toggles (Included / AI) */}
                              <div className="flex gap-2 shrink-0 self-start md:self-center">
                                <label className="cursor-pointer" title="Feature is included?">
                                  <div className={`w-8 h-8 rounded flex items-center justify-center border transition-colors ${feat.included ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                    <input type="checkbox" className="hidden" checked={feat.included} onChange={(e) => handleFeatureChange(pIndex, fIndex, 'included', e.target.checked)} />
                                    {feat.included ? <Check size={16} /> : <Minus size={16} />}
                                  </div>
                                </label>
                                <label className="cursor-pointer" title="Is this an AI feature? (Shows sparkle)">
                                  <div className={`w-8 h-8 rounded flex items-center justify-center border transition-colors ${feat.isAI ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                    <input type="checkbox" className="hidden" checked={feat.isAI || false} onChange={(e) => handleFeatureChange(pIndex, fIndex, 'isAI', e.target.checked)} />
                                    <Sparkles size={16} />
                                  </div>
                                </label>
                              </div>

                              {/* Text Inputs */}
                              <input type="text" value={feat.name} onChange={(e) => handleFeatureChange(pIndex, fIndex, 'name', e.target.value)} placeholder="Feature Name" className={`flex-1 p-2 border border-slate-200 rounded text-sm ${!feat.included && 'text-slate-400 line-through'}`} />
                              <input type="text" value={feat.detail} onChange={(e) => handleFeatureChange(pIndex, fIndex, 'detail', e.target.value)} placeholder="Tooltip Detail Description" className="flex-1 p-2 border border-slate-200 rounded text-sm text-slate-600" />
                              
                              <button type="button" onClick={() => removeFeatureFromPlan(pIndex, fIndex)} className="text-slate-400 hover:text-red-500 p-1 shrink-0 self-start md:self-center">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          {(!plan.features || plan.features.length === 0) && (
                            <div className="text-center py-4 text-slate-400 text-sm italic">No features added to this plan yet.</div>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                  
                  {(!formData.pricingPlans || formData.pricingPlans.length === 0) && (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                      <CreditCard size={40} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium">No pricing plans added. Click "Add New Plan" above to create one.</p>
                    </div>
                  )}
                </div>
              </div>
              {/* 🔥 PRICING SECTION END 🔥 */}

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 md:px-8 py-5 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3 shrink-0 rounded-b-xl">
              <Link href="/services" className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded text-[14px] font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-[#0e8bf1] text-white rounded text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
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