
import React from 'react';
import { Check, Zap, Crown, Shield, ArrowRight, Star } from 'lucide-react';
import { SubscriptionTier } from '../types';

interface SubscriptionPlansProps {
  currentTier: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentTier, onSelect, onClose }) => {
  const plans = [
    {
      id: SubscriptionTier.FREE,
      name: 'Citizen',
      price: '$0',
      description: 'Basic neural access for enthusiasts.',
      features: [
        'Standard Generation Speed',
        'User Portal Access',
        'Basic Dashboard',
        'Community Support'
      ],
      icon: Shield,
      color: 'bg-slate-100 text-slate-600',
      buttonColor: 'bg-slate-900 text-white'
    },
    {
      id: SubscriptionTier.PRO,
      name: 'Architect',
      price: '$29',
      description: 'Advanced tools for creative materialization.',
      features: [
        'High-Speed Neural Processing',
        'Creative Studio Pro',
        'App Architect Access',
        'Regeneration Hub',
        'Priority Support'
      ],
      icon: Zap,
      color: 'bg-blue-50 text-blue-600',
      buttonColor: 'bg-blue-600 text-white',
      recommended: true
    },
    {
      id: SubscriptionTier.ELITE,
      name: 'Universal',
      price: '$99',
      description: 'Full ecosystem control and world building.',
      features: [
        'Real-time World Engine',
        'Omni Data Core Access',
        'Integrity Sentinel',
        'Admin Panel Authorization',
        '24/7 Neural Concierge'
      ],
      icon: Crown,
      color: 'bg-purple-50 text-purple-600',
      buttonColor: 'bg-purple-600 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="w-full max-w-6xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter">
            Choose Your <span className="text-blue-400">Neural Tier</span>
          </h2>
          <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
            Select the level of authorization required for your materialization needs. 
            All subscriptions are secured by cn2025 Integrity Protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative glass bg-white rounded-[3rem] p-10 border transition-all duration-500 flex flex-col ${
                plan.recommended ? 'border-blue-400 shadow-2xl shadow-blue-500/20 scale-105 z-10' : 'border-slate-200'
              } ${currentTier === plan.id ? 'ring-4 ring-emerald-500/30' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-3 h-3 fill-white" /> Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl ${plan.color}`}>
                  <plan.icon className="w-8 h-8" />
                </div>
                {currentTier === plan.id && (
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Active</span>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 font-bold uppercase text-xs">/ month</span>
                </div>
                <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-1 bg-emerald-50 rounded-full">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelect(plan.id)}
                disabled={currentTier === plan.id}
                className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonColor}`}
              >
                {currentTier === plan.id ? 'Current Authorization' : `Select ${plan.name}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-12 mx-auto block text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-colors"
        >
          Close and Return
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
