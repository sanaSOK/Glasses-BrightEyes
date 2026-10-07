<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
    <!-- Top Navigation Header -->
    <header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img :src="brandLogo" alt="BrightEyes Logo" class="w-10 h-10 rounded-full object-contain shadow-lg shadow-sky-500/25 bg-white p-0.5" />
            <span class="text-xl font-black tracking-tight text-white">
              Bright<span class="text-sky-400">Eyes</span>
            </span>
          </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#features" class="hover:text-sky-400 transition-colors">Platform Features</a>
          <a href="#categories" class="hover:text-sky-400 transition-colors">Optical Categories</a>
          <a href="#wholesalers" class="hover:text-sky-400 transition-colors">Verified Wholesalers</a>
          <a href="#how-it-works" class="hover:text-sky-400 transition-colors">How It Works</a>
        </nav>

        <!-- Auth Action Buttons -->
        <div class="flex items-center gap-3">
          <router-link
            to="/login"
            class="px-5 py-2.5 rounded-xl border border-sky-500/40 text-sky-300 hover:bg-sky-500/10 font-bold text-xs transition-all shadow-sm flex items-center gap-2"
          >
            <LogIn class="w-4 h-4" />
            <span>Sign In</span>
          </router-link>
          <router-link
            to="/register"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all active:scale-95"
          >
            Register Store
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section with ImageStreamHero Corridor -->
    <ImageStreamHero :images="heroImages" :cards="10" :speed="20" className="min-h-[720px] w-full pt-16 pb-24 px-6 border-b border-slate-800/80 bg-slate-950">
      <!-- Glow Gradients -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-600/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-extrabold uppercase tracking-wider mb-6 backdrop-blur-md">
          <Sparkles class="w-4 h-4 text-sky-400" />
          <span>Cambodia's Premier B2B Optical Wholesale Platform</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Empowering Optical Retailers with <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500">Real-Time Wholesale Supply</span>
        </h1>

        <p class="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow-md">
          Connect your optical retail store directly with leading Cambodian optical wholesalers. Browse live stock levels for frames, sunglasses, contact lenses, and prescription lenses with transparent pricing and fast delivery.
        </p>

        <!-- CTA Button Group -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
            to="/login"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-xl shadow-sky-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
          >
            <span>Sign In to Platform</span>
            <ArrowRight class="w-5 h-5" />
          </router-link>
          <router-link
            to="/register"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Building2 class="w-5 h-5 text-sky-400" />
            <span>Register New Business Account</span>
          </router-link>
        </div>

        <!-- Live Platform Metrics -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <p class="text-3xl font-black text-sky-400">30+</p>
            <p class="text-xs font-semibold text-slate-400 mt-1">Optical Product Lines</p>
          </div>
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <p class="text-3xl font-black text-cyan-400">100%</p>
            <p class="text-xs font-semibold text-slate-400 mt-1">Real-Time Live Stock</p>
          </div>
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <p class="text-3xl font-black text-purple-400">B2B</p>
            <p class="text-xs font-semibold text-slate-400 mt-1">Wholesale Pricing</p>
          </div>
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            <p class="text-3xl font-black text-emerald-400">24/7</p>
            <p class="text-xs font-semibold text-slate-400 mt-1">Order Placement</p>
          </div>
        </div>
      </div>
    </ImageStreamHero>

    <!-- 3D Interactive Workshop Section -->
    <section class="py-16 px-6 bg-black border-y border-slate-800 relative overflow-hidden">
      <div class="max-w-7xl mx-auto mb-8 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-3">
          <Sparkles class="w-4 h-4 text-amber-400" />
          <span>Interactive 3D Supply Chain Workshop</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-black text-white">Visualizing Optical B2B Fulfillment</h2>
        <p class="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
          Spin and inspect the 3D machine to explore the automated workflow: Order Placement → Scripting → Video Production → Storefront Posting → Checkout.
        </p>
      </div>

      <div class="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-sky-500/10 h-[650px] relative bg-black">
        <AgenticFactory3D height="650px" />
      </div>
    </section>

    <!-- Platform Features Section -->
    <section id="features" class="py-20 px-6 bg-slate-900/50 border-y border-slate-800/60">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-black text-white">Engineered for the Cambodian Optical Industry</h2>
          <p class="text-xs text-slate-400 mt-2">Comprehensive B2B digital workflow designed for wholesalers and retail stores</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Boxes class="w-7 h-7" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Real-Time "Live Stock"</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Never experience stockouts or overselling. See exact available stock levels before placing B2B orders with automatic quantity calculations.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck class="w-7 h-7" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Transactional Concurrency</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              PostgreSQL transactions guarantee atomic stock reservations. Order items automatically hold inventory while supplier processes fulfillment.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck class="w-7 h-7" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Cambodian Optical Logistics</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Track delivery status from PENDING to SHIPPED and DELIVERED with tracking numbers across Phnom Penh, Siem Reap, and all provinces.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Optical Categories Section with Elastic Accordion Gallery -->
    <section id="categories" class="py-20 px-6 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-sky-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles class="w-3.5 h-3.5" />
              <span>Interactive Wholesale Showcase</span>
            </div>
            <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">Optical Categories</h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Hover or tap any optical category to inspect high-definition product lines, wholesale specifications, and direct ordering links.
            </p>
          </div>
          <router-link to="/login" class="text-sky-400 font-extrabold text-xs sm:text-sm hover:text-sky-300 transition-colors mt-4 md:mt-0 flex items-center gap-1.5 bg-sky-950/60 border border-sky-500/30 px-4 py-2.5 rounded-xl backdrop-blur-md">
            <span>Sign In to Browse Full Catalog</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <!-- Elastic Gallery Integration -->
        <ElasticGallery />
      </div>
    </section>

    <!-- Verified Wholesalers Section -->
    <section id="wholesalers" class="py-20 px-6 bg-slate-900/40 border-t border-slate-800/60">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-3xl font-black text-white mb-3">Verified Cambodian Optical Wholesalers</h2>
        <p class="text-xs text-slate-400 max-w-xl mx-auto mb-12">
          Partnered with leading Cambodian suppliers delivering authentic optical frames, sunglasses, and precision ophthalmic lenses.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-start gap-4">
            <img src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=150&q=80" class="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h4 class="font-bold text-base text-white">Sokha Optical Supply Co., Ltd</h4>
              <p class="text-xs text-slate-400 mt-1">Phnom Penh, Chamkar Mon • Official Distributor for Ray-Ban, Oakley, Gucci, Prada</p>
              <span class="inline-block mt-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold">
                Verified Supplier
              </span>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-start gap-4">
            <img src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=150&q=80" class="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h4 class="font-bold text-base text-white">Angkor Vision & Lens Wholesale</h4>
              <p class="text-xs text-slate-400 mt-1">Phnom Penh, Toul Kork • Essilor, Hoya, Carl Zeiss, Acuvue Contact Lenses</p>
              <span class="inline-block mt-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold">
                Verified Supplier
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-6 relative">
      <div class="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-sky-600 to-cyan-600 p-8 sm:p-12 text-center text-white shadow-2xl shadow-sky-600/30">
        <h2 class="text-3xl font-black">Ready to Wholesale Optical Supplies?</h2>
        <p class="text-sm text-sky-100 mt-2 max-w-xl mx-auto">
          Sign in to your account or register a new store to access live stock inventory and place orders.
        </p>

        <div class="mt-8 flex justify-center gap-4">
          <router-link
            to="/login"
            class="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-lg transition-all"
          >
            Sign In Now
          </router-link>
          <router-link
            to="/register"
            class="px-8 py-3.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50 font-extrabold text-sm shadow-lg transition-all"
          >
            Register Retail Store
          </router-link>
        </div>
      </div>
    </section>

    <!-- Animated Footer -->
    <footer class="new_footer_area bg_color">
      <div class="new_footer_top">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Logo & About & Social Media -->
            <div class="f_widget company_widget">
              <div class="flex items-center gap-3 mb-4">
                <img :src="brandLogo" alt="BrightEyes Logo" class="w-10 h-10 rounded-full object-contain shadow-lg bg-white p-0.5" />
                <span class="text-xl font-black tracking-tight text-white">
                  Bright<span class="text-sky-400">Eyes</span>
                </span>
              </div>
              <p class="pe-4 text-slate-300 text-sm leading-relaxed">
                Welcome to <strong>BrightEyes</strong>, Cambodia's premier B2B optical wholesale platform. Connecting optical retail stores directly with verified suppliers for live stock inventory, transparent pricing, and fast delivery.
              </p>
              <div class="feature-media mt-4">
                <h4 class="social-title text-white font-bold text-sm mb-2">Follow Us:</h4>
                <ul class="d-flex gap-3 list-unstyled py-2 social-list">
                  <li>
                    <a href="#" class="social-icon facebook" aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="social-icon twitter" aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="social-icon telegram" aria-label="Telegram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="social-icon github" aria-label="GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="f_widget about-widget">
              <h3 class="f-title f_600 f_size_18">Quick Links</h3>
              <ul class="list-unstyled f_400 f_list">
                <li><a href="/">Home</a></li>
                <li><a href="#features">Platform Features</a></li>
                <li><a href="#categories">Product Categories</a></li>
                <li><a href="#wholesalers">Verified Wholesalers</a></li>
                <li><a href="/login">Platform Sign In</a></li>
                <li><a href="/register">Register Store</a></li>
              </ul>
            </div>

            <!-- Optical Solutions -->
            <div class="f_widget about-widget">
              <h3 class="f-title f_600 f_size_18">Optical Solutions</h3>
              <ul class="list-unstyled f_400 f_list">
                <li><a href="#categories">Eyeglass Frames</a></li>
                <li><a href="#categories">Sunglasses UV400</a></li>
                <li><a href="#categories">Contact Lenses</a></li>
                <li><a href="#categories">Optical Ophthalmic Lenses</a></li>
                <li><a href="#categories">Optometric Equipment</a></li>
                <li><a href="#wholesalers">Wholesaler Network</a></li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div class="f_widget about-widget">
              <h3 class="f-title f_600 f_size_18">Contact Us</h3>
              <ul class="list-unstyled f_400 f_list contact-list">
                <li>
                  <a href="tel:0883008461"><Phone class="w-4 h-4 inline-block mr-1 text-sky-400" /> +855 88 300 8461</a>
                </li>
                <li class="email-item">
                  <a href="mailto:support@brighteyes.com"><Mail class="w-4 h-4 inline-block mr-1 text-sky-400" /> support@brighteyes.com</a>
                </li>
                <li>
                  <a href="#"><MapPin class="w-4 h-4 inline-block mr-1 text-sky-400" /> 123 Innovation Street, Phnom Penh, Cambodia</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Animation Background (City, Car, Cyclist) -->
        <div class="footer_bg">
          <div class="footer_bg_one"></div>
          <div class="footer_bg_two"></div>
        </div>
      </div>

      <div class="footer_bottom mt-5">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center">
            <p class="f_400 mb-0">© Copyright 2026 BrightEyes B2B Optical Supply. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Glasses, Sparkles, ArrowRight, Building2, Boxes, ShieldCheck, Truck, LogIn, Eye, Sun, Disc, Layers, Wrench, Phone, Mail, MapPin } from 'lucide-vue-next';
