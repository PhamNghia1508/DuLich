import React, { useState } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  Languages, 
  Compass, 
  Accessibility, 
  DollarSign, 
  Check, 
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, EXPERIENCE_CATEGORIES } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import type { TripRequest, ExperienceCategory, PersonalityTag, GuideGender } from '@/types';

type FormState = Omit<TripRequest, 'id'>;

export default function MatchPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsgIdx, setSubmitMsgIdx] = useState(0);

  const [formData, setFormData] = useState<FormState>({
    destination: 'Ho Chi Minh City',
    districts: ['All'],
    startDate: '',
    endDate: '',
    preferredTime: 'Morning',
    flexibleDates: false,
    groupType: 'solo',
    adultsCount: 1,
    childrenCount: 0,
    olderTravelers: false,
    preferredLanguage: 'en',
    guideGenderPreference: 'no-preference',
    communicationStyle: [],
    experienceInterests: [],
    walkingPace: 'moderate',
    mobilityAssistance: false,
    foodAllergies: [],
    dietaryRequirements: ['None'],
    medicalConsiderations: '',
    heatSensitivity: false,
    regularBreaks: false,
    otherRequests: '',
    budgetMin: 15,
    budgetMax: 30,
    budgetUnit: 'per-hour',
    privateExperience: true,
    budgetNotes: '',
  });

  const districtsList = [
    'All',
    'District 1',
    'District 3',
    'District 5',
    'District 8',
    'Cholon',
    'Cu Chi',
    'Can Gio',
  ];

  const commStyles: { value: PersonalityTag; label: string }[] = [
    { value: 'friendly-talkative', label: 'Friendly & Talkative' },
    { value: 'calm-thoughtful', label: 'Calm & Thoughtful' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'professional', label: 'Professional' },
    { value: 'flexible-spontaneous', label: 'Flexible & Spontaneous' },
  ];

  const submissionMessages = [
    'Searching 47 verified guides in Ho Chi Minh City...',
    'Matching language skills and availability...',
    'Checking district specialities and walking pace suitability...',
    'Filtering for dietary requirements and accessibility needs...',
    'Ranking guides by matching score...',
  ];

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const toggleDistrict = (dist: string) => {
    if (dist === 'All') {
      setFormData(prev => ({ ...prev, districts: ['All'] }));
      return;
    }

    setFormData(prev => {
      let next = prev.districts.filter(d => d !== 'All');
      if (next.includes(dist)) {
        next = next.filter(d => d !== dist);
      } else {
        next.push(dist);
      }
      if (next.length === 0) next = ['All'];
      return { ...prev, districts: next };
    });
  };

  const toggleCommStyle = (style: PersonalityTag) => {
    setFormData(prev => {
      let next = [...prev.communicationStyle];
      if (next.includes(style)) {
        next = next.filter(s => s !== style);
      } else {
        next.push(style);
      }
      return { ...prev, communicationStyle: next };
    });
  };

  const toggleInterest = (cat: ExperienceCategory) => {
    setFormData(prev => {
      let next = [...prev.experienceInterests];
      if (next.includes(cat)) {
        next = next.filter(c => c !== cat);
      } else {
        next.push(cat);
      }
      return { ...prev, experienceInterests: next };
    });
  };

  const toggleDiet = (diet: string) => {
    if (diet === 'None') {
      setFormData(prev => ({ ...prev, dietaryRequirements: ['None'] }));
      return;
    }
    setFormData(prev => {
      let next = prev.dietaryRequirements.filter(d => d !== 'None');
      if (next.includes(diet)) {
        next = next.filter(d => d !== diet);
      } else {
        next.push(diet);
      }
      if (next.length === 0) next = ['None'];
      return { ...prev, dietaryRequirements: next };
    });
  };

  const handleSubmittingProcess = () => {
    setIsSubmitting(true);
    setSubmitMsgIdx(0);
    
    // Cycle through messages
    const timer1 = setTimeout(() => setSubmitMsgIdx(1), 1000);
    const timer2 = setTimeout(() => setSubmitMsgIdx(2), 2000);
    const timer3 = setTimeout(() => setSubmitMsgIdx(3), 3200);
    const timer4 = setTimeout(() => setSubmitMsgIdx(4), 4500);

    const finishTimer = setTimeout(() => {
      // Build query string based on preferences to filter in guides page
      const q = new URLSearchParams();
      q.set('matched', 'true');
      q.set('lang', formData.preferredLanguage);
      if (formData.experienceInterests.length > 0) {
        q.set('category', formData.experienceInterests[0]);
      }
      if (formData.guideGenderPreference !== 'no-preference') {
        q.set('gender', formData.guideGenderPreference);
      }
      q.set('maxPrice', formData.budgetMax.toString());
      if (formData.mobilityAssistance) {
        q.set('accessibility', 'true');
      }

      navigate(`/guides?${q.toString()}`);
    }, 6000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* Matching process overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-[#FAFAF7] z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="bg-[#F5F0EA] border border-[#E8E4DC] p-10 rounded-2xl max-w-md w-full shadow-lg relative overflow-hidden">
            {/* Spinning decorative compass */}
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#1C3A2E] flex items-center justify-center animate-spin mx-auto mb-8 duration-[8s]">
              <Sparkles className="text-[#C4614A] animate-pulse" size={32} />
            </div>

            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1A1A1A] mb-3">
              Finding your perfect guide match
            </h2>
            <div className="h-1.5 bg-[#E8E4DC] rounded-full overflow-hidden w-full mb-6">
              <div 
                className="h-full bg-[#1C3A2E] rounded-full transition-all duration-1000" 
                style={{ width: `${(submitMsgIdx + 1) * 20}%` }}
              />
            </div>
            <p className="text-sm font-semibold text-[#1C3A2E] animate-fade-in transition-all duration-300">
              {submissionMessages[submitMsgIdx]}
            </p>
            <p className="text-xs text-[#8A8A8A] mt-6 leading-normal">
              Searching district specialties, matching language skills, and verifying certifications...
            </p>
          </div>
        </div>
      )}

      {/* Progress header bar */}
      <div className="bg-white border-b border-[#E8E4DC]">
        <div className="container max-w-4xl py-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1.5 text-xs font-bold text-[#5A5A5A] hover:text-[#1A1A1A] disabled:opacity-30 disabled:hover:text-[#5A5A5A] transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          
          <div className="flex-1 max-w-md mx-6">
            <div className="flex justify-between text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1.5">
              <span>Step {step} of 7</span>
              <span>{Math.round((step / 7) * 100)}% Complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(step / 7) * 100}%` }} />
            </div>
          </div>

          <span className="text-xs font-semibold text-[#8A8A8A]">
            LocaLink Matcher
          </span>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container max-w-[720px]">
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 md:p-10 shadow-sm">
            
            {/* STEP 1: Destination & Schedule */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-[#C4614A]" size={20} />
                  <span className="section-label">DESTINATION & SCHEDULE</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  Where and when are you traveling?
                </h2>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="label">Destination City</label>
                    <select 
                      value={formData.destination} 
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      className="input"
                    >
                      <option>Ho Chi Minh City</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Select Districts / Areas of Interest</label>
                    <div className="flex flex-wrap gap-2">
                      {districtsList.map((dist) => {
                        const isSelected = formData.districts.includes(dist);
                        return (
                          <button
                            key={dist}
                            onClick={() => toggleDistrict(dist)}
                            className={`py-1.5 px-3 rounded-md text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-[#EAF0EC] border-[#1C3A2E] text-[#1C3A2E] font-bold'
                                : 'bg-white border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            {dist}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Start Date</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">End Date</label>
                      <input 
                        type="date" 
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="flexible-dates"
                      checked={formData.flexibleDates}
                      onChange={(e) => setFormData(prev => ({ ...prev, flexibleDates: e.target.checked }))}
                      className="w-4 h-4 accent-[#1C3A2E] cursor-pointer"
                    />
                    <label htmlFor="flexible-dates" className="text-xs font-semibold text-[#5A5A5A] cursor-pointer select-none">
                      My dates are flexible
                    </label>
                  </div>

                  <div>
                    <label className="label">Preferred Meeting Time</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {['Morning', 'Mid-day', 'Afternoon', 'Evening', 'Flexible'].map((t) => {
                        const isSelected = formData.preferredTime === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setFormData(prev => ({ ...prev, preferredTime: t }))}
                            className={`py-2 px-1 rounded-md text-xs font-semibold border text-center transition-all ${
                              isSelected
                                ? 'bg-[#EAF0EC] border-[#1C3A2E] text-[#1C3A2E] font-bold'
                                : 'bg-white border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Who is traveling */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-[#C4614A]" size={20} />
                  <span className="section-label">TRAVEL PARTY</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  Who is traveling with you?
                </h2>

                <div className="space-y-6 pt-4">
                  {/* Visual Group Cards */}
                  <div>
                    <label className="label">Travel Setup</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { val: 'solo', label: 'Solo', icon: '👤' },
                        { val: 'couple', label: 'Couple', icon: '👥' },
                        { val: 'family', label: 'Family', icon: '👨‍👩‍👧' },
                        { val: 'friends', label: 'Friends', icon: '🍻' },
                        { val: 'business', label: 'Business', icon: '💼' }
                      ].map((grp) => {
                        const isSelected = formData.groupType === grp.val;
                        return (
                          <button
                            key={grp.val}
                            onClick={() => setFormData(prev => ({ ...prev, groupType: grp.val as any }))}
                            className={`select-card ${isSelected ? 'selected' : ''} flex flex-col items-center py-4`}
                          >
                            <span className="text-2xl mb-2">{grp.icon}</span>
                            <span className="text-xs font-bold">{grp.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Steppers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#F5F0EA] pt-6">
                    <div className="flex items-center justify-between bg-[#FAFAF7] p-4 rounded-xl border border-[#E8E4DC]">
                      <div>
                        <span className="text-sm font-bold text-[#1A1A1A] block">Adults</span>
                        <span className="text-xs text-[#8A8A8A]">Age 13 or older</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, adultsCount: Math.max(1, prev.adultsCount - 1) }))}
                          className="w-8 h-8 rounded-full bg-white border border-[#E8E4DC] font-bold text-sm flex items-center justify-center hover:border-[#1C3A2E]"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-[#1A1A1A] w-4 text-center">{formData.adultsCount}</span>
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, adultsCount: prev.adultsCount + 1 }))}
                          className="w-8 h-8 rounded-full bg-white border border-[#E8E4DC] font-bold text-sm flex items-center justify-center hover:border-[#1C3A2E]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-[#FAFAF7] p-4 rounded-xl border border-[#E8E4DC]">
                      <div>
                        <span className="text-sm font-bold text-[#1A1A1A] block">Children</span>
                        <span className="text-xs text-[#8A8A8A]">Age 12 or younger</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, childrenCount: Math.max(0, prev.childrenCount - 1) }))}
                          className="w-8 h-8 rounded-full bg-white border border-[#E8E4DC] font-bold text-sm flex items-center justify-center hover:border-[#1C3A2E]"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-[#1A1A1A] w-4 text-center">{formData.childrenCount}</span>
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, childrenCount: prev.childrenCount + 1 }))}
                          className="w-8 h-8 rounded-full bg-white border border-[#E8E4DC] font-bold text-sm flex items-center justify-center hover:border-[#1C3A2E]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="older-travelers"
                      checked={formData.olderTravelers}
                      onChange={(e) => setFormData(prev => ({ ...prev, olderTravelers: e.target.checked }))}
                      className="w-4 h-4 accent-[#1C3A2E] cursor-pointer"
                    />
                    <label htmlFor="older-travelers" className="text-xs font-semibold text-[#5A5A5A] cursor-pointer select-none">
                      Our travel party includes older travelers who may need slow pacing or regular breaks
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Language & Guide Preference */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="text-[#C4614A]" size={20} />
                  <span className="section-label">LANGUAGE & STYLE</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  Spoken language and guide style preference
                </h2>

                <div className="space-y-6 pt-4">
                  <div>
                    <label className="label">Preferred Language with Guide</label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                      className="input"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.nativeName} ({lang.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Guide Gender Preference (Optional)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'no-preference', label: 'No preference' },
                        { val: 'male', label: 'Male guide' },
                        { val: 'female', label: 'Female guide' },
                      ].map((g) => {
                        const isSelected = formData.guideGenderPreference === g.val;
                        return (
                          <button
                            key={g.val}
                            onClick={() => setFormData(prev => ({ ...prev, guideGenderPreference: g.val as any }))}
                            className={`py-2 px-3 rounded-md text-xs font-semibold border text-center transition-all ${
                              isSelected
                                ? 'bg-[#EAF0EC] border-[#1C3A2E] text-[#1C3A2E] font-bold'
                                : 'bg-white border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="label">Preferred Communication / Guide Style (Select multiple)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {commStyles.map((item) => {
                        const isSelected = formData.communicationStyle.includes(item.value);
                        return (
                          <button
                            key={item.value}
                            onClick={() => toggleCommStyle(item.value)}
                            className={`select-card ${isSelected ? 'selected' : ''} text-left py-3.5 flex items-center justify-between`}
                          >
                            <span className="text-xs font-bold text-[#1A1A1A]">{item.label}</span>
                            {isSelected && <Check size={14} className="text-[#1C3A2E]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Experience Preferences */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="text-[#C4614A]" size={20} />
                  <span className="section-label">EXPERIENCE INTERESTS</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  What would you like to explore?
                </h2>
                <p className="text-xs text-[#5A5A5A] -mt-2">
                  Select everything that interests you. We will search for guides who possess specific expertise.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {EXPERIENCE_CATEGORIES.map((cat) => {
                    const isSelected = formData.experienceInterests.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleInterest(cat.id)}
                        className={`select-card ${isSelected ? 'selected' : ''} text-left p-3.5 flex gap-3 items-start`}
                      >
                        <span className="text-2xl mt-0.5" role="img" aria-label={cat.label}>{cat.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-[#1A1A1A] block mb-0.5">{cat.label}</span>
                          <span className="text-[10px] text-[#8A8A8A] leading-tight block">{cat.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Health & Accessibility */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Accessibility className="text-[#C4614A]" size={20} />
                  <span className="section-label">HEALTH & ACCESSIBILITY</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  Health and mobility considerations
                </h2>

                <div className="bg-[#F5F0EA] border border-[#E8E4DC] p-4 rounded-xl flex gap-3 text-xs text-[#5A5A5A] mb-4">
                  <Info size={18} className="text-[#C4614A] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    This information is kept strictly private. Sharing details helps us match you with a guide who can ensure a safe and comfortable experience.
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  <div>
                    <label className="label">Walking Pace Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'slow', label: 'Slow & relaxed' },
                        { val: 'moderate', label: 'Moderate' },
                        { val: 'fast', label: 'Active & fast-paced' },
                      ].map((p) => {
                        const isSelected = formData.walkingPace === p.val;
                        return (
                          <button
                            key={p.val}
                            onClick={() => setFormData(prev => ({ ...prev, walkingPace: p.val as any }))}
                            className={`py-2.5 px-2 rounded-md text-xs font-semibold border text-center transition-all ${
                              isSelected
                                ? 'bg-[#EAF0EC] border-[#1C3A2E] text-[#1C3A2E] font-bold'
                                : 'bg-white border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="label">Accommodations Needed</label>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="mobility-assistance"
                        checked={formData.mobilityAssistance}
                        onChange={(e) => setFormData(prev => ({ ...prev, mobilityAssistance: e.target.checked }))}
                        className="w-4 h-4 accent-[#1C3A2E] cursor-pointer"
                      />
                      <label htmlFor="mobility-assistance" className="text-xs font-semibold text-[#5A5A5A] cursor-pointer select-none">
                        Requires wheelchair / walking assistance accessibility routes
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="heat-sensitivity"
                        checked={formData.heatSensitivity}
                        onChange={(e) => setFormData(prev => ({ ...prev, heatSensitivity: e.target.checked }))}
                        className="w-4 h-4 accent-[#1C3A2E] cursor-pointer"
                      />
                      <label htmlFor="heat-sensitivity" className="text-xs font-semibold text-[#5A5A5A] cursor-pointer select-none">
                        Sensitive to tropical heat (needs regular air-conditioned stops)
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="regular-breaks"
                        checked={formData.regularBreaks}
                        onChange={(e) => setFormData(prev => ({ ...prev, regularBreaks: e.target.checked }))}
                        className="w-4 h-4 accent-[#1C3A2E] cursor-pointer"
                      />
                      <label htmlFor="regular-breaks" className="text-xs font-semibold text-[#5A5A5A] cursor-pointer select-none">
                        Needs regular rest breaks (seated rest every 30–45 mins)
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#F5F0EA] pt-4">
                    <div>
                      <label className="label">Food Allergies (e.g. Shellfish, Peanuts)</label>
                      <input
                        type="text"
                        placeholder="Type allergies, separated by commas"
                        className="input"
                        onChange={(e) => {
                          const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setFormData(prev => ({ ...prev, foodAllergies: val }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="label">Dietary Requirements</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['None', 'Vegetarian', 'Vegan', 'Halal'].map((diet) => {
                          const isSelected = formData.dietaryRequirements.includes(diet);
                          return (
                            <button
                              key={diet}
                              onClick={() => toggleDiet(diet)}
                              className={`py-1.5 px-2 rounded-md text-[10px] font-bold border text-center transition-all ${
                                isSelected
                                  ? 'bg-[#EAF0EC] border-[#1C3A2E] text-[#1C3A2E]'
                                  : 'bg-white border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
                              }`}
                            >
                              {diet}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Other medical or pacing requests (Optional)</label>
                    <textarea
                      placeholder="e.g. Visual/hearing accommodation, asthma, travel pace details..."
                      className="input min-h-[64px] py-2 text-xs"
                      value={formData.medicalConsiderations}
                      onChange={(e) => setFormData(prev => ({ ...prev, medicalConsiderations: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Budget */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-[#C4614A]" size={20} />
                  <span className="section-label">BUDGET & RATE TYPE</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  Budget range and pricing preference
                </h2>

                <div className="space-y-6 pt-4">
                  <div>
                    <label className="label">Rate Unit Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: 'per-hour', label: 'Per hour' },
                        { val: 'half-day', label: 'Half Day (4 hrs)' },
                        { val: 'full-day', label: 'Full Day (8 hrs)' },
                      ].map((unit) => {
                        const isSelected = formData.budgetUnit === unit.val;
                        return (
                          <button
                            key={unit.val}
                            onClick={() => setFormData(prev => ({ ...prev, budgetUnit: unit.val as any }))}
                            className={`py-2.5 px-2 rounded-md text-xs font-semibold border text-center transition-all ${
                              isSelected
                                ? 'bg-[#EAF0EC] border-[#1C3A2E] text-[#1C3A2E] font-bold'
                                : 'bg-white border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
                            }`}
                          >
                            {unit.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="label">Target Price Range (USD)</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-[10px] text-xs font-bold text-[#8A8A8A]">$</span>
                        <input
                          type="number"
                          value={formData.budgetMin}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: parseInt(e.target.value) || 0 }))}
                          className="input pl-7"
                          min="0"
                        />
                        <span className="text-[10px] text-[#8A8A8A] mt-1 block">Min Price</span>
                      </div>
                      <span className="text-xs font-bold text-[#8A8A8A] mt-[-16px]">to</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-[10px] text-xs font-bold text-[#8A8A8A]">$</span>
                        <input
                          type="number"
                          value={formData.budgetMax}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: parseInt(e.target.value) || 0 }))}
                          className="input pl-7"
                          min="0"
                        />
                        <span className="text-[10px] text-[#8A8A8A] mt-1 block">Max Price</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Experience Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { val: true, title: 'Private Experience', desc: 'Just you and your selected travel party' },
                        { val: false, title: 'Shared Experience', desc: 'Small group matching with other travelers' },
                      ].map((t) => {
                        const isSelected = formData.privateExperience === t.val;
                        return (
                          <button
                            key={t.title}
                            onClick={() => setFormData(prev => ({ ...prev, privateExperience: t.val }))}
                            className={`select-card ${isSelected ? 'selected' : ''} text-left p-3.5`}
                          >
                            <span className="text-xs font-bold text-[#1A1A1A] block mb-1">{t.title}</span>
                            <span className="text-[10px] text-[#8A8A8A] leading-tight block">{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Summary & Request */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-[#C4614A]" size={20} />
                  <span className="section-label">YOUR TRIP AT A GLANCE</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-[#1A1A1A] font-bold leading-tight">
                  Review your guide preferences
                </h2>

                <div className="divide-y divide-[#F5F0EA] border border-[#E8E4DC] rounded-xl overflow-hidden text-xs">
                  {/* Destination */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">DESTINATION & AREAS</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {formData.destination} ({formData.districts.join(', ')})
                      </span>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>

                  {/* Dates */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">DATES & TIMING</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {formData.startDate ? formData.startDate : 'Flexible'} to {formData.endDate ? formData.endDate : 'Flexible'} · {formData.preferredTime}
                      </span>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>

                  {/* Party */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">TRAVEL PARTY</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {formData.adultsCount} Adult(s) {formData.childrenCount > 0 && `· ${formData.childrenCount} Child(ren)`} · Group style: {formData.groupType}
                        {formData.olderTravelers && ' (Includes older travelers)'}
                      </span>
                    </div>
                    <button onClick={() => setStep(2)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>

                  {/* Language */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">LANGUAGES & GUIDE</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        Language: {SUPPORTED_LANGUAGES.find(l => l.code === formData.preferredLanguage)?.name} · Gender: {formData.guideGenderPreference} 
                        {formData.communicationStyle.length > 0 && ` · Style: ${formData.communicationStyle.join(', ')}`}
                      </span>
                    </div>
                    <button onClick={() => setStep(3)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>

                  {/* Interests */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">EXPLORATION FIELDS</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {formData.experienceInterests.length > 0 ? formData.experienceInterests.join(', ') : 'All categories'}
                      </span>
                    </div>
                    <button onClick={() => setStep(4)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>

                  {/* Health */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">HEALTH & PACING</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        Pace: {formData.walkingPace} · Needs: {formData.mobilityAssistance ? 'Mobility Access' : 'Standard'}
                        {formData.heatSensitivity && ' · Heat Sensitive'}
                        {formData.foodAllergies.length > 0 && ` · Allergies: ${formData.foodAllergies.join(', ')}`}
                        {formData.dietaryRequirements.length > 0 && ` · Diet: ${formData.dietaryRequirements.join(', ')}`}
                      </span>
                    </div>
                    <button onClick={() => setStep(5)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>

                  {/* Budget */}
                  <div className="p-4 flex justify-between items-start hover:bg-[#FAFAF7]">
                    <div>
                      <span className="font-bold text-[#8A8A8A] block mb-1">BUDGET RANGE</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {formatCurrency(formData.budgetMin)} - {formatCurrency(formData.budgetMax)} {formData.budgetUnit} · {formData.privateExperience ? 'Private' : 'Shared group'}
                      </span>
                    </div>
                    <button onClick={() => setStep(6)} className="text-[#C4614A] font-bold hover:underline">Edit</button>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button 
                    onClick={handleSubmittingProcess} 
                    className="btn btn-accent btn-lg w-full flex items-center justify-center gap-2 shadow-md"
                  >
                    <Search size={18} /> Find my guide matches
                  </button>
                </div>
              </div>
            )}

            {/* Step navigation buttons at bottom (except final step) */}
            {step < 7 && (
              <div className="flex justify-between items-center border-t border-[#F5F0EA] pt-6 mt-8">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="btn btn-ghost disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
