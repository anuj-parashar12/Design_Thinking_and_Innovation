// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { 
//   HeartHandshake, 
//   Users, 
//   Clock, 
//   Compass, 
//   Sparkles, 
//   ShieldCheck, 
//   ArrowRight, 
//   MapPin, 
//   IndianRupee,
//   Award,
//   TrendingUp,
//   Layers,
//   CheckCircle2,
//   Package
// } from 'lucide-react';

// export default function OurImpact() {
//   const { impactStats, refreshImpactStats, products } = useAuth();

//   // If stats not loaded yet, calculate immediately
//   const stats = impactStats || {
//     totalCompletedOrderValue: 0,
//     uniqueArtisansSupported: 0,
//     totalCraftsmanshipHours: 0,
//     craftTraditionsCount: 0,
//     completedOrdersCount: 0,
//     totalOrdersCount: 0,
//     stateBreakdown: {},
//     craftTraditionsList: [],
//     recentCompletedOrders: []
//   };

//   // Interactive impact simulator state
//   const [simulatedHours, setSimulatedHours] = useState(40);
//   const [simulatedTradition, setSimulatedTradition] = useState('Madhubani Painting');

//   return (
//     <div className="space-y-16 pb-16">
      
//       {/* 1. HERO SECTION */}
//       <section className="relative overflow-hidden pt-12 md:pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b border-cream-200 bg-linear-to-b from-cream-100 to-cream-50">
//         <div className="max-w-4xl mx-auto text-center space-y-6">
          
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-100 border border-terracotta-300 text-terracotta-700 text-xs font-semibold tracking-wide shadow-2xs">
//             <Sparkles className="w-4 h-4 text-amber-500" />
//             <span>100% Dynamic Impact Metrics • Live Application Data</span>
//           </div>

//           <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-earth-900 tracking-tight leading-tight">
//             Preserving India's Living <span className="text-terracotta-500 italic">Heritage</span>
//           </h1>

//           <p className="max-w-2xl mx-auto text-base sm:text-lg text-earth-800/80 leading-relaxed font-normal">
//             Every custom commission, every direct WhatsApp conversation, and every fair-trade order on KalaSetu directly sustains generational artisan families and preserves ancestral craft knowledge.
//           </p>

//           <div className="pt-2 text-xs text-earth-800/60 flex items-center justify-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//             <span>Real-time calculation from {stats.totalOrdersCount} custom orders and {products.length} catalog masterpieces</span>
//           </div>

//         </div>
//       </section>

//       {/* 2. CORE 4 DYNAMIC IMPACT STAT CARDS */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
//           {/* Card 1: Total Completed Order Value */}
//           <div className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
//             <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shadow-xs">
//               <IndianRupee className="w-6 h-6" />
//             </div>
//             <div>
//               <span className="text-xs font-semibold text-earth-800/60 uppercase tracking-wider block">
//                 Total Order Value Preserved
//               </span>
//               <span className="font-serif font-extrabold text-3xl sm:text-4xl text-terracotta-600 block mt-1">
//                 ₹{Number(stats.totalCompletedOrderValue).toLocaleString('en-IN')}
//               </span>
//             </div>
//             <p className="text-xs text-earth-800/70 leading-relaxed border-t border-cream-100 pt-2.5">
//               100% transferred directly to master craftsmen across {stats.completedOrdersCount} completed bespoke commissions.
//             </p>
//           </div>

//           {/* Card 2: Unique Artisans Supported */}
//           <div className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
//             <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
//               <Users className="w-6 h-6" />
//             </div>
//             <div>
//               <span className="text-xs font-semibold text-earth-800/60 uppercase tracking-wider block">
//                 Unique Artisans Supported
//               </span>
//               <span className="font-serif font-extrabold text-3xl sm:text-4xl text-earth-900 block mt-1">
//                 {stats.uniqueArtisansSupported} Master Artisans
//               </span>
//             </div>
//             <p className="text-xs text-earth-800/70 leading-relaxed border-t border-cream-100 pt-2.5">
//               Across grassroots cooperatives and generational studios in Bihar, Odisha, Rajasthan, UP & Gujarat.
//             </p>
//           </div>

