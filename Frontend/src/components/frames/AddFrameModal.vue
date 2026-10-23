<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
    <div
      class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30">
            <Glasses class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Add Frame
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border"
                    :class="form.entryType === 'GROUP' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-sky-50 text-sky-700 border-sky-200'">
                {{ form.entryType === 'GROUP' ? 'Group Frames Mode' : 'Single Frame Mode' }}
              </span>
            </h2>
            <p class="text-xs text-slate-500">Configure optical specifications, boxing system, accessories & color codes</p>
          </div>
        </div>

        <!-- Mode Toggle & Close -->
        <div class="flex items-center gap-3">
          <!-- Single / Group Mode Switch -->
          <div class="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
            <button
              type="button"
              @click="setMode('SINGLE')"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all',
                form.entryType === 'SINGLE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Single Frame
            </button>
            <button
              type="button"
              @click="setMode('GROUP')"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all',
                form.entryType === 'GROUP' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Group Frames
            </button>
          </div>

          <button
            @click="closeModal"
            class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
        <!-- 1. Top Section: 4-Column Grid (Pictures, Accessories, Boxing System, Detail) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <!-- Col A: Frame Pictures & Overall Quantity (4 cols) -->
          <div class="lg:col-span-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <Camera class="w-3.5 h-3.5 text-sky-600" /> Frame Pictures (Multiple)
                </label>
                <span class="text-[11px] text-slate-400">{{ form.pictures.length }} added</span>
              </div>

              <!-- Pictures Grid -->
              <div class="grid grid-cols-3 gap-2 mb-3">
                <div
                  v-for="(pic, idx) in form.pictures"
                  :key="idx"
                  class="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-2xs"
                >
                  <img :src="pic.url" class="w-full h-full object-contain p-1" />
                  <button
                    type="button"
                    @click="removePicture(idx)"
                    class="absolute top-1 right-1 w-5 h-5 bg-rose-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X class="w-3 h-3" />
                  </button>
                  <span
                    v-if="idx === 0"
                    class="absolute bottom-1 left-1 bg-sky-600 text-white text-[9px] font-bold px-1 rounded"
                  >
                    Primary
                  </span>
                </div>

                <!-- Add Picture Button -->
                <button
                  type="button"
                  @click="triggerAddPicture"
                  class="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50/50 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-sky-600 transition-all cursor-pointer"
                >
                  <Plus class="w-5 h-5" />
                  <span class="text-[10px] font-bold">+ Picture</span>
                </button>
              </div>

              <!-- Quick URL Input if needed -->
              <div class="flex gap-1.5">
                <input
                  v-model="newImageUrl"
                  @keydown.enter.prevent="addPictureUrl"
                  type="text"
                  placeholder="Paste image URL (https://...)"
                  class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  @click="addPictureUrl"
                  class="px-3 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <!-- Group Frame Breakdown or Single Quantity -->
            <div class="mt-4 pt-3 border-t border-slate-200">
              <div v-if="form.entryType === 'GROUP'" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-700">Code Distribution:</span>
                  <span class="font-extrabold text-purple-700">Total: {{ totalQuantity }}</span>
                </div>
                <!-- Visual Tags [C1:20][C2:20][C3:20][C4:40] -->
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="v in form.variants"
                    :key="v.code"
                    class="inline-flex items-center px-2 py-0.5 rounded-lg bg-purple-100 border border-purple-200 font-mono font-bold text-purple-800 text-[11px]"
                  >
                    [{{ v.code }}: {{ v.quantity }}]
                  </span>
                </div>
              </div>

              <div v-else class="flex items-center justify-between">
                <label class="font-extrabold text-slate-800">Total Quantity:</label>
                <div class="w-28">
                  <input
                    v-model.number="form.quantity"
                    type="number"
                    min="0"
                    required
                    class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-right focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Col B: Accessories Included (3 cols) -->
          <div class="lg:col-span-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <PackageCheck class="w-3.5 h-3.5 text-emerald-600" /> Accessories Included
                </label>
                <button
                  type="button"
                  @click="addCustomAccessory"
                  class="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs"
                  title="Add other accessory"
                >
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Checklist with Pic badge -->
              <div class="space-y-2">
                <div
                  v-for="(acc, aIdx) in form.accessories"
                  :key="aIdx"
                  class="flex items-center justify-between p-1.5 rounded-xl bg-white border border-slate-200/90"
                >
                  <div class="flex items-center gap-2">
                    <!-- Pic badge / upload trigger -->
                    <button
                      type="button"
                      @click="triggerAccessoryPic(aIdx)"
                      class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden text-[10px] font-bold text-slate-500"
                      :title="acc.picUrl ? 'Change image' : 'Attach picture'"
                    >
                      <img v-if="acc.picUrl" :src="acc.picUrl" class="w-full h-full object-cover" />
                      <span v-else>Pic</span>
                    </button>

                    <label class="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        v-model="acc.isIncluded"
                        class="w-3.5 h-3.5 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                      />
                      <span>{{ acc.name }}</span>
                    </label>
                  </div>

                  <button
                    v-if="acc.isCustom"
                    type="button"
                    @click="removeAccessory(aIdx)"
                    class="text-slate-400 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Custom accessory inline adder -->
            <div v-if="showCustomAccInput" class="mt-3 flex gap-1 pt-2 border-t border-slate-200">
              <input
                v-model="newAccessoryName"
                @keydown.enter.prevent="saveCustomAccessory"
                type="text"
                placeholder="Accessory name..."
                class="flex-1 px-2 py-1 bg-white border rounded-lg text-xs"
              />
              <button
                type="button"
                @click="saveCustomAccessory"
                class="px-2.5 py-1 bg-sky-600 text-white rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          <!-- Col C: Boxing System (3 cols) -->
          <div class="lg:col-span-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div class="flex items-center justify-between">
              <label class="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                <Ruler class="w-3.5 h-3.5 text-indigo-600" /> Boxing System:
              </label>
            </div>

            <!-- Standard notation box: 52 ▢ 17 – 147 -->
            <div class="p-2.5 bg-white border border-slate-300 rounded-xl shadow-2xs">
              <input
                v-model="form.boxingNotation"
                type="text"
                placeholder="52 ▢ 17 – 147"
                class="w-full text-center font-mono font-bold text-slate-900 text-xs focus:outline-none"
              />
            </div>

            <!-- Optional Measurements Grid -->
            <div>
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Optional:
              </span>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-500">A :</span>
                  <input
                    v-model.number="form.lensWidthA"
                    type="number"
                    placeholder="52"
                    class="w-12 text-right font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div class="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-500">B :</span>
                  <input
                    v-model.number="form.lensHeightB"
                    type="number"
                    placeholder="38"
                    class="w-12 text-right font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div class="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-500">ED :</span>
                  <input
                    v-model.number="form.effectiveDiaEd"
                    type="number"
                    placeholder="58"
                    class="w-12 text-right font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div class="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-500">DBL :</span>
                  <input
                    v-model.number="form.bridgeDbl"
                    type="number"
                    placeholder="18"
                    class="w-12 text-right font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div class="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-500">DIA :</span>
                  <input
                    v-model.number="form.lensDia"
                    type="number"
                    placeholder="60"
                    class="w-12 text-right font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div class="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-500">FPD :</span>
                  <input
                    v-model.number="form.pupillaryDistanceFpd"
                    type="number"
                    placeholder="72"
                    class="w-12 text-right font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <!-- Size selector: S M L XL -->
              <div class="flex items-center justify-between mt-2.5 bg-white p-1 rounded-xl border border-slate-200">
                <span class="font-bold text-slate-500 px-2">Size :</span>
                <div class="flex gap-1">
                  <button
                    v-for="s in ['S', 'M', 'L', 'XL']"
                    :key="s"
                    type="button"
                    @click="form.frameSize = s"
                    :class="[
                      'px-2 py-0.5 rounded-lg font-bold text-xs transition-colors',
                      form.frameSize === s ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    ]"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Col D: Detail text area (2 cols) -->
          <div class="lg:col-span-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col">
            <label class="font-extrabold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
              <FileText class="w-3.5 h-3.5 text-slate-600" /> Detail:
            </label>
            <textarea
              v-model="form.detail"
              placeholder="Enter frame materials, ergonomic hinge design, optical Rx compatibility, or internal notes..."
              class="w-full flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 resize-none"
              rows="6"
            ></textarea>
          </div>
        </div>

        <!-- 2. Brand, Model & Code Bar -->
        <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4">
          <!-- Brand -->
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-slate-700">Brand:</span>
            <input
              v-model="form.brand"
              type="text"
              required
              placeholder="e.g. Oleva"
              class="w-36 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-sky-700"
            />
          </div>

          <!-- Single Mode: Model & Code Inputs -->
          <template v-if="form.entryType === 'SINGLE'">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-700">Model:</span>
              <input
                v-model="form.model"
                type="text"
                required
                placeholder="e.g. OLV1201"
                class="w-36 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-rose-600"
              />
            </div>

            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-700">Code:</span>
              <input
                v-model="form.code"
                type="text"
                placeholder="e.g. C4"
                class="w-28 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-purple-700"
              />
            </div>
          </template>

          <!-- Group Mode: Model list + Add, Code list + Add -->
          <template v-else>
            <!-- Model Dropdown / Select -->
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-700">Model:</span>
              <div class="flex items-center gap-1">
                <select
                  v-model="form.model"
                  class="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-rose-600 min-w-32"
                >
                  <option v-for="m in modelOptions" :key="m" :value="m">{{ m }}</option>
                </select>
                <button
                  type="button"
                  @click="openAddModelPrompt"
                  class="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-slate-700"
                  title="Add new model"
                >
                  + Add
                </button>
              </div>
            </div>

            <!-- Code Manager & Variant breakdown -->
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-700">Code:</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="openAddCodeModal"
                  class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
                >
                  <Plus class="w-3.5 h-3.5" /> Add Code Variant
                </button>
              </div>
            </div>
          </template>

          <!-- Optional Price Fields -->
          <div class="ml-auto flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-slate-500">Retail $:</span>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                class="w-20 px-2 py-1 bg-white border rounded-lg text-right font-bold"
              />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-slate-500">Wholesale $:</span>
              <input
                v-model.number="form.wholesalePrice"
                type="number"
                step="0.01"
                class="w-20 px-2 py-1 bg-white border rounded-lg text-right font-bold"
              />
            </div>
          </div>
        </div>

        <!-- Group Mode: Interactive Variant Allocation Matrix -->
        <div
          v-if="form.entryType === 'GROUP' && form.variants.length > 0"
          class="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3"
        >
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-purple-900 flex items-center gap-2">
              <Layers class="w-4 h-4 text-purple-700" /> Color Codes & Quantity Allocations
            </span>
            <span class="text-xs text-purple-700 font-bold">Sum Total: {{ totalQuantity }} units</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="(v, vIdx) in form.variants"
              :key="v.code"
              class="bg-white p-3 rounded-xl border border-purple-200 shadow-2xs flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-mono font-extrabold text-purple-700 text-sm">{{ v.code }}</span>
                <button
                  type="button"
                  @click="removeVariant(vIdx)"
                  class="text-slate-300 hover:text-rose-500"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                v-model="v.colorName"
                type="text"
                placeholder="Color name..."
                class="w-full text-[11px] text-slate-600 mb-2 px-1.5 py-0.5 bg-slate-50 border rounded"
              />
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-bold">Qty:</span>
                <input
                  v-model.number="v.quantity"
                  type="number"
                  min="0"
                  class="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-right text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Classification Dropdowns (Category, Gender, Type, Material, Kind of Materials) -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <!-- Category -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Category
            </label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All</option>
              <option value="Eyeglasses">Eyeglasses</option>
              <option value="Eyeglasses Clip">Eyeglasses Clip</option>
              <option value="Sunglasses">Sunglasses</option>
              <option value="Reading Glasses">Reading Glasses</option>
              <option value="Sportive">Sportive</option>
              <option value="Safety">Safety</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <!-- Gender -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Gender
            </label>
            <select
              v-model="form.gender"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All</option>
              <option value="Woman">Woman</option>
              <option value="Man">Man</option>
              <option value="Kid">Kid</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Type
            </label>
            <select
              v-model="form.type"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All</option>
              <option value="Full-rim">Full-rim</option>
              <option value="Half-rim">Half-rim</option>
              <option value="Rimless">Rimless</option>
            </select>
          </div>

          <!-- Material -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Material
            </label>
            <select
              v-model="form.material"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All</option>
              <option value="Plastic">Plastic</option>
              <option value="Metal">Metal</option>
              <option value="Plastic/Metal">Plastic/Metal</option>
              <option value="Metal/Plastic">Metal/Plastic</option>
            </select>
          </div>

          <!-- Kind of Materials -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Kind of materials
            </label>
            <select
              v-model="form.kindOfMaterial"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All</option>
              <option value="Plastic">Plastic</option>
              <option value="Resin">Resin</option>
              <option value="Celluloid">Celluloid</option>
              <option value="Metal">Metal</option>
              <option value="Metal Flex">Metal Flex</option>
              <option value="Stainless">Stainless</option>
              <option value="Titanium">Titanium</option>
              <option value="Mixed">Mixed</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <!-- 4. Conditional: Sunglasses Polarize Feature (Page 4) -->
        <div
          v-if="form.category === 'Sunglasses'"
          class="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center gap-3 animate-in fade-in"
        >
          <label class="flex items-center gap-2 cursor-pointer font-bold text-amber-900 select-none">
            <input
              type="checkbox"
              v-model="form.isPolarized"
              class="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
            />
            <SunMedium class="w-4 h-4 text-amber-600" />
            <span>Polarize (Polarized Optical Protection)</span>
          </label>
          <span class="text-[11px] text-amber-700">Enables high-contrast glare reduction & UV400 sun blocking</span>
        </div>

        <!-- 5. Conditional: Frame Shape Visual Selector Grid (Pages 3, 4, 6) -->
        <div
          v-if="['Eyeglasses', 'Sunglasses', 'Reading Glasses', 'Eyeglasses Clip', 'All'].includes(form.category)"
          class="space-y-2 pt-1"
        >
          <div class="flex items-center justify-between">
            <label class="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-sky-600"></span> Frame shape:
            </label>
            <span class="text-[11px] text-slate-400 font-semibold">
              Selected: <strong class="text-sky-700">{{ form.frameShape || 'Rectangle' }}</strong>
            </span>
          </div>

          <!-- 8 Visual Shapes Grid (Rectangle, Oval, Round, Wellington, Boston, Browline, Rimless, Other) -->
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            <FrameShapeIcon
              v-for="s in frameShapes"
              :key="s"
              :shape="s"
              :isSelected="form.frameShape === s"
              @click="form.frameShape = s"
            />
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div class="text-xs text-slate-500">
          Mode: <strong class="text-slate-800">{{ form.entryType === 'GROUP' ? 'Group Frames' : 'Single Frame' }}</strong>
          • Total Units: <strong class="text-sky-700 font-bold">{{ totalQuantity }}</strong>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveFrame"
            :disabled="saving"
            class="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-extrabold shadow-md shadow-sky-600/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save class="w-4 h-4" />
            <span>{{ saving ? 'Saving Frame...' : 'Save' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import {
  Glasses,
  X,
  Plus,
  Trash2,
  Camera,
  PackageCheck,
  Ruler,
  FileText,
  Save,
  Layers,
  SunMedium,
} from 'lucide-vue-next';
import FrameShapeIcon from './FrameShapeIcon.vue';
import { frameService } from '@/services/frame.service';
import type { FrameShape, CreateFramePayload } from '@/types/frame';

const props = defineProps<{
  isOpen: boolean;
  initialMode?: 'SINGLE' | 'GROUP';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', frame: any): void;
}>();

const saving = ref(false);
const newImageUrl = ref('');
const showCustomAccInput = ref(false);
const newAccessoryName = ref('');

const frameShapes: FrameShape[] = [
  'Rectangle',
  'Oval',
  'Round',
  'Wellington',
  'Boston',
  'Browline',
  'Rimless',
  'Other',
];

const modelOptions = ref(['OLV1201', 'OLV1202', 'OLV1203', 'OLV1204']);

const form = reactive({
  entryType: 'SINGLE' as 'SINGLE' | 'GROUP',
  brand: 'Oleva',
  model: 'OLV1201',
  code: 'C4',
  category: 'Eyeglasses',
  gender: 'Unisex',
  type: 'Full-rim',
  material: 'Plastic',
  kindOfMaterial: 'Celluloid',
  frameShape: 'Rectangle' as FrameShape,
  isPolarized: false,
  detail: 'Oleva Optical frames engineered with lightweight Japanese cellulose acetate and flexible spring hinge.',

  // Boxing system
  boxingNotation: '52 ▢ 17 – 147',
  lensWidthA: 52,
  lensHeightB: 38,
  effectiveDiaEd: 58,
  bridgeDbl: 18,
  lensDia: 60,
  pupillaryDistanceFpd: 72,
  frameSize: 'M',

  quantity: 100,
  price: 85,
  wholesalePrice: 42,

  pictures: [
    { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80', isPrimary: true },
    { url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80', isPrimary: false },
  ] as Array<{ url: string; isPrimary?: boolean }>,

  accessories: [
    { name: 'Case', isIncluded: true, picUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=200&q=80', isCustom: false },
    { name: 'Bag', isIncluded: true, picUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=200&q=80', isCustom: false },
    { name: 'Clean pad', isIncluded: true, picUrl: null, isCustom: false },
    { name: 'Warranty Card', isIncluded: true, picUrl: null, isCustom: false },
    { name: 'Clip', isIncluded: true, picUrl: null, isCustom: false },
    { name: 'Others', isIncluded: true, picUrl: null, isCustom: false },
  ] as Array<{ name: string; isIncluded: boolean; picUrl?: string | null; isCustom?: boolean }>,

  variants: [
    { code: 'C1', colorName: 'Piano Black', quantity: 20 },
    { code: 'C2', colorName: 'Demi Amber', quantity: 20 },
    { code: 'C3', colorName: 'Smoke Grey', quantity: 20 },
    { code: 'C4', colorName: 'Olive Crystal', quantity: 40 },
  ] as Array<{ code: string; colorName?: string; quantity: number }>,
});

watch(
  () => props.initialMode,
  (newMode) => {
    if (newMode) form.entryType = newMode;
  },
  { immediate: true },
);

// Computed total quantity
const totalQuantity = computed(() => {
  if (form.entryType === 'GROUP' && form.variants.length > 0) {
    return form.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
  }
  return Number(form.quantity) || 0;
});

function setMode(mode: 'SINGLE' | 'GROUP') {
  form.entryType = mode;
}

function removePicture(idx: number) {
  form.pictures.splice(idx, 1);
}

function addPictureUrl() {
  if (newImageUrl.value.trim().length > 0) {
    form.pictures.push({
      url: newImageUrl.value.trim(),
      isPrimary: form.pictures.length === 0,
    });
    newImageUrl.value = '';
  }
}

function triggerAddPicture() {
  const url = prompt('Enter image URL:');
  if (url && url.trim()) {
    form.pictures.push({ url: url.trim(), isPrimary: form.pictures.length === 0 });
  }
}

function triggerAccessoryPic(idx: number) {
  const url = prompt(`Enter image URL for "${form.accessories[idx].name}":`);
  if (url && url.trim()) {
    form.accessories[idx].picUrl = url.trim();
  }
}

function addCustomAccessory() {
  showCustomAccInput.value = !showCustomAccInput.value;
}

function saveCustomAccessory() {
  if (newAccessoryName.value.trim().length > 0) {
    form.accessories.push({
      name: newAccessoryName.value.trim(),
      isIncluded: true,
      picUrl: null,
      isCustom: true,
    });
    newAccessoryName.value = '';
    showCustomAccInput.value = false;
  }
}

function removeAccessory(idx: number) {
  form.accessories.splice(idx, 1);
}

function openAddModelPrompt() {
  const newModel = prompt('Enter new model code (e.g. OLV1205):');
  if (newModel && newModel.trim()) {
    const val = newModel.trim().toUpperCase();
    if (!modelOptions.value.includes(val)) {
      modelOptions.value.push(val);
    }
    form.model = val;
  }
}

function openAddCodeModal() {
  const nextCodeNum = form.variants.length + 1;
  const code = prompt('Enter color code (e.g. C5):', `C${nextCodeNum}`);
  if (code && code.trim()) {
    const qty = prompt(`Enter quantity for code ${code}:`, '20');
    form.variants.push({
      code: code.trim().toUpperCase(),
      colorName: `Color ${code.trim()}`,
      quantity: Number(qty) || 20,
    });
  }
}

function removeVariant(idx: number) {
  form.variants.splice(idx, 1);
}

function closeModal() {
  emit('close');
}

async function saveFrame() {
  try {
    saving.value = true;

    const payload: CreateFramePayload = {
      entryType: form.entryType,
      brand: form.brand,
      model: form.model,
      code: form.entryType === 'SINGLE' ? form.code : form.variants[0]?.code || 'C1',
      category: form.category,
      gender: form.gender,
      type: form.type,
      material: form.material,
      kindOfMaterial: form.kindOfMaterial,
      frameShape: form.frameShape,
      isPolarized: form.category === 'Sunglasses' ? form.isPolarized : false,
      detail: form.detail,

      // Boxing system
      boxingNotation: form.boxingNotation,
      lensWidthA: form.lensWidthA,
      lensHeightB: form.lensHeightB,
      effectiveDiaEd: form.effectiveDiaEd,
      bridgeDbl: form.bridgeDbl,
      lensDia: form.lensDia,
      pupillaryDistanceFpd: form.pupillaryDistanceFpd,
      frameSize: form.frameSize,

      quantity: totalQuantity.value,
      price: form.price,
      wholesalePrice: form.wholesalePrice,

      pictures: form.pictures.map((p, i) => ({
        url: p.url,
        isPrimary: i === 0,
        sortOrder: i,
      })),

      accessories: form.accessories.map((a) => ({
        name: a.name,
        isIncluded: a.isIncluded,
        picUrl: a.picUrl || undefined,
      })),

      variants:
        form.entryType === 'GROUP'
          ? form.variants.map((v) => ({
              code: v.code,
              colorName: v.colorName,
              quantity: Number(v.quantity) || 0,
            }))
          : [
              {
                code: form.code || 'C1',
                colorName: `Color ${form.code || 'C1'}`,
                quantity: totalQuantity.value,
              },
            ],
    };

    const saved = await frameService.createFrame(payload);
    emit('saved', saved);
    closeModal();
  } catch (err: any) {
    alert(err.message || 'Failed to save frame');
  } finally {
    saving.value = false;
  }
}
</script>