import AgenticFactory3D from '@/components/ui/AgenticFactory3D.vue';
import ImageStreamHero from '@/components/ui/ImageStreamHero.vue';
import ElasticGallery from '@/components/ui/ElasticGallery.vue';
import brandLogo from '@/assets/logo.png';

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', alt: 'Sunglasses' },
  { src: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80', alt: 'Optical frames' },
  { src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80', alt: 'Tinted sunglasses' },
  { src: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80', alt: 'Eyeglasses showcase' },
  { src: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80', alt: 'Designer glasses' },
  { src: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80', alt: 'Aviator glasses' },
  { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', alt: 'Clear frames' },
  { src: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80', alt: 'Fashion glasses' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', alt: 'Eyewear model' },
];

const previewCategories = [
  { name: 'Eyeglass Frames', desc: 'Prescription Frames', icon: Glasses },
  { name: 'Sunglasses', desc: 'UV400 & Polarized', icon: Sun },
  { name: 'Contact Lenses', desc: 'Daily & Monthly Soft Lenses', icon: Eye },
  { name: 'Optical Lenses', desc: 'Single Vision & Progressive', icon: Disc },
  { name: 'Optometric Equipment', desc: 'Refractometers & Lensmeters', icon: Wrench },
];
</script>

<style scoped>
/* --- Main Footer Area --- */
.new_footer_area {
  margin-top: 35px;
  background: #0a244a;
}

.new_footer_top {
  padding: 60px 0px 225px;
  position: relative;
  overflow-x: hidden;
}

/* --- Logo & Paragraph --- */
.image-footer {
  margin-left: 2px;
  margin-top: 20px;
  margin-bottom: 20px;
  object-fit: cover;
}

.new_footer_top .company_widget p {
  margin-top: -5px;
  font-size: 17px;
  font-weight: 400;
  color: #cfd8e3;
  line-height: 1.8;
  margin-bottom: 15px;
}

/* --- Social Media Styles (Using SVG Icons) --- */
.social-title {
  color: white !important;
  font-size: 20px;
  margin-bottom: 5px;
}

.social-list {
  padding-left: 0;
  display: flex;
  gap: 0.75rem;
  list-style: none;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 14px rgba(0,0,0,0.3);
  color: white;
}

.social-icon.facebook:hover { background: #3b5998; border-color: #3b5998; }
.social-icon.twitter:hover  { background: #14171A; border-color: #14171A; }
.social-icon.telegram:hover { background: #0088cc; border-color: #0088cc; }
.social-icon.github:hover   { background: #333;    border-color: #333;    }

/* --- Footer Titles --- */
.new_footer_top .f-title {
  margin-top: 25px;
  margin-bottom: 28px;
  color: white;
  font-size: 22px;
  position: relative;
  padding-bottom: 10px;
}

.new_footer_top .f-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: #4e9af5;
  border-radius: 5px;
}

/* --- Links --- */
.new_footer_top .f_widget.about-widget .f_list {
  list-style: none;
  padding-left: 0;
}

.new_footer_top .f_widget.about-widget .f_list li {
  margin-bottom: 12px;
}

.new_footer_top .f_widget.about-widget .f_list li a {
  color: #cfd8e3;
  font-size: 17px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.new_footer_top .f_widget.about-widget .f_list li a:hover {
  color: #4e9af5;
  padding-left: 5px;
}

.contact-list li a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-list li a i {
  color: #4e9af5;
  margin-right: 5px;
}

.email-item a:hover {
  color: #4e9af5 !important;
  text-decoration: underline;
}

/* --- Footer Bottom --- */
.footer_bottom {
  font-weight: 300;
  line-height: 20px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 20px;
  padding-bottom: 20px;
}

.footer_bottom p {
  color: white;
}

/* --- Original Animations (City, Car, Cyclist) --- */
.new_footer_top .footer_bg {
  position: absolute;
  bottom: 0;
  background: url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigB8iI5tb8WSVBuVUGc9UjjB8O0708X7Fdic_4O1LT4CmLHoiwhanLXiRhe82yw0R7LgACQ2IhZaTY0hhmGi0gYp_Ynb49CVzfmXtYHUVKgXXpWvJ_oYT8cB4vzsnJLe3iCwuzj-w6PeYq_JaHmy_CoGoa6nw0FBo-2xLdOPvsLTh_fmYH2xhkaZ-OGQ/s16000/footer_bg.png") no-repeat scroll center 0;
  width: 100%;
  height: 266px;
}

.new_footer_top .footer_bg .footer_bg_one {
  background: url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia0PYPxwT5ifToyP3SNZeQWfJEWrUENYA5IXM6sN5vLwAKvaJS1pQVu8mOFFUa_ET4JuHNTFAxKURFerJYHDUWXLXl1vDofYXuij45JZelYOjEFoCOn7E6Vxu0fwV7ACPzArcno1rYuVxGB7JY6G7__e4_KZW4lTYIaHSLVaVLzklZBLZnQw047oq5-Q/s16000/volks.gif") no-repeat center center;
  width: 330px;
  height: 105px;
  background-size: 100%;
  position: absolute;
  bottom: 0;
  left: 30%;
  -webkit-animation: myfirst 19s linear infinite;
  animation: myfirst 19s linear infinite;
}

.new_footer_top .footer_bg .footer_bg_two {
  background: url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyLGwEUVwPK6Vi8xXMymsc-ZXVwLWyXhogZxbcXQYSY55REw_0D4VTQnsVzCrL7nsyjd0P7RVOI5NKJbQ75koZIalD8mqbMquP20fL3DxsWngKkOLOzoOf9sMuxlbyfkIBTsDw5WFUj-YJiI50yzgVjF8cZPHhEjkOP_PRTQXDHEq8AyWpBiJdN9SfQA/s16000/cyclist.gif") no-repeat center center;
  width: 88px;
  height: 100px;
  background-size: 100%;
  bottom: 0;
  left: 38%;
  position: absolute;
  -webkit-animation: myfirst 25s linear infinite;
  animation: myfirst 25s linear infinite;
}

@keyframes myfirst {
  0%   { left: -25%; }
  100% { left: 100%; }
}
</style>
