<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
    <!-- Wizard Header & Progress Stepper -->
    <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            Module A • Optical Rx Lab
          </span>
          <h2 class="text-xl font-extrabold mt-1 tracking-tight">Rx Lab Order Wizard</h2>
          <p class="text-xs text-indigo-200/80 mt-0.5">Custom patient prescription, optical angles & frame measurement workflow</p>
        </div>

        <!-- Stepper Buttons & Cancel -->
        <div class="flex items-center space-x-2">
          <button
            type="button"
            @click="emit('cancelled')"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition flex items-center space-x-1 cursor-pointer"
            title="Return to Order Tracking"
          >
            <span>&larr; Back</span>
          </button>
          <div class="h-4 w-px bg-white/20 hidden sm:block"></div>
          <button
            v-for="s in [1, 2, 3]"
            :key="s"
            type="button"
            @click="goToStep(s)"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer',
              currentStep === s
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : currentStep > s
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
                : 'bg-white/10 text-slate-400 hover:text-white'
            ]"
          >
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" :class="currentStep === s ? 'bg-white text-indigo-700' : 'bg-white/20'">
              {{ s }}
            </span>
            <span class="hidden sm:inline">
              {{ s === 1 ? 'Customer Info' : s === 2 ? 'Frame & Fitting' : 'Lens & Prescription' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Wizard Form Steps Body -->
    <form @submit.prevent="handleSubmit" class="p-6 md:p-8 space-y-6">
      <!-- ================================================================= -->
      <!-- STEP 1: Customer & Order Information -->
      <!-- ================================================================= -->
      <div v-show="currentStep === 1" class="space-y-6 animate-fadeIn">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck class="w-4 h-4 text-indigo-600" />
              Step 1: Customer, Shop & Logistics Details
            </h3>
            <p class="text-xs text-slate-500">Provide buyer account, patient identification, and lab routing codes.</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 font-mono">1 of 3</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <!-- Buyer / Optical Store -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Buyer (Optical Store) *</label>
            <input
              v-model="form.buyer"
              type="text"
              required
              placeholder="e.g. Phnom Penh Eyewear Center"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition"
            />
          </div>

          <!-- Shop Branch -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Shop / Branch *</label>
            <input
              v-model="form.shop"
              type="text"
              required
              placeholder="e.g. Sen Sok Branch"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition"
            />
          </div>

          <!-- Ordering Person -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Ordering Person (Doctor / Optician) *</label>
            <input
              v-model="form.orderingPerson"
              type="text"
              required
              placeholder="e.g. Dr. Chea Vandy"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition"
            />
          </div>

          <!-- Order Ref -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Order Ref / Customer PO</label>
            <input
              v-model="form.orderRef"
              type="text"
              placeholder="e.g. REF-B2B-998"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition font-mono"
            />
          </div>

          <!-- Patient Name -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
            <input
              v-model="form.patientName"
              type="text"
              required
              placeholder="e.g. Kosal Vireak"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition"
            />
          </div>

          <!-- Patient Code -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Patient Medical Code</label>
            <input
              v-model="form.patientCode"
              type="text"
              placeholder="e.g. PAT-KH-9920"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition font-mono"
            />
          </div>

          <!-- Tray ID -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Lab Tray ID *</label>
            <input
              v-model="form.trayId"
              type="text"
              required
              placeholder="e.g. TRAY-A14"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition font-mono"
            />
          </div>

          <!-- Account Code -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Account Code (ACC)</label>
            <input
              v-model="form.accountCode"
              type="text"
              placeholder="e.g. ACC-8821"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition font-mono"
            />
          </div>

          <!-- Order Type Selector -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Order Type *</label>
            <select
              v-model="form.orderType"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition"
            >
              <option value="RX Lab Order">RX Lab Order (Lens Only)</option>
              <option value="Remote Edging">Remote Edging (Lens + Edged to Frame)</option>
            </select>
          </div>

          <!-- Logistics Date -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Target Logistics Date</label>
            <input
              v-model="form.logisticsDate"
              type="date"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-slate-800 font-medium transition"
            />
          </div>

          <!-- Urgent Flag Toggle -->
          <div class="sm:col-span-2 flex items-center p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80">
            <input
              id="urgent-check"
              v-model="form.isUrgent"
              type="checkbox"
              class="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 mr-3 cursor-pointer"
            />
            <label for="urgent-check" class="cursor-pointer">
              <span class="font-bold text-rose-900 block text-xs">Flag as Priority Rush Job (Urgent)</span>
              <span class="text-[11px] text-rose-700">Priority lab surfacing tray queue with expedited delivery routing.</span>
            </label>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- STEP 2: Frame Dimensions & Fitting Measurements -->
      <!-- ================================================================= -->
      <div v-show="currentStep === 2" class="space-y-6 animate-fadeIn">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Glasses class="w-4 h-4 text-indigo-600" />
              Step 2: Frame Measurements, Tilt & Vertex Distances
            </h3>
            <p class="text-xs text-slate-500">Box measurement parameters (A, B, ED, DBL) and custom optical angles.</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 font-mono">2 of 3</span>
        </div>

        <!-- Frame Type & Shape Selectors -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Frame Type *</label>
            <select
              v-model="form.frame.frameType"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 font-medium"
            >
              <option value="Metal Fullrim">Metal Fullrim</option>
              <option value="Plastic Fullrim">Plastic Fullrim</option>
              <option value="Rimless">Rimless (Three Piece)</option>
              <option value="Halfrim">Halfrim (Nylon String)</option>
              <option value="Optyl">Optyl / Acetate</option>
              <option value="Titanium">Titanium Ultra-Light</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Frame Shape</label>
            <select
              v-model="form.frame.frameShape"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 font-medium"
            >
              <option value="Rectangular">Rectangular</option>
              <option value="Round">Round / Oval</option>
              <option value="Aviator">Aviator / Pilot</option>
              <option value="Cat Eye">Cat Eye</option>
              <option value="Geometric">Geometric / Polygonal</option>
              <option value="Square">Square</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Tracer Flag / Trace File</label>
            <input
              v-model="form.frame.tracerFlag"
              type="text"
              placeholder="e.g. Manual Tracer #881"
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 font-medium font-mono"
            />
          </div>
        </div>

        <!-- Box Measurements A, B, ED, DBL -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Box Dimensions (Millimeters)</span>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <label class="block font-sans font-bold text-slate-700 mb-1">A (Width) mm *</label>
              <input
                v-model.number="form.frame.frameWidthA"
                type="number"
                step="0.5"
                placeholder="54.0"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>
            <div>
              <label class="block font-sans font-bold text-slate-700 mb-1">B (Height) mm *</label>
              <input
                v-model.number="form.frame.frameHeightB"
                type="number"
                step="0.5"
                placeholder="38.0"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>
            <div>
              <label class="block font-sans font-bold text-slate-700 mb-1">ED (Effective Dia) mm</label>
              <input
                v-model.number="form.frame.effectiveDiaEd"
                type="number"
                step="0.5"
                placeholder="58.5"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>
            <div>
              <label class="block font-sans font-bold text-slate-700 mb-1">DBL (Bridge) mm *</label>
              <input
                v-model.number="form.frame.noseBridgeDbl"
                type="number"
                step="0.5"
                placeholder="18.0"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        <!-- Angles & Vertex Distances -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div>
            <label class="block font-sans font-semibold text-slate-700 mb-1">Pantoscopic Tilt (°)</label>
            <input
              v-model.number="form.frame.pantoscopicTilt"
              type="number"
              step="0.5"
              placeholder="8.5"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block font-sans font-semibold text-slate-700 mb-1">Face Form / Wrap (°)</label>
            <input
              v-model.number="form.frame.faceFormAngle"
              type="number"
              step="0.5"
              placeholder="5.0"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block font-sans font-semibold text-slate-700 mb-1">Refracted BVD (mm)</label>
            <input
              v-model.number="form.frame.refractedBvd"
              type="number"
              step="0.5"
              placeholder="12.0"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block font-sans font-semibold text-slate-700 mb-1">Fitted BVD (mm)</label>
            <input
              v-model.number="form.frame.fittedBvd"
              type="number"
              step="0.5"
              placeholder="12.0"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label class="block font-sans font-semibold text-slate-700 mb-1">Base Curve (D)</label>
            <input
              v-model.number="form.frame.baseCurve"
              type="number"
              step="0.25"
              placeholder="4.50"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <!-- Pupil Distances & Fitting Heights (Right OD vs Left OS) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <!-- Right Eye -->
          <div class="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
            <span class="font-sans font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
              <span>🔵 Right Eye (OD) Measurements</span>
            </span>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block font-sans text-slate-600 mb-1">PD Far (mm)</label>
                <input v-model.number="form.frame.pdFarR" type="number" step="0.5" placeholder="32.0" class="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold" />
              </div>
              <div>
                <label class="block font-sans text-slate-600 mb-1">PD Near (mm)</label>
                <input v-model.number="form.frame.pdNearR" type="number" step="0.5" placeholder="30.0" class="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold" />
              </div>
              <div>
                <label class="block font-sans text-slate-600 mb-1">Height (mm)</label>
                <input v-model.number="form.frame.heightR" type="number" step="0.5" placeholder="21.0" class="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold" />
              </div>
            </div>
          </div>

          <!-- Left Eye -->
          <div class="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
            <span class="font-sans font-bold text-sky-950 flex items-center gap-1.5 text-xs">
              <span>🟢 Left Eye (OS) Measurements</span>
            </span>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block font-sans text-slate-600 mb-1">PD Far (mm)</label>
                <input v-model.number="form.frame.pdFarL" type="number" step="0.5" placeholder="31.5" class="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold" />
              </div>
              <div>
                <label class="block font-sans text-slate-600 mb-1">PD Near (mm)</label>
                <input v-model.number="form.frame.pdNearL" type="number" step="0.5" placeholder="29.5" class="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold" />
              </div>
              <div>
                <label class="block font-sans text-slate-600 mb-1">Height (mm)</label>
                <input v-model.number="form.frame.heightL" type="number" step="0.5" placeholder="21.0" class="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- STEP 3: Lens Product Info & Dual Eye Prescription Grid -->
      <!-- ================================================================= -->
      <div v-show="currentStep === 3" class="space-y-6 animate-fadeIn">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Eye class="w-4 h-4 text-indigo-600" />
              Step 3: Lens Specifications & Dual-Eye Prescription (OD / OS)
            </h3>
            <p class="text-xs text-slate-500">Lens materials, coatings, tinting parameters, and SPH/CYL/AXIS/ADD matrix.</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 font-mono">3 of 3</span>
        </div>

        <!-- Product Specs Selectors -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Lens Product Family</label>
            <input
              v-model="form.lensSpecs.productName"
              type="text"
              required
              placeholder="e.g. Essilor Eyezen Boost"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Lens Type</label>
            <select v-model="form.lensSpecs.lensType" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium">
              <option value="Single Vision RX">Single Vision RX</option>
              <option value="Bifocal">Bifocal (FT-28)</option>
              <option value="Progressive">Progressive Freeform</option>
              <option value="SV RX Golf">SV RX Golf / Sportive</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Design Type</label>
            <select v-model="form.lensSpecs.designType" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium">
              <option value="Aspherical">Aspherical</option>
              <option value="Spherical">Spherical</option>
              <option value="Double Aspheric">Double Aspheric (Bi-AS)</option>
              <option value="Free form">Free form Digital HD</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Refractive Index</label>
            <select v-model.number="form.lensSpecs.refractiveIndex" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium font-mono">
              <option :value="1.50">1.50 Standard</option>
              <option :value="1.56">1.56 Mid-Index</option>
              <option :value="1.60">1.60 High-Index (MR-8)</option>
              <option :value="1.67">1.67 Super Thin (MR-7)</option>
              <option :value="1.74">1.74 Ultra Thin</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Material</label>
            <select v-model="form.lensSpecs.material" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium">
              <option value="High Index MR-8">High Index MR-8 Resin</option>
              <option value="CR-39 Plastic">CR-39 Plastic</option>
              <option value="Polycarbonate">Polycarbonate (Impact Resistant)</option>
              <option value="Trivex">Trivex HD</option>
              <option value="Mineral Glass">Mineral Glass</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Coating</label>
            <select v-model="form.lensSpecs.coating" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium">
              <option value="Super HMC">Super HMC (Hydrophobic)</option>
              <option value="HMC">HMC (Hard Multi-Coated)</option>
              <option value="Anti-Fog HMC">Anti-Fog HMC</option>
              <option value="Blue Blocker SHMC">Blue Blocker SHMC</option>
              <option value="HC">HC (Hard Coat Only)</option>
              <option value="UC">UC (Uncoated)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Tinting Type</label>
            <select v-model="form.lensSpecs.tintingType" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium">
              <option value="None">None (Clear Lens)</option>
              <option value="Solid Tint">Solid Tint</option>
              <option value="Gradient">Gradient Tint</option>
              <option value="Polarized">Polarized</option>
              <option value="Photochromic">Photochromic (Transitions)</option>
            </select>
          </div>

          <div v-if="form.lensSpecs.tintingType !== 'None'">
            <label class="block font-bold text-slate-700 mb-1">Tint Color & Gradient</label>
            <input
              v-model="form.lensSpecs.tintColor"
              type="text"
              placeholder="e.g. Amber Brown (80% to 20%)"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
            />
          </div>
        </div>

        <!-- Detailed Dual-Eye Prescription Table (OD & OS) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between border-b border-slate-200 pb-1">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Prescription Matrix (OD: Right / OS: Left)</span>
            </h4>
            <span class="text-[11px] text-slate-500 font-mono">Sphere (SPH) & Cylinder (CYL) in 0.25 steps</span>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
            <table class="w-full text-center border-collapse text-xs">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th class="py-2.5 px-3 text-left w-24">Eye Side</th>
                  <th class="py-2.5 px-2">SPH *</th>
                  <th class="py-2.5 px-2">CYL</th>
                  <th class="py-2.5 px-2">AXIS (°)</th>
                  <th class="py-2.5 px-2">ADD</th>
                  <th class="py-2.5 px-2">DIA (mm)</th>
                  <th class="py-2.5 px-2">H.Prism (Δ)</th>
                  <th class="py-2.5 px-2">H.Base</th>
                  <th class="py-2.5 px-2">V.Prism (Δ)</th>
                  <th class="py-2.5 px-2">V.Base</th>
                  <th class="py-2.5 px-2">Price ($)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <!-- OD Right Eye -->
                <tr class="bg-indigo-50/20">
                  <td class="py-3 px-3 text-left font-sans font-bold text-indigo-700">OD (Right)</td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.sphere" type="number" step="0.25" placeholder="-3.75" class="w-18 p-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.cylinder" type="number" step="0.25" placeholder="-1.25" class="w-18 p-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.axis" type="number" min="0" max="180" placeholder="85" class="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.addition" type="number" step="0.25" placeholder="+2.00" class="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-center text-emerald-700 font-bold" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.diameter" type="number" placeholder="70" class="w-14 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.hPrism" type="number" step="0.25" placeholder="0.5" class="w-14 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <select v-model="form.rx.od.hBase" class="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-sans">
                      <option value="">-</option>
                      <option value="In">In</option>
                      <option value="Out">Out</option>
                    </select>
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.od.vPrism" type="number" step="0.25" placeholder="0.0" class="w-14 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <select v-model="form.rx.od.vBase" class="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-sans">
                      <option value="">-</option>
                      <option value="Up">Up</option>
                      <option value="Down">Down</option>
                    </select>
                  </td>
                  <td class="py-2 px-2 text-right">
                    <input v-model.number="form.rx.od.unitPrice" type="number" step="0.5" class="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-right font-bold" />
                  </td>
                </tr>

                <!-- OS Left Eye -->
                <tr class="bg-sky-50/20">
                  <td class="py-3 px-3 text-left font-sans font-bold text-sky-700">OS (Left)</td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.sphere" type="number" step="0.25" placeholder="-4.25" class="w-18 p-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.cylinder" type="number" step="0.25" placeholder="-1.50" class="w-18 p-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.axis" type="number" min="0" max="180" placeholder="95" class="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.addition" type="number" step="0.25" placeholder="+2.00" class="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-center text-emerald-700 font-bold" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.diameter" type="number" placeholder="70" class="w-14 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.hPrism" type="number" step="0.25" placeholder="0.5" class="w-14 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <select v-model="form.rx.os.hBase" class="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-sans">
                      <option value="">-</option>
                      <option value="In">In</option>
                      <option value="Out">Out</option>
                    </select>
                  </td>
                  <td class="py-2 px-1">
                    <input v-model.number="form.rx.os.vPrism" type="number" step="0.25" placeholder="0.0" class="w-14 p-1.5 bg-white border border-slate-200 rounded-lg text-center" />
                  </td>
                  <td class="py-2 px-1">
                    <select v-model="form.rx.os.vBase" class="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-sans">
                      <option value="">-</option>
                      <option value="Up">Up</option>
                      <option value="Down">Down</option>
                    </select>
                  </td>
                  <td class="py-2 px-2 text-right">
                    <input v-model.number="form.rx.os.unitPrice" type="number" step="0.5" class="w-16 p-1.5 bg-white border border-slate-200 rounded-lg text-right font-bold" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Special Lab Instructions -->
        <div>
          <label class="block font-bold text-slate-700 mb-1">Special Lab Instructions / Notes</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="e.g. Polish bevel, thin edge requested, warning on knife edge for rimless mounting."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
          ></textarea>
        </div>

        <!-- Price Summary Bar -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div class="text-xs">
            <span class="text-slate-500 block">Total Calculated Order Value:</span>
            <span class="text-xs font-bold text-slate-700">2 Prescription Lenses (Pair OD + OS)</span>
          </div>
          <span class="text-xl font-black text-emerald-600 font-mono">
            ${{ ((form.rx.od.unitPrice || 0) + (form.rx.os.unitPrice || 0)).toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Wizard Navigation Bottom Controls -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          v-if="currentStep > 1"
          type="button"
          @click="currentStep--"
          class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Previous Step</span>
        </button>
        <div v-else></div>

        <div class="flex items-center space-x-3">
          <button
            v-if="currentStep < 3"
            type="button"
            @click="validateAndNext"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <span>Next Step</span>
            <ArrowRight class="w-4 h-4" />
          </button>
          <button
            v-else
            type="submit"
            :disabled="submitting"
            class="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-black rounded-xl shadow-md transition flex items-center space-x-2"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>{{ submitting ? 'Submitting to Lab...' : 'Submit Custom Rx Lab Order' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  UserCheck,
  Glasses,
  Eye,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-vue-next';
import { lensService, type UnifiedLensOrder } from '@/services/lens.service';

const emit = defineEmits<{
  (e: 'submitted', order: UnifiedLensOrder): void;
  (e: 'cancelled'): void;
}>();

const currentStep = ref(1);
const submitting = ref(false);

const form = reactive({
  buyer: 'Phnom Penh Eyewear Center',
  shop: 'Sen Sok Branch',
  orderingPerson: 'Dr. Chea Vandy',
  orderRef: `REF-${Math.floor(100 + Math.random() * 900)}`,
  patientName: '',
  patientCode: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
  trayId: `TRAY-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(10 + Math.random() * 89)}`,
  accountCode: 'ACC-8821',
  orderType: 'RX Lab Order',
  isUrgent: false,
  logisticsDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  notes: '',

  // Frame Details
  frame: {
    frameType: 'Metal Fullrim',
    frameShape: 'Rectangular',
    tracerFlag: 'Tracer Scan #091',
    frameWidthA: 54.0,
    frameHeightB: 38.0,
    effectiveDiaEd: 58.5,
    noseBridgeDbl: 18.0,
    pantoscopicTilt: 8.5,
    faceFormAngle: 5.0,
    refractedBvd: 12.0,
    fittedBvd: 12.0,
    baseCurve: 4.5,
    pdFarR: 32.0,
    pdFarL: 31.5,
    pdNearR: 30.0,
    pdNearL: 29.5,
    heightR: 21.0,
    heightL: 21.0,
  },

  // Lens Specs
  lensSpecs: {
    productName: 'Essilor Eyezen Boost 1.60 SHMC',
    lensType: 'Single Vision RX',
    designType: 'Aspherical',
    refractiveIndex: 1.6,
    material: 'High Index MR-8',
    coating: 'Super HMC',
    treatments: 'Super HMC, Anti-Blue Light, UV420',
    tintingType: 'None',
    tintColor: '',
  },

  // Rx Grid (OD Right & OS Left)
  rx: {
    od: {
      sphere: -3.75,
      cylinder: -1.25,
      axis: 85,
      addition: null as number | null,
      diameter: 70,
      hPrism: 0.5,
      hBase: 'Out',
      vPrism: null as number | null,
      vBase: '',
      unitPrice: 72.5,
    },
    os: {
      sphere: -4.25,
      cylinder: -1.5,
      axis: 95,
      addition: null as number | null,
      diameter: 70,
      hPrism: 0.5,
      hBase: 'Out',
      vPrism: null as number | null,
      vBase: '',
      unitPrice: 72.5,
    },
  },
});

function goToStep(s: number) {
  if (s <= currentStep.value || validateStep(currentStep.value)) {
    currentStep.value = s;
  }
}

function validateStep(step: number): boolean {
  if (step === 1) {
    if (!form.buyer || !form.patientName || !form.trayId) {
      alert('Please fill in required fields: Buyer, Patient Name, and Tray ID.');
      return false;
    }
  }
  return true;
}

function validateAndNext() {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
  }
}

async function handleSubmit() {
  submitting.value = true;
  try {
    const totalAmount = (form.rx.od.unitPrice || 0) + (form.rx.os.unitPrice || 0);

    const payload: Partial<UnifiedLensOrder> = {
      orderNo: `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderRef: form.orderRef,
      orderType: form.orderType,
      buyer: form.buyer,
      shop: form.shop,
      orderingPerson: form.orderingPerson,
      patientName: form.patientName,
      patientCode: form.patientCode,
      trayId: form.trayId,
      orderStatus: 'Producing Surfacing',
      orderDate: new Date().toISOString(),
      logisticsDate: form.logisticsDate ? new Date(form.logisticsDate).toISOString() : null,
      isUrgent: form.isUrgent,
      accountCode: form.accountCode,
      notes: form.notes,
      totalAmount,
      totalPieces: 2,
      frame: { ...form.frame },
      lensItems: [
        {
          productName: form.lensSpecs.productName,
          lensType: form.lensSpecs.lensType,
          designType: form.lensSpecs.designType,
          refractiveIndex: form.lensSpecs.refractiveIndex,
          material: form.lensSpecs.material,
          coating: form.lensSpecs.coating,
          treatments: form.lensSpecs.treatments,
          tintingType: form.lensSpecs.tintingType,
          tintColor: form.lensSpecs.tintColor || null,
          quantity: 1,
          eyeSide: 'Right',
          sphere: form.rx.od.sphere,
          cylinder: form.rx.od.cylinder,
          axis: form.rx.od.axis,
          addition: form.rx.od.addition,
          diameter: form.rx.od.diameter,
          hPrism: form.rx.od.hPrism,
          hBase: form.rx.od.hBase || null,
          vPrism: form.rx.od.vPrism,
          vBase: form.rx.od.vBase || null,
          unitPrice: form.rx.od.unitPrice,
          subtotal: form.rx.od.unitPrice,
        },
        {
          productName: form.lensSpecs.productName,
          lensType: form.lensSpecs.lensType,
          designType: form.lensSpecs.designType,
          refractiveIndex: form.lensSpecs.refractiveIndex,
          material: form.lensSpecs.material,
          coating: form.lensSpecs.coating,
          treatments: form.lensSpecs.treatments,
          tintingType: form.lensSpecs.tintingType,
          tintColor: form.lensSpecs.tintColor || null,
          quantity: 1,
          eyeSide: 'Left',
          sphere: form.rx.os.sphere,
          cylinder: form.rx.os.cylinder,
          axis: form.rx.os.axis,
          addition: form.rx.os.addition,
          diameter: form.rx.os.diameter,
          hPrism: form.rx.os.hPrism,
          hBase: form.rx.os.hBase || null,
          vPrism: form.rx.os.vPrism,
          vBase: form.rx.os.vBase || null,
          unitPrice: form.rx.os.unitPrice,
          subtotal: form.rx.os.unitPrice,
        },
      ],
    };

    const result = await lensService.createUnifiedOrder(payload);
    emit('submitted', result);
  } catch (err: any) {
    alert(err?.message || 'Failed to submit Rx Lab order');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