//           {/* Card 3: Total Craftsmanship Hours Preserved */}
//           <div className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
//             <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
//               <Clock className="w-6 h-6" />
//             </div>
//             <div>
//               <span className="text-xs font-semibold text-earth-800/60 uppercase tracking-wider block">
//                 Craftsmanship Hours Preserved
//               </span>
//               <span className="font-serif font-extrabold text-3xl sm:text-4xl text-emerald-700 block mt-1">
//                 {Number(stats.totalCraftsmanshipHours).toLocaleString('en-IN')} Hours
//               </span>
//             </div>
//             <p className="text-xs text-earth-800/70 leading-relaxed border-t border-cream-100 pt-2.5">
//               Calculated from delicate bamboo linework, quartz kiln firings, iron-stylus palm etching, and double-ikat handlooms.
//             </p>
//           </div>

//           {/* Card 4: Craft Traditions Represented */}
//           <div className="bg-white rounded-3xl p-6 sm:p-7 border border-cream-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all space-y-3">
//             <div className="w-12 h-12 rounded-2xl bg-earth-900 text-white flex items-center justify-center shadow-xs">
//               <Compass className="w-6 h-6 text-terracotta-400" />
//             </div>
//             <div>
//               <span className="text-xs font-semibold text-earth-800/60 uppercase tracking-wider block">
//                 Craft Traditions Represented
//               </span>
//               <span className="font-serif font-extrabold text-3xl sm:text-4xl text-earth-900 block mt-1">
//                 {stats.craftTraditionsCount} Living Artforms
//               </span>
//             </div>
//             <p className="text-xs text-earth-800/70 leading-relaxed border-t border-cream-100 pt-2.5">
//               Including UNESCO & GI-tagged art forms recognized across the Indian subcontinent.
//             </p>
//           </div>

//         </div>
//       </section>

//       {/* 3. REGIONAL CRAFTS BREAKDOWN & SUSTAINABILITY */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
//         <div className="border-b border-cream-200 pb-4">
//           <h2 className="font-display font-bold text-2xl sm:text-3xl text-earth-900">
//             Regional Heritage Breakdown
//           </h2>
//           <p className="text-xs text-earth-800/70 mt-1">
//             Dynamic distribution of handcrafted pieces and patron commissions by Indian state
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Object.entries(stats.stateBreakdown || {}).map(([state, data]) => (
//             <div 
//               key={state}
//               className="bg-white rounded-3xl p-6 border border-cream-200 shadow-xs space-y-4 hover:border-terracotta-300 transition-colors"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <MapPin className="w-4 h-4 text-terracotta-500" />
//                   <h3 className="font-display font-bold text-lg text-earth-900">{state}</h3>
//                 </div>
//                 <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cream-100 text-earth-800">
//                   {data.productsCount} listed crafts
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-3 text-xs bg-cream-50 p-3.5 rounded-2xl border border-cream-200/80">
//                 <div>
//                   <span className="text-[10px] text-earth-800/60 block">Bespoke Orders</span>
//                   <span className="font-bold text-sm text-earth-900">{data.ordersCount} completed</span>
//                 </div>
//                 <div>
//                   <span className="text-[10px] text-earth-800/60 block">Volume Generated</span>
//                   <span className="font-serif font-bold text-sm text-terracotta-600">
//                     ₹{Number(data.value).toLocaleString('en-IN')}
//                   </span>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <Link
//                   to={`/state/${state.toLowerCase().replace(/\s+/g, '_')}`}
//                   className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:underline"
//                 >
//                   <span>Explore {state} Traditions</span>
//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 4. RECENT COMPLETED BESPOKE COMMISSIONS */}
//       {stats.recentCompletedOrders.length > 0 && (
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
//           <div className="border-b border-cream-200 pb-4 flex items-center justify-between">
//             <div>
//               <h2 className="font-display font-bold text-2xl text-earth-900">
//                 Completed Patron Commissions
//               </h2>
//               <p className="text-xs text-earth-800/70 mt-0.5">
//                 Real-world examples of personalized pieces created by master artisans
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {stats.recentCompletedOrders.map((order) => (
//               <div 
//                 key={order.id}
//                 className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm flex flex-col justify-between space-y-4"
//               >
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-xs">
//                     <span className="font-bold text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
//                       {order.craft_tradition}
//                     </span>
//                     <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
//                       <CheckCircle2 className="w-3.5 h-3.5" />
//                       Completed & Delivered
//                     </span>
//                   </div>

//                   <h3 className="font-display font-bold text-lg text-earth-900">
//                     {order.title}
//                   </h3>

//                   <p className="text-xs text-earth-800/80 line-clamp-2 leading-relaxed">
//                     {order.description}
//                   </p>
//                 </div>

//                 <div className="pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
//                   <div>
//                     <span className="text-[10px] text-earth-800/60 block">Artisan</span>
//                     <span className="font-semibold text-earth-900">{order.artisan_name}</span>
//                   </div>
//                   <div>
//                     <span className="text-[10px] text-earth-800/60 block">Hours Preserved</span>
//                     <span className="font-bold text-emerald-700">{order.craftsmanship_hours || 35} hrs</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-[10px] text-earth-800/60 block">Order Value</span>
//                     <span className="font-serif font-bold text-base text-terracotta-600">
//                       ₹{Number(order.agreed_price || order.budget).toLocaleString('en-IN')}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* 5. INTERACTIVE ARTISAN LIVELIHOOD IMPACT CALCULATOR */}
//       <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-linear-to-br from-terracotta-50 to-cream-100 rounded-3xl p-8 md:p-10 border border-terracotta-200 shadow-md space-y-6">
//           <div className="text-center space-y-2">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-700 bg-white/80 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
//               Interactive Impact Calculator
//             </span>
//             <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-earth-900">
//               Calculate Your Direct Contribution
//             </h2>
//             <p className="text-xs text-earth-800/70 max-w-lg mx-auto">
//               See how many days of sustainable rural artisan livelihood your bespoke order preserves.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-cream-200">
//             <div className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-earth-800 block">
//                   Select Craft Tradition:
//                 </label>
//                 <select
//                   value={simulatedTradition}
//                   onChange={(e) => setSimulatedTradition(e.target.value)}
//                   className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-earth-900 font-medium"
//                 >
//                   <option value="Madhubani Painting">Madhubani Painting (Mithila Art)</option>
//                   <option value="Pattachitra & Palm Leaf">Pattachitra & Palm Leaf Inscription</option>
//                   <option value="Jaipur Blue Pottery">Jaipur Blue Pottery (Clay-free)</option>
//                   <option value="Lucknowi Chikankari">Lucknowi Chikankari Needlework</option>
//                   <option value="Patan Patola Silk">Patan Patola (Double Ikat Silk)</option>
//                 </select>
//               </div>

//               <div className="space-y-1.5">
//                 <div className="flex items-center justify-between text-xs">
//                   <label className="font-semibold text-earth-800">
//                     Artisan Craftsmanship Effort:
//                   </label>
//                   <span className="font-bold text-terracotta-600">{simulatedHours} Hours</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="10"
//                   max="120"
//                   step="5"
//                   value={simulatedHours}
//                   onChange={(e) => setSimulatedHours(Number(e.target.value))}
//                   className="w-full accent-terracotta-500 cursor-pointer"
//                 />
//                 <div className="flex justify-between text-[10px] text-earth-800/50">
//                   <span>10 hrs (Compact work)</span>
//                   <span>60 hrs</span>
//                   <span>120 hrs (Heirloom scroll)</span>
//                 </div>
//               </div>
//             </div>

//             {/* Calculated Results Box */}
//             <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200 flex flex-col justify-between space-y-3">
//               <div>
//                 <span className="text-[10px] font-bold uppercase tracking-wider text-earth-800/60 block">
//                   Preservation Outcome
//                 </span>
//                 <p className="font-serif font-bold text-2xl text-terracotta-600 mt-1">
//                   ~{(simulatedHours / 6).toFixed(1)} Full Livelihood Days
//                 </p>
//                 <p className="text-xs text-earth-800/70 mt-1">
//                   Guarantees dignified fair-trade sustenance for an artisan and their cooperative while keeping ancestral technique alive.
//                 </p>
//               </div>

//               <div className="pt-2 border-t border-cream-200 text-[11px] text-earth-800/80">
//                 ✅ Zero platform commission fees deducted.
//               </div>
//             </div>
//           </div>

//           <div className="text-center pt-2">
//             <Link
//               to="/marketplace"
//               className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs shadow-md transition-all hover:-translate-y-0.5"
//             >
//               <span>Commission an Artisan Today</span>
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }
