<template>
  <div class="space-y-6 font-sans">
    <!-- Main System Header with Workflow Navigation Tabs -->
    <header class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center space-x-3.5">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
            <EyeIcon class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-black text-slate-900 tracking-tight">
                Lens Ordering & Inventory Management
              </h1>
              <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase tracking-wide">
                Unified Lab v2.5
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Custom Rx Lab Orders, Stock SPH/CYL Matrix Grids, and Optical Fulfillment Dashboard
            </p>
          </div>
        </div>

        <!-- Top Global Quick Action Buttons -->
        <div class="flex items-center flex-wrap gap-2">
          <button
            @click="activeWorkflowTab = 'wizard'"
            class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <PlusCircleIcon class="w-4 h-4" />
            <span>New Rx Lab Order</span>
          </button>
          <button
            @click="activeWorkflowTab = 'stock'"
            class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <GridIcon class="w-4 h-4" />
            <span>New Stock Order</span>
          </button>
          <button
            @click="activeWorkflowTab = 'catalog'; openProductModal = true"
            class="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-2xs transition flex items-center space-x-1"
          >
            <PlusIcon class="w-3.5 h-3.5 text-slate-500" />
            <span>Add Catalog Lens</span>
          </button>
        </div>
      </div>

      <!-- Modern Segmented Workflow Tabs -->
      <nav class="flex items-center space-x-1 border-t border-slate-100 pt-3 overflow-x-auto pb-1" aria-label="Workflow Tabs">
        <button
          @click="activeWorkflowTab = 'tracking'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer',
            activeWorkflowTab === 'tracking'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <ClipboardListIcon class="w-4 h-4 text-sky-400" />
          <span>Module C: Order Tracking & Lab Dashboard</span>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-black',
              activeWorkflowTab === 'tracking' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'
            ]"
          >
            {{ unifiedOrders.length }}
          </span>
        </button>

        <button
          @click="activeWorkflowTab = 'wizard'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer',
            activeWorkflowTab === 'wizard'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <SparklesIcon class="w-4 h-4 text-indigo-400" />
          <span>Module A: Rx Lab Order Wizard</span>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            Custom Rx
          </span>
        </button>

        <button
          @click="activeWorkflowTab = 'stock'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer',
            activeWorkflowTab === 'stock'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <LayersIcon class="w-4 h-4 text-emerald-400" />
          <span>Module B: Stock Lens SPH/CYL Matrix</span>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            Batch Grid
          </span>
        </button>

        <button
          @click="activeWorkflowTab = 'catalog'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer',
            activeWorkflowTab === 'catalog'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          <GridIcon class="w-4 h-4 text-purple-400" />
          <span>Master Catalog & POS Matrix</span>
        </button>
      </nav>
    </header>

    <!-- ===================================================================== -->
    <!-- MODULE C: ORDER MANAGEMENT & TRACKING DASHBOARD                      -->
    <!-- ===================================================================== -->
    <div v-if="activeWorkflowTab === 'tracking'" class="space-y-6">
      <!-- 1. Executive Status KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Lab Orders</p>
            <h3 class="text-2xl font-black text-slate-900 mt-0.5">{{ unifiedOrders.length }}</h3>
            <p class="text-[11px] text-slate-500 mt-1 font-medium">All active & completed orders</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
            <ClipboardListIcon class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-blue-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-blue-600 uppercase tracking-wider">In Surfacing Lab</p>
            <h3 class="text-2xl font-black text-blue-700 mt-0.5">{{ inProductionCount }}</h3>
            <p class="text-[11px] text-blue-500 mt-1 font-medium">Currently on generator/edger</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <SlidersIcon class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Ready / Shipped</p>
            <h3 class="text-2xl font-black text-emerald-700 mt-0.5">{{ readyShippedCount }}</h3>
            <p class="text-[11px] text-emerald-500 mt-1 font-medium">QC passed & dispatches</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <TruckIcon class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Rush / Urgent</p>
            <h3 class="text-2xl font-black text-rose-700 mt-0.5">{{ urgentCount }}</h3>
            <p class="text-[11px] text-rose-500 mt-1 font-medium">Expedited turn-around</p>
          </div>
          <div class="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <FlameIcon class="w-5 h-5" />
          </div>
        </div>
      </div>

      <!-- 2. Search & Multi-Criteria Filter Panel -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3.5">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <!-- Text Search Field -->
          <div class="relative flex-1">
            <SearchIcon class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              v-model="orderSearchQuery"
              type="text"
              placeholder="Filter by Order No, Patient Name, Tray ID, Order Ref, Shop..."
              class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition"
              @input="fetchUnifiedOrders"
            />
          </div>

          <!-- Dropdowns and Controls -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Order Status Filter -->
            <select
              v-model="selectedOrderStatus"
              @change="fetchUnifiedOrders"
              class="bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold transition"
            >
              <option value="All">All Order States</option>
              <option value="Pending">Pending</option>
              <option value="Producing Surfacing">Producing Surfacing</option>
              <option value="Coating / Tinting">Coating / Tinting</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Ready for Dispatch">Ready for Dispatch</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <!-- Order Type Filter -->
            <select
              v-model="selectedOrderType"
              @change="fetchUnifiedOrders"
              class="bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold transition"
            >
              <option value="All">All Order Types</option>
              <option value="RX Lab Order">RX Lab Order</option>
              <option value="Stock Lens Order">Stock Lens Order</option>
              <option value="Remote Edging">Remote Edging</option>
            </select>

            <!-- Date Range Selectors -->
            <div class="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <CalendarIcon class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                v-model="filterFromDate"
                type="date"
                class="bg-transparent border-none text-[11px] text-slate-700 font-medium p-0 focus:ring-0"
                title="From Date"
                @change="fetchUnifiedOrders"
              />
              <span class="text-slate-300">-</span>
              <input
                v-model="filterToDate"
                type="date"
                class="bg-transparent border-none text-[11px] text-slate-700 font-medium p-0 focus:ring-0"
                title="To Date"
                @change="fetchUnifiedOrders"
              />
            </div>

            <!-- Urgent Toggle -->
            <label class="flex items-center space-x-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                v-model="filterIsUrgent"
                @change="fetchUnifiedOrders"
                class="rounded accent-rose-600 w-3.5 h-3.5"
              />
              <span :class="filterIsUrgent ? 'text-rose-600 font-bold' : ''">Urgent Only</span>
            </label>

            <!-- Refresh Button -->
            <button
              @click="fetchUnifiedOrders"
              class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCwIcon class="w-4 h-4" :class="{ 'animate-spin': loadingOrders }" />
            </button>

            <!-- Reset Filters -->
            <button
              v-if="hasActiveFilters"
              @click="resetFilters"
              class="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Export & Batch Fulfillment Operation Buttons -->
        <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
          <div class="text-slate-500 font-medium">
            Showing <strong class="text-slate-800">{{ filteredUnifiedOrders.length }}</strong> of <strong class="text-slate-800">{{ unifiedOrders.length }}</strong> orders
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="exportToCSV"
              class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <DownloadIcon class="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              @click="exportToJSON"
              class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-2xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <DownloadIcon class="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Orders Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700 font-sans">
            <thead class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <tr>
                <th class="py-3 px-4">Order NO. / Ref</th>
                <th class="py-3 px-3">Patient & Customer</th>
                <th class="py-3 px-3">Tray ID</th>
                <th class="py-3 px-3">Order Status</th>
                <th class="py-3 px-3">Dates</th>
                <th class="py-3 px-3">Urgency</th>
                <th class="py-3 px-3">Items / Specs</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loadingOrders">
                <td colspan="8" class="text-center py-12 text-slate-400">
                  <RefreshCwIcon class="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                  <p class="font-semibold text-xs">Loading orders from optical lab database...</p>
                </td>
              </tr>

              <tr v-else-if="filteredUnifiedOrders.length === 0">
                <td colspan="8" class="text-center py-12 text-slate-400">
                  <ClipboardListIcon class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p class="font-bold text-sm text-slate-600">No Orders Found</p>
                  <p class="text-xs text-slate-400 mt-1">Try adjusting your filters or create a new order.</p>
                </td>
              </tr>

              <tr
                v-for="ord in filteredUnifiedOrders"
                :key="ord.id"
                class="hover:bg-slate-50/80 transition"
              >
                <!-- 1. Order NO & Ref -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center space-x-1.5">
                    <span class="font-black text-slate-900">{{ ord.orderNo }}</span>
                    <span v-if="ord.orderRef" class="text-[10px] text-slate-400 font-mono">({{ ord.orderRef }})</span>
                  </div>
                  <div class="mt-1 flex items-center gap-1">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide',
                        ord.orderType === 'RX Lab Order'
                          ? 'bg-indigo-100 text-indigo-800'
                          : ord.orderType === 'Stock Lens Order'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      ]"
                    >
                      {{ ord.orderType }}
                    </span>
                    <span v-if="ord.accountCode" class="text-[10px] text-slate-400 font-mono">
                      {{ ord.accountCode }}
                    </span>
                  </div>
                </td>

                <!-- 2. Patient & Customer Info -->
                <td class="py-3.5 px-3">
                  <div class="font-bold text-slate-900">{{ ord.patientName || 'Customer Rx' }}</div>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span v-if="ord.patientCode" class="font-mono text-[10px] bg-slate-100 px-1 py-0.2 rounded text-slate-600">
                      {{ ord.patientCode }}
                    </span>
                    <span v-if="ord.shop" class="text-slate-400">| {{ ord.shop }}</span>
                  </div>
                </td>

                <!-- 3. Tray ID -->
                <td class="py-3.5 px-3">
                  <span
                    v-if="ord.trayId"
                    class="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-black text-xs font-mono"
                  >
                    {{ ord.trayId }}
                  </span>
                  <span v-else class="text-slate-300 font-mono">-</span>
                </td>

                <!-- 4. Order Status (With Quick Selector) -->
                <td class="py-3.5 px-3">
                  <div class="flex items-center space-x-2">
                    <select
                      :value="ord.orderStatus"
                      @change="handleInlineStatusChange(ord.id, ($event.target as HTMLSelectElement).value)"
                      :class="[
                        'text-xs font-extrabold rounded-lg px-2.5 py-1 border transition cursor-pointer',
                        getStatusBadgeClass(ord.orderStatus)
                      ]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Producing Surfacing">Producing Surfacing</option>
                      <option value="Coating / Tinting">Coating / Tinting</option>
                      <option value="Quality Check">Quality Check</option>
                      <option value="Ready for Dispatch">Ready for Dispatch</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>

                <!-- 5. Dates -->
                <td class="py-3.5 px-3">
                  <div class="text-[11px] font-semibold text-slate-700">
                    {{ formatDate(ord.orderDate) }}
                  </div>
                  <div v-if="ord.logisticsDate" class="text-[10px] text-slate-400 mt-0.5">
                    Target: <strong class="text-slate-600">{{ formatDate(ord.logisticsDate) }}</strong>
                  </div>
                </td>

                <!-- 6. Urgency Badge -->
                <td class="py-3.5 px-3">
                  <span
                    v-if="ord.isUrgent"
                    class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-200 animate-pulse flex items-center space-x-1 w-fit"
                  >
                    <FlameIcon class="w-3 h-3 text-rose-600" />
                    <span>RUSH</span>
                  </span>
                  <span v-else class="text-[10px] font-bold text-slate-400">
                    Standard
                  </span>
                </td>

                <!-- 7. Items / Prescription Summary -->
                <td class="py-3.5 px-3">
                  <div class="font-bold text-slate-800">
                    {{ ord.totalPieces || ord.lensItems?.reduce((a, b) => a + (b.quantity || 1), 0) || 1 }} pcs
                    <span class="text-emerald-600 ml-1 font-extrabold">${{ (ord.totalAmount || 0).toFixed(2) }}</span>
                  </div>
                  <div class="text-[10px] text-slate-500 mt-0.5 max-w-[140px] truncate">
                    <template v-if="ord.orderType === 'RX Lab Order'">
                      OD/OS Rx Lens Pair
                    </template>
                    <template v-else>
                      Stock Matrix Selection
                    </template>
                  </div>
                </td>

                <!-- 8. Actions Buttons -->
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end space-x-1.5">
                    <button
                      @click="openPrintSlip(ord)"
                      class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      title="Print Optical Lab Job Ticket / Barcode Slip"
                    >
                      <PrinterIcon class="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ticket</span>
                    </button>

                    <button
                      @click="openDetails(ord)"
                      class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      title="View Full Prescription & Frame Parameters"
                    >
                      <EyeIcon class="w-3.5 h-3.5 text-indigo-600" />
                      <span>Details</span>
                    </button>

                    <button
                      @click="deleteOrder(ord.id)"
                      class="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      title="Delete Order"
                    >
                      <Trash2Icon class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- MODULE A: RX LAB ORDER WIZARD (CUSTOM PRESCRIPTION & FRAME)          -->
    <!-- ===================================================================== -->
    <div v-if="activeWorkflowTab === 'wizard'">
      <RxLabOrderWizard
        @submitted="handleUnifiedOrderCreated"
        @cancelled="activeWorkflowTab = 'tracking'"
      />
    </div>

    <!-- ===================================================================== -->
    <!-- MODULE B: STOCK LENS ORDERING & INTERACTIVE SPH/CYL MATRIX GRID      -->
    <!-- ===================================================================== -->
    <div v-if="activeWorkflowTab === 'stock'">
      <StockLensMatrixOrder
        @submitted="handleUnifiedOrderCreated"
        @cancelled="activeWorkflowTab = 'tracking'"
      />
    </div>

    <!-- ===================================================================== -->
    <!-- MASTER LENS CATALOG & POS MATRIX (ORIGINAL VARIANT MATRIX WORKSPACE)   -->
    <!-- ===================================================================== -->
    <div v-if="activeWorkflowTab === 'catalog'" class="space-y-6">
      <div class="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Master Catalog & POS Matrix Inventory</h2>
          <p class="text-xs text-slate-500">Maintain base product lines, brand configurations, and POS counter checkouts</p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="fetchSavedOrders"
            class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200/80 shadow-2xs transition flex items-center space-x-1.5"
            title="View Saved POS Checkout Orders"
          >
            <SaveIcon class="w-4 h-4 text-emerald-600" />
            <span>Saved POS Orders</span>
            <span v-if="savedOrders.length" class="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              {{ savedOrders.length }}
            </span>
          </button>
          <button
            @click="openBrandModal = true"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-xs transition flex items-center space-x-1.5"
          >
            <PlusIcon class="w-4 h-4 text-slate-500" />
            <span>Add Brand</span>
          </button>
          <button
            @click="openProductModal = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center space-x-2"
          >
            <PlusCircleIcon class="w-4 h-4" />
            <span>New Lens Product</span>
          </button>
        </div>
      </div>

      <!-- Main Grid Workspace -->
      <div class="grid grid-cols-12 gap-6 items-start">
        <!-- 1. Left Column: Master Lens Catalog (3 Cols) -->
        <aside class="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
          <!-- Search & Filter Controls -->
          <div class="space-y-3">
            <div class="relative">
              <SearchIcon class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search lens or SKU..."
                class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition"
                @input="fetchProducts"
              />
            </div>

            <!-- Category Selector Dropdown -->
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category Filter</label>
              <select
                v-model="selectedCategory"
                @change="fetchProducts"
                class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 transition font-medium"
              >
                <option value="All">All Categories</option>
                <option v-for="cat in categories.filter(c => c !== 'All')" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <!-- Brand Selector Dropdown -->
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand Filter</label>
              <select
                v-model="selectedBrandId"
                @change="fetchProducts"
                class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-1.5 text-xs text-slate-800 transition font-medium"
              >
                <option value="All">All Brands ({{ products.length }})</option>
                <option v-for="b in brands" :key="b.id" :value="b.id">
                  {{ b.name }} ({{ b._count?.lensProducts || 0 }})
                </option>
              </select>
            </div>
          </div>

          <!-- Master Products Catalog Cards -->
          <div class="flex-1 space-y-2 overflow-y-auto pr-0.5">
            <div class="flex items-center justify-between text-xs text-slate-500 font-semibold pb-2 border-b border-slate-100">
              <span>Master Catalog ({{ filteredProducts.length }})</span>
              <span v-if="loadingProducts" class="text-indigo-600 text-[10px] animate-pulse">Loading...</span>
            </div>

            <div
              v-for="prod in filteredProducts"
              :key="prod.id"
              @click="selectProduct(prod)"
              :class="[
                'p-3.5 rounded-xl border transition cursor-pointer relative group',
                selectedProduct?.id === prod.id
                  ? 'bg-indigo-50/70 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              ]"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex flex-wrap items-center gap-1">
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wide">
                    {{ prod.brand?.name || 'Brand' }}
                  </span>
                  <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {{ prod.lensType }}
                  </span>
                </div>
                <span class="text-xs font-bold text-emerald-600">${{ prod.price.toFixed(2) }}</span>
              </div>

              <h3 class="text-xs font-semibold text-slate-900 mt-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
                {{ prod.name }}
              </h3>

              <div class="flex flex-wrap gap-1 mt-2 text-[10px] text-slate-500">
                <span v-if="prod.refractiveIndex" class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80">Idx {{ prod.refractiveIndex }}</span>
                <span v-if="prod.coating" class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80">{{ prod.coating }}</span>
                <span v-if="prod.material" class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80 truncate max-w-[100px]">{{ prod.material }}</span>
                <span v-if="prod.tintColor" class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/80 font-medium flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full shrink-0 border border-slate-300" :style="{ backgroundColor: getPresetHex(prod.tintColor) }"></span>
                  {{ prod.tintColor }}
                </span>
              </div>

              <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>SKU: {{ prod.SKU }}</span>
                <span>{{ prod._count?.variants || prod.variants?.length || 0 }} Matrix Cells</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- 2. Center Column: Matrix Inventory Grid (6 Cols) -->
        <section class="col-span-12 lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col space-y-4 min-h-[550px]">
          <div v-if="!selectedProduct" class="flex-1 flex flex-col items-center justify-center text-slate-400 py-20">
            <LayersIcon class="w-12 h-12 text-slate-300 mb-3" />
            <p class="text-sm font-semibold text-slate-600">Select a Lens Product from catalog</p>
            <p class="text-xs text-slate-400 mt-1">Matrix inventory grid powers & stock will display here</p>
          </div>

          <template v-else>
            <!-- Product Header Summary -->
            <div class="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200/60">
                      {{ selectedProduct.brand?.name }}
                    </span>
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {{ selectedProduct.lensType }}
                    </span>
                    <span v-if="selectedProduct.isPolarized" class="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                      POLARIZED
                    </span>
                  </div>
                  <h2 class="text-base font-bold text-slate-900 tracking-tight">{{ selectedProduct.name }}</h2>
                  <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">{{ selectedProduct.description || 'Optical lens product matrix catalog item.' }}</p>
                </div>

                <div class="text-right shrink-0">
                  <div class="text-xs text-slate-500 font-medium">Base Selling Price</div>
                  <div class="text-xl font-extrabold text-emerald-600">${{ selectedProduct.price.toFixed(2) }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">Cost: ${{ selectedProduct.costPrice.toFixed(2) }}</div>
                </div>
              </div>

              <!-- Optical Specs Pills Bar -->
              <div class="flex flex-wrap gap-2 text-xs border-t border-slate-200/80 pt-2.5">
                <div v-if="selectedProduct.refractiveIndex" class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                  <span class="text-slate-400 font-medium mr-1">Index:</span><strong class="font-semibold">{{ selectedProduct.refractiveIndex }}</strong>
                </div>
                <div v-if="selectedProduct.coating" class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                  <span class="text-slate-400 font-medium mr-1">Coating:</span><strong class="font-semibold">{{ selectedProduct.coating }}</strong>
                </div>
                <div v-if="selectedProduct.material" class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                  <span class="text-slate-400 font-medium mr-1">Material:</span><strong class="font-semibold">{{ selectedProduct.material }}</strong>
                </div>
                <div v-if="selectedProduct.designType" class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                  <span class="text-slate-400 font-medium mr-1">Design:</span><strong class="font-semibold">{{ selectedProduct.designType }}</strong>
                </div>
                <div v-if="selectedProduct.tintColor" class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1.5">
                  <span class="text-slate-400 font-medium">Tint / Color:</span>
                  <span class="w-2.5 h-2.5 rounded-full border border-slate-300" :style="{ backgroundColor: getPresetHex(selectedProduct.tintColor) }"></span>
                  <strong class="font-semibold">{{ selectedProduct.tintColor }}</strong>
                </div>
                <div v-if="selectedProduct.uvProtection" class="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 shadow-2xs">
                  <span class="text-slate-400 font-medium mr-1">UV:</span><strong class="font-semibold">{{ selectedProduct.uvProtection }}</strong>
                </div>
              </div>
            </div>

            <!-- Matrix Filter & Actions Bar -->
            <div class="flex items-center justify-between gap-3 text-xs">
              <div class="flex items-center space-x-2">
                <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Eye Prescription:</span>
                <div class="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                  <button
                    @click="eyeSideFilter = 'PAIR'"
                    :class="['px-2.5 py-1 rounded-lg font-bold transition text-xs', eyeSideFilter === 'PAIR' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-500 hover:text-slate-800']"
                  >
                    Both / PAIR
                  </button>
                  <button
                    @click="eyeSideFilter = 'R'"
                    :class="['px-2.5 py-1 rounded-lg font-bold transition text-xs', eyeSideFilter === 'R' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-500 hover:text-slate-800']"
                  >
                    OD (Right)
                  </button>
                  <button
                    @click="eyeSideFilter = 'L'"
                    :class="['px-2.5 py-1 rounded-lg font-bold transition text-xs', eyeSideFilter === 'L' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-500 hover:text-slate-800']"
                  >
                    OS (Left)
                  </button>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="openBatchModal = true"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center space-x-1 border border-slate-200"
                >
                  <SlidersIcon class="w-3.5 h-3.5 text-slate-500" />
                  <span>Batch Update Range</span>
                </button>
              </div>
            </div>

            <!-- 2D Interactive Power Matrix Table (SPH vs CYL/ADD) -->
            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
              <div class="overflow-x-auto max-h-[480px]">
                <table class="w-full border-collapse text-center text-xs font-mono">
                  <thead class="sticky top-0 z-10 bg-slate-100 text-slate-700 shadow-2xs">
                    <tr>
                      <th class="p-2 border border-slate-200 bg-slate-200/80 font-bold sticky left-0 z-20 text-[10px] uppercase tracking-wider">
                        SPH \ {{ isBifocalOrProgressive ? 'ADD' : 'CYL' }}
                      </th>
                      <th
                        v-for="col in matrixCols"
                        :key="col"
                        class="p-2 border border-slate-200 min-w-[70px] font-bold text-slate-800"
                      >
                        {{ formatPower(col) }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sph in matrixRows" :key="sph" class="hover:bg-indigo-50/30 transition">
                      <!-- Sphere Header Cell -->
                      <th class="p-2 border border-slate-200 bg-slate-100 font-bold text-slate-800 sticky left-0 z-10">
                        {{ formatPower(sph) }}
                      </th>

                      <!-- Matrix Cells -->
                      <td
                        v-for="col in matrixCols"
                        :key="`${sph}_${col}`"
                        class="border border-slate-200 p-1 relative transition group hover:ring-2 hover:ring-indigo-400 select-none"
                        :style="{ backgroundColor: getCellColor(sph, col) }"
                      >
                        <div
                          v-if="getVariant(sph, col)"
                          class="flex flex-col items-center justify-center p-1 rounded cursor-pointer min-h-[46px]"
                          @click="selectVariantToEdit(getVariant(sph, col)!)"
                        >
                          <div class="flex items-center space-x-1">
                            <span :class="['font-bold text-xs', (getVariant(sph, col)!.quantity || 0) <= 0 ? 'text-rose-500 font-extrabold' : 'text-slate-800']">
                              {{ getVariant(sph, col)!.quantity }}
                            </span>
                            <span class="text-[9px] text-slate-400">pcs</span>
                          </div>

                          <div class="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            ${{ (getVariant(sph, col)!.sellingPrice || selectedProduct.price).toFixed(2) }}
                          </div>

                          <!-- Quick Add to Cart Button -->
                          <button
                            @click.stop="quickAddToCart(getVariant(sph, col)!)"
                            class="mt-1 opacity-0 group-hover:opacity-100 transition px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9px] font-bold shadow-2xs flex items-center space-x-0.5"
                            title="Add 1 Pair / Item to Cart"
                          >
                            <ShoppingCartIcon class="w-2.5 h-2.5" />
                            <span>+Cart</span>
                          </button>
                        </div>

                        <!-- Empty cell fallback -->
                        <div v-else class="text-slate-300 text-[10px] py-3 italic">
                          -
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </section>

        <!-- 3. Right Column: POS Cart & Instant Rx Checkout (3 Cols) -->
        <aside class="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <ShoppingCartIcon class="w-4 h-4 text-indigo-600" />
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">POS Rx Checkout</h3>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-[10px]">
              {{ cartItems.length }} lines
            </span>
          </div>

          <!-- Customer Prescription Details Input -->
          <div class="space-y-2 text-xs">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Name / Patient</label>
              <input
                v-model="customerName"
                type="text"
                placeholder="e.g. John Doe / Patient #42"
                class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone / Ref</label>
              <input
                v-model="customerPhone"
                type="text"
                placeholder="+1 555-0199"
                class="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <!-- Cart Items List -->
          <div class="flex-1 space-y-2 overflow-y-auto pr-0.5">
            <div v-if="cartItems.length === 0" class="text-center py-10 text-slate-400">
              <ShoppingCartIcon class="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p class="text-xs font-medium">Cart is empty</p>
              <p class="text-[10px] text-slate-400">Click "+Cart" on any power cell</p>
            </div>

            <div
              v-for="(item, idx) in cartItems"
              :key="idx"
              class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5 relative group"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 leading-tight">{{ item.productName }}</h4>
                  <div class="flex items-center space-x-1.5 font-mono text-[11px] text-indigo-700 mt-0.5">
                    <span class="bg-indigo-50 px-1 py-0.2 rounded font-bold">SPH: {{ formatPower(item.sphere) }}</span>
                    <span v-if="item.cylinder" class="bg-indigo-50 px-1 py-0.2 rounded font-bold">CYL: {{ formatPower(item.cylinder) }}</span>
                    <span v-if="item.addPower" class="bg-purple-50 text-purple-700 px-1 py-0.2 rounded font-bold">ADD: {{ formatPower(item.addPower) }}</span>
                  </div>
                </div>
                <button @click="removeFromCart(idx)" class="text-slate-400 hover:text-rose-500 p-0.5">
                  <XIcon class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Quantity and Price Bar -->
              <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                <div class="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5">
                  <button @click="updateCartQty(idx, item.quantity - 1)" class="w-4 h-4 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800">-</button>
                  <span class="w-5 text-center font-bold text-slate-800">{{ item.quantity }}</span>
                  <button @click="updateCartQty(idx, item.quantity + 1)" class="w-4 h-4 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800">+</button>
                </div>
                <span class="font-bold text-slate-800">${{ (item.unitPrice * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Checkout Summary & Total -->
          <div class="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span class="font-bold text-slate-800">${{ cartSubtotal.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-500">
              <span>Discount ($):</span>
              <input
                v-model.number="cartDiscount"
                type="number"
                min="0"
                class="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-right font-bold text-emerald-600 text-xs"
              />
            </div>
            <div class="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-2">
              <span>Total Payable:</span>
              <span class="text-emerald-600">${{ cartTotal.toFixed(2) }}</span>
            </div>

            <button
              @click="processCheckout"
              :disabled="cartItems.length === 0 || submittingOrder"
              class="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircleIcon class="w-4 h-4" />
              <span>{{ submittingOrder ? 'Processing...' : 'Complete POS Checkout' }}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- MODALS SECTION                                                        -->
    <!-- ===================================================================== -->

    <!-- Modal 1: Job Slip & Barcode Ticket Print Modal (Module C) -->
    <JobSlipPrintModal
      v-if="selectedOrderForSlip"
      :order="selectedOrderForSlip"
      :isOpen="isPrintModalOpen"
      @close="isPrintModalOpen = false; selectedOrderForSlip = null"
    />

    <!-- Modal 2: Full Order Details & Timeline Progression Modal (Module C) -->
    <OrderDetailsModal
      v-if="selectedOrderForDetails"
      :order="selectedOrderForDetails"
      :isOpen="isDetailsModalOpen"
      @close="isDetailsModalOpen = false; selectedOrderForDetails = null"
      @print="handlePrintFromDetails"
      @updateStatus="handleStatusUpdateFromModal"
    />

    <!-- Modal 3: Batch Update Matrix Power Range Modal (POS Catalog) -->
    <div v-if="openBatchModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <SlidersIcon class="w-4 h-4 text-indigo-600" />
            Batch Update Power Matrix Range
          </h3>
          <button @click="openBatchModal = false" class="text-slate-400 hover:text-slate-600">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="block text-slate-500 mb-1">Target Product</label>
            <input
              type="text"
              :value="selectedProduct?.name"
              disabled
              class="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-slate-600 font-medium"
            />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Cell Color Scheme</label>
            <select v-model="batchForm.cellColor" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-semibold">
              <option value="#ffffff">Default White</option>
              <option value="#ecfdf5">Emerald Mint (In Stock)</option>
              <option value="#eff6ff">Sky Blue (Promo/Fast)</option>
              <option value="#fef3c7">Amber Gold (Premium)</option>
              <option value="#fdf2f8">Rose Pink (Special Rx)</option>
            </select>
          </div>
        </div>

        <!-- Sphere Range -->
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
          <span class="font-bold text-slate-700 block">Sphere Range Filter</span>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] text-slate-400">Min Sphere (From)</label>
              <input v-model.number="batchForm.minSphere" type="number" step="0.25" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900" />
            </div>
            <div>
              <label class="text-[10px] text-slate-400">Max Sphere (To)</label>
              <input v-model.number="batchForm.maxSphere" type="number" step="0.25" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900" />
            </div>
          </div>
        </div>

        <!-- Values to Apply -->
        <div class="grid grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block text-slate-500 mb-1">Stock Quantity</label>
            <input v-model.number="batchForm.quantity" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Cost Price ($)</label>
            <input v-model.number="batchForm.costPrice" type="number" step="0.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Selling Price ($)</label>
            <input v-model.number="batchForm.sellingPrice" type="number" step="0.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold text-emerald-600" />
          </div>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button @click="openBatchModal = false" class="px-3.5 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs">Cancel</button>
          <button @click="saveBatchUpdate" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm">
            Apply Batch Range
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Add New Brand Modal (POS Catalog) -->
    <div v-if="openBrandModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900">Add Lens Brand</h3>
          <button @click="openBrandModal = false" class="text-slate-400 hover:text-slate-600">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-500 mb-1">Brand Name *</label>
            <input v-model="brandForm.name" type="text" placeholder="e.g. Zeiss, Essilor, Hoya" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Brand Code</label>
            <input v-model="brandForm.code" type="text" placeholder="e.g. ZSS, ESS, HYA" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 uppercase" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Description</label>
            <textarea v-model="brandForm.description" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button @click="openBrandModal = false" class="px-3.5 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs">Cancel</button>
          <button @click="saveBrand" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm">Save Brand</button>
        </div>
      </div>
    </div>

    <!-- Modal 5: Add New Lens Product & Auto-Generate Matrix (POS Catalog) -->
    <div v-if="openProductModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900">New Lens Product & Matrix Generator</h3>
          <button @click="openProductModal = false" class="text-slate-400 hover:text-slate-600">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="block text-slate-500 mb-1">Brand *</label>
            <select v-model="productForm.brandId" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-semibold">
              <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Product Category *</label>
            <select v-model="productForm.lensType" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-semibold">
              <option value="Single Vision">Single Vision</option>
              <option value="Bifocal">Bifocal</option>
              <option value="Progressive">Progressive</option>
              <option value="Contact Lens">Contact Lens</option>
              <option value="Sunglass">Sunglass</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-slate-500 mb-1">Product Name *</label>
            <input v-model="productForm.name" type="text" placeholder="e.g. 1.60 Hi-Index Super Aspheric HMC" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Index (e.g. 1.56, 1.60)</label>
            <input v-model.number="productForm.refractiveIndex" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Coating (HMC, AR, BlueCut)</label>
            <input v-model="productForm.coating" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Default Cost Price ($)</label>
            <input v-model.number="productForm.costPrice" type="number" step="0.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold" />
          </div>
          <div>
            <label class="block text-slate-500 mb-1">Default Selling Price ($)</label>
            <input v-model.number="productForm.price" type="number" step="0.5" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold text-emerald-600" />
          </div>
        </div>

        <!-- Matrix Power Generator Range Inputs -->
        <div class="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 space-y-2 text-xs">
          <h4 class="font-bold text-indigo-900 flex items-center gap-1.5"><GridIcon class="w-4 h-4 text-indigo-600" /> Auto Matrix Power Range Generation</h4>
          <div class="grid grid-cols-4 gap-3">
            <div>
              <label class="block text-slate-600 mb-1">Min Sphere (S)</label>
              <input v-model.number="productForm.minSphere" type="number" step="0.5" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900" />
            </div>
            <div>
              <label class="block text-slate-600 mb-1">Max Sphere (S)</label>
              <input v-model.number="productForm.maxSphere" type="number" step="0.5" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900" />
            </div>
            <div>
              <label class="block text-slate-600 mb-1">Min Cyl / ADD</label>
              <input v-model.number="productForm.minCol" type="number" step="0.5" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900" />
            </div>
            <div>
              <label class="block text-slate-600 mb-1">Max Cyl / ADD</label>
              <input v-model.number="productForm.maxCol" type="number" step="0.5" class="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-slate-900" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button @click="openProductModal = false" class="px-3.5 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs">Cancel</button>
          <button @click="saveProduct" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm">
            Create Product & Generate Matrix
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 6: Checkout Success & Receipt Modal (POS Catalog) -->
    <div v-if="completedOrder" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white border border-emerald-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-center">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircleIcon class="w-8 h-8" />
        </div>

        <div>
          <h3 class="text-base font-bold text-slate-900">POS Rx Order Completed!</h3>
          <p class="text-xs text-slate-500 mt-0.5">Invoice # <strong>{{ completedOrder.invoiceNumber }}</strong></p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 font-mono">
          <div class="flex justify-between text-slate-600">
            <span>Customer:</span>
            <span class="text-slate-900 font-bold">{{ completedOrder.customerName }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Items Count:</span>
            <span class="text-slate-900">{{ completedOrder.orderItems.length }}</span>
          </div>
          <div class="border-t border-slate-200 pt-2 flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span class="text-slate-900">${{ completedOrder.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Discount:</span>
            <span class="text-emerald-600">-${{ completedOrder.discount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm font-bold text-emerald-600 border-t border-slate-200 pt-2">
            <span>Paid Total:</span>
            <span>${{ completedOrder.total.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex items-center space-x-2 pt-2">
          <button @click="completedOrder = null" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm">
            Close & Start Next POS Order
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 7: Saved POS Checkout Orders History Modal -->
    <div v-if="openSavedOrdersModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <SaveIcon class="w-4 h-4 text-emerald-600" />
            Saved POS Rx Checkout Orders History
          </h3>
          <button @click="openSavedOrdersModal = false" class="text-slate-400 hover:text-slate-600 transition">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <div v-if="savedOrders.length === 0" class="text-center py-10 text-slate-400 text-xs">
            No saved checkout orders found. Complete a POS order to view it here.
          </div>

          <div
            v-for="order in savedOrders"
            :key="order.id"
            class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 hover:bg-slate-100/60 transition"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-slate-900 font-mono">{{ order.invoiceNumber }}</span>
                <span v-if="order.customerName" class="text-slate-500 ml-2">({{ order.customerName }})</span>
              </div>
              <span class="font-extrabold text-emerald-600">${{ (order.total || 0).toFixed(2) }}</span>
            </div>

            <div class="space-y-1 bg-white p-2 rounded-lg border border-slate-200/60">
              <div
                v-for="(item, i) in order.orderItems"
                :key="i"
                class="flex items-center justify-between text-[11px] text-slate-600"
              >
                <span>
                  {{ item.productName }}
                  <span class="font-mono text-indigo-700">
                    ({{ item.quantity }} pcs | SPH {{ formatPower(item.sphere) }}
                    <template v-if="item.cylinder"> / CYL {{ formatPower(item.cylinder) }}</template>
                    <template v-if="item.eyeSide"> | {{ item.eyeSide }}</template>)
                  </span>
                </span>
                <span class="font-semibold text-slate-900">${{ ((item.unitPrice || 0) * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Date: {{ new Date(order.createdAt).toLocaleString() }}</span>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                {{ order.status || 'COMPLETED' }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button @click="openSavedOrdersModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Toast Notification -->
    <transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="toastMessage" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 max-w-sm">
        <CheckCircleIcon class="w-5 h-5 text-emerald-400 shrink-0" />
        <div class="text-xs">
          <p class="font-bold text-white">Optical Lab System</p>
          <p class="text-slate-300 mt-0.5">{{ toastMessage }}</p>
        </div>
        <button @click="toastMessage = ''" class="text-slate-400 hover:text-white ml-auto p-1">
          <XIcon class="w-4 h-4" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  Eye as EyeIcon,
  Plus as PlusIcon,
  PlusCircle as PlusCircleIcon,
  Search as SearchIcon,
  Layers as LayersIcon,
  Grid as GridIcon,
  Sliders as SlidersIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
  X as XIcon,
  Save as SaveIcon,
  ClipboardList as ClipboardListIcon,
  Sparkles as SparklesIcon,
  Truck as TruckIcon,
  Flame as FlameIcon,
  Calendar as CalendarIcon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon,
  Printer as PrinterIcon,
  Trash2 as Trash2Icon,
} from 'lucide-vue-next';
import {
  lensService,
  type Brand,
  type LensProduct,
  type LensVariant,
  type LensOrder,
  type UnifiedLensOrder,
} from '@/services/lens.service';

// Modular Child Components for Unified Lens Ordering System
import RxLabOrderWizard from '@/components/lens/RxLabOrderWizard.vue';
import StockLensMatrixOrder from '@/components/lens/StockLensMatrixOrder.vue';
import JobSlipPrintModal from '@/components/lens/JobSlipPrintModal.vue';
import OrderDetailsModal from '@/components/lens/OrderDetailsModal.vue';

// -----------------------------------------------------------------------------
// WORKFLOW TAB CONTROL
// -----------------------------------------------------------------------------
const activeWorkflowTab = ref<'tracking' | 'wizard' | 'stock' | 'catalog'>('tracking');

// -----------------------------------------------------------------------------
// TOAST NOTIFICATION SYSTEM
// -----------------------------------------------------------------------------
const toastMessage = ref('');
let toastTimeout: any = null;

function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

// -----------------------------------------------------------------------------
// MODULE C: ORDER MANAGEMENT & TRACKING DASHBOARD STATE
// -----------------------------------------------------------------------------
const unifiedOrders = ref<UnifiedLensOrder[]>([]);
const loadingOrders = ref(false);

// Filter & Search criteria
const orderSearchQuery = ref('');
const selectedOrderStatus = ref('All');
const selectedOrderType = ref('All');
const filterIsUrgent = ref(false);
const filterFromDate = ref('');
const filterToDate = ref('');

// Modals State for Orders
const isDetailsModalOpen = ref(false);
const selectedOrderForDetails = ref<UnifiedLensOrder | null>(null);

const isPrintModalOpen = ref(false);
const selectedOrderForSlip = ref<UnifiedLensOrder | null>(null);

// KPI Computed Counts
const inProductionCount = computed(() => {
  return unifiedOrders.value.filter(
    (o) => o.orderStatus === 'Producing Surfacing' || o.orderStatus === 'Coating / Tinting'
  ).length;
});

const readyShippedCount = computed(() => {
  return unifiedOrders.value.filter(
    (o) => o.orderStatus === 'Ready for Dispatch' || o.orderStatus === 'Shipped' || o.orderStatus === 'Delivered'
  ).length;
});

const urgentCount = computed(() => {
  return unifiedOrders.value.filter((o) => o.isUrgent).length;
});

const hasActiveFilters = computed(() => {
  return (
    orderSearchQuery.value !== '' ||
    selectedOrderStatus.value !== 'All' ||
    selectedOrderType.value !== 'All' ||
    filterIsUrgent.value ||
    filterFromDate.value !== '' ||
    filterToDate.value !== ''
  );
});

function resetFilters() {
  orderSearchQuery.value = '';
  selectedOrderStatus.value = 'All';
  selectedOrderType.value = 'All';
  filterIsUrgent.value = false;
  filterFromDate.value = '';
  filterToDate.value = '';
  fetchUnifiedOrders();
}

async function fetchUnifiedOrders() {
  loadingOrders.value = true;
  try {
    const list = await lensService.getUnifiedOrders({
      search: orderSearchQuery.value || undefined,
      status: selectedOrderStatus.value !== 'All' ? selectedOrderStatus.value : undefined,
      orderType: selectedOrderType.value !== 'All' ? selectedOrderType.value : undefined,
      isUrgent: filterIsUrgent.value ? true : undefined,
      fromDate: filterFromDate.value || undefined,
      toDate: filterToDate.value || undefined,
    });
    unifiedOrders.value = list;
  } catch (err) {
    console.warn('Failed fetching unified orders:', err);
  } finally {
    loadingOrders.value = false;
  }
}

const filteredUnifiedOrders = computed(() => {
  return unifiedOrders.value.filter((ord) => {
    // 1. Text Search
    if (orderSearchQuery.value.trim()) {
      const q = orderSearchQuery.value.toLowerCase();
      const matchNo = ord.orderNo?.toLowerCase().includes(q);
      const matchRef = ord.orderRef?.toLowerCase().includes(q);
      const matchPat = ord.patientName?.toLowerCase().includes(q);
      const matchCode = ord.patientCode?.toLowerCase().includes(q);
      const matchTray = ord.trayId?.toLowerCase().includes(q);
      const matchShop = ord.shop?.toLowerCase().includes(q);
      if (!matchNo && !matchRef && !matchPat && !matchCode && !matchTray && !matchShop) {
        return false;
      }
    }
    // 2. Status filter
    if (selectedOrderStatus.value !== 'All' && ord.orderStatus !== selectedOrderStatus.value) {
      return false;
    }
    // 3. Order Type filter
    if (selectedOrderType.value !== 'All' && ord.orderType !== selectedOrderType.value) {
      return false;
    }
    // 4. Urgent filter
    if (filterIsUrgent.value && !ord.isUrgent) {
      return false;
    }
    // 5. From Date
    if (filterFromDate.value && new Date(ord.orderDate) < new Date(filterFromDate.value)) {
      return false;
    }
    // 6. To Date
    if (filterToDate.value) {
      const toDateObj = new Date(filterToDate.value);
      toDateObj.setHours(23, 59, 59, 999);
      if (new Date(ord.orderDate) > toDateObj) {
        return false;
      }
    }
    return true;
  });
});

async function handleInlineStatusChange(orderId: string, nextStatus: string) {
  try {
    await lensService.updateUnifiedOrderStatus(orderId, nextStatus);
    const target = unifiedOrders.value.find((o) => o.id === orderId);
    if (target) {
      target.orderStatus = nextStatus;
    }
    showToast(`Order status updated to "${nextStatus}"`);
  } catch (err) {
    alert('Failed to update status: ' + err);
  }
}

async function deleteOrder(id: string) {
  if (!confirm('Are you sure you want to remove this order from tracking?')) return;
  try {
    await lensService.deleteUnifiedOrder(id);
    unifiedOrders.value = unifiedOrders.value.filter((o) => o.id !== id);
    showToast('Order successfully removed from tracking.');
  } catch (err) {
    alert('Failed to delete order: ' + err);
  }
}

function openDetails(order: UnifiedLensOrder) {
  selectedOrderForDetails.value = order;
  isDetailsModalOpen.value = true;
}

function openPrintSlip(order: UnifiedLensOrder) {
  selectedOrderForSlip.value = order;
  isPrintModalOpen.value = true;
}

function handlePrintFromDetails(order: UnifiedLensOrder) {
  isDetailsModalOpen.value = false;
  openPrintSlip(order);
}

async function handleStatusUpdateFromModal(orderId: string, status: string) {
  await handleInlineStatusChange(orderId, status);
  if (selectedOrderForDetails.value && selectedOrderForDetails.value.id === orderId) {
    selectedOrderForDetails.value.orderStatus = status;
  }
}

function handleUnifiedOrderCreated(newOrder: UnifiedLensOrder) {
  unifiedOrders.value.unshift(newOrder);
  activeWorkflowTab.value = 'tracking';
  showToast(`Order ${newOrder.orderNo} registered successfully!`);
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case 'Pending':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Producing Surfacing':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'Coating / Tinting':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'Quality Check':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'Ready for Dispatch':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Shipped':
      return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'Delivered':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Batch Export Functions
function exportToCSV() {
  const rows = [
    [
      'Order No',
      'Order Ref',
      'Order Type',
      'Patient Name',
      'Patient Code',
      'Shop / Account',
      'Tray ID',
      'Order Status',
      'Urgent',
      'Order Date',
      'Logistics Date',
      'Total Pieces',
      'Total Amount ($)',
    ],
  ];

  filteredUnifiedOrders.value.forEach((o) => {
    rows.push([
      o.orderNo,
      o.orderRef || '',
      o.orderType,
      o.patientName || '',
      o.patientCode || '',
      o.shop || '',
      o.trayId || '',
      o.orderStatus,
      o.isUrgent ? 'YES' : 'NO',
      o.orderDate || '',
      o.logisticsDate || '',
      String(o.totalPieces || o.lensItems?.reduce((a, b) => a + (b.quantity || 1), 0) || 1),
      (o.totalAmount || 0).toFixed(2),
    ]);
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `optical_lens_orders_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Orders exported to CSV file successfully.');
}

function exportToJSON() {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(filteredUnifiedOrders.value, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `optical_lens_orders_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Orders exported to JSON file successfully.');
}

// -----------------------------------------------------------------------------
// POS CATALOG & ORIGINAL VARIANT MATRIX STATE & HANDLERS
// -----------------------------------------------------------------------------
const brands = ref<Brand[]>([]);
const products = ref<LensProduct[]>([]);
const selectedProduct = ref<LensProduct | null>(null);

const searchQuery = ref('');
const selectedCategory = ref('All');
const selectedBrandId = ref('All');
const eyeSideFilter = ref<'PAIR' | 'R' | 'L'>('PAIR');

const categories = ['All', 'Contact Lens', 'Single Vision', 'Bifocal', 'Progressive', 'Sunglass'];

const themePresets = [
  { name: 'Clear', hex: '#cbd5e1' },
  { name: 'G-15 Green', hex: '#2e5a44' },
  { name: 'Dark Smoke', hex: '#334155' },
  { name: 'Amber Brown', hex: '#854d0e' },
  { name: 'Blue Light', hex: '#2563eb' },
  { name: 'Rose Pink', hex: '#e11d48' },
  { name: 'Purple Violet', hex: '#7c3aed' },
  { name: 'Night Yellow', hex: '#eab308' },
];

function getPresetHex(val?: string) {
  if (!val) return '#cbd5e1';
  if (val.startsWith('#')) return val;
  const match = themePresets.find((p) => p.name.toLowerCase() === val.toLowerCase());
  return match ? match.hex : '#2563eb';
}

const matrixRows = ref<number[]>([]);
const matrixCols = ref<number[]>([]);
const variantMap = ref<Map<string, LensVariant>>(new Map());

const cartItems = ref<
  Array<{
    lensProductId: string;
    variantId?: string;
    productName: string;
    sphere?: number;
    cylinder?: number;
    addPower?: number;
    eyeSide?: string;
    quantity: number;
    unitPrice: number;
  }>
>([]);

const customerName = ref('');
const customerPhone = ref('');
const cartDiscount = ref(0);
const submittingOrder = ref(false);
const completedOrder = ref<any | null>(null);
const savedOrders = ref<LensOrder[]>([]);
const openSavedOrdersModal = ref(false);

const openProductModal = ref(false);
const openBrandModal = ref(false);
const openBatchModal = ref(false);

const loadingProducts = ref(false);

const brandForm = ref({
  name: '',
  code: '',
  description: '',
});

const productForm = ref({
  brandId: '',
  name: '',
  lensType: 'Single Vision',
  refractiveIndex: 1.56,
  coating: 'HMC',
  material: 'CR-39 Resin',
  designType: 'Spherical',
  uvProtection: 'UV400',
  tintColor: 'Clear',
  tintGradient: false,
  isPolarized: false,
  isPhotochromic: false,
  blueLightBlock: true,
  antiReflective: true,
  scratchResistant: true,
  waterResistant: true,
  myopiaControl: false,
  costPrice: 8.5,
  price: 25.0,
  minSphere: -4.0,
  maxSphere: 2.0,
  minCol: 0.0,
  maxCol: -2.0,
});

const batchForm = ref({
  brandId: '',
  productId: '',
  minSphere: -4.0,
  maxSphere: 2.0,
  minCol: 0.0,
  maxCol: -2.0,
  quantity: 10,
  costPrice: 8.5,
  sellingPrice: 25.0,
  cellColor: '#ecfdf5',
});

const isBifocalOrProgressive = computed(() => {
  if (!selectedProduct.value) return false;
  const t = selectedProduct.value.lensType.toLowerCase();
  return t.includes('bifocal') || t.includes('progressive');
});

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    if (selectedCategory.value !== 'All' && p.lensType !== selectedCategory.value) {
      return false;
    }
    if (selectedBrandId.value !== 'All' && p.brandId !== selectedBrandId.value) {
      return false;
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.SKU?.toLowerCase().includes(q);
      const matchBrand = p.brand?.name?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });
});

const cartSubtotal = computed(() => {
  return cartItems.value.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
});

const cartTotal = computed(() => {
  const tot = cartSubtotal.value - (cartDiscount.value || 0);
  return tot > 0 ? tot : 0;
});

function formatPower(val?: number) {
  if (val === undefined || val === null) return '0.00';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}`;
}

function getVariantKey(sphere: number, col: number) {
  return `${sphere.toFixed(2)}_${col.toFixed(2)}`;
}

function getVariant(sphere: number, col: number): LensVariant | undefined {
  return variantMap.value.get(getVariantKey(sphere, col));
}

function getCellColor(sphere: number, col: number): string {
  const v = getVariant(sphere, col);
  if (!v) return '#ffffff';
  if (v.cellColor) return v.cellColor;
  if ((v.quantity || 0) <= 0) return '#fff1f2';
  return '#ffffff';
}

function quickAddToCart(v: LensVariant) {
  if (!selectedProduct.value) return;
  const colVal = isBifocalOrProgressive.value ? undefined : v.cylinder;
  const addVal = isBifocalOrProgressive.value ? v.addPower : undefined;

  const existingIdx = cartItems.value.findIndex(
    (item) =>
      item.variantId === v.id ||
      (item.lensProductId === selectedProduct.value!.id &&
        item.sphere === v.sphere &&
        item.cylinder === colVal &&
        item.addPower === addVal &&
        item.eyeSide === eyeSideFilter.value)
  );

  if (existingIdx >= 0) {
    cartItems.value[existingIdx].quantity += 1;
  } else {
    cartItems.value.push({
      lensProductId: selectedProduct.value.id,
      variantId: v.id,
      productName: `${selectedProduct.value.name} (${eyeSideFilter.value})`,
      sphere: v.sphere,
      cylinder: colVal,
      addPower: addVal,
      eyeSide: eyeSideFilter.value,
      quantity: 1,
      unitPrice: v.sellingPrice || selectedProduct.value.price,
    });
  }
}

function updateCartQty(idx: number, qty: number) {
  if (qty <= 0) {
    cartItems.value.splice(idx, 1);
  } else {
    cartItems.value[idx].quantity = qty;
  }
}

function removeFromCart(idx: number) {
  cartItems.value.splice(idx, 1);
}

function selectVariantToEdit(v: LensVariant) {
  batchForm.value.minSphere = v.sphere;
  batchForm.value.maxSphere = v.sphere;
  const col = isBifocalOrProgressive.value ? (v.addPower || 0) : (v.cylinder || 0);
  batchForm.value.minCol = col;
  batchForm.value.maxCol = col;
  batchForm.value.quantity = v.quantity;
  batchForm.value.costPrice = v.costPrice || selectedProduct.value?.costPrice || 0;
  batchForm.value.sellingPrice = v.sellingPrice || selectedProduct.value?.price || 0;
  batchForm.value.cellColor = v.cellColor || '#ffffff';
  openBatchModal.value = true;
}

async function fetchBrands() {
  try {
    brands.value = await lensService.getBrands();
    if (brands.value.length > 0 && !productForm.value.brandId) {
      productForm.value.brandId = brands.value[0].id;
    }
  } catch (err) {
    console.error('Failed fetching brands:', err);
  }
}

async function fetchProducts() {
  loadingProducts.value = true;
  try {
    products.value = await lensService.getProducts(
      selectedCategory.value,
      selectedBrandId.value,
      searchQuery.value
    );
    if (!selectedProduct.value && products.value.length > 0) {
      selectProduct(products.value[0]);
    }
  } catch (err) {
    console.error('Failed fetching lens products:', err);
  } finally {
    loadingProducts.value = false;
  }
}

async function fetchSavedOrders() {
  try {
    savedOrders.value = await lensService.getOrders();
    openSavedOrdersModal.value = true;
  } catch (err) {
    alert('Failed to retrieve POS orders: ' + err);
  }
}

function buildMatrixGrid(variants: LensVariant[]) {
  variantMap.value.clear();
  const sphereSet = new Set<number>();
  const colSet = new Set<number>();

  variants.forEach((v) => {
    if (eyeSideFilter.value !== 'PAIR' && v.eyeSide && v.eyeSide !== eyeSideFilter.value) {
      return;
    }

    const colVal = isBifocalOrProgressive.value ? (v.addPower || 0) : (v.cylinder || 0);
    sphereSet.add(v.sphere);
    colSet.add(colVal);
    variantMap.value.set(getVariantKey(v.sphere, colVal), v);
  });

  if (sphereSet.size === 0) {
    matrixRows.value = [2.0, 1.5, 1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0, -2.5, -3.0, -3.5, -4.0];
  } else {
    matrixRows.value = Array.from(sphereSet).sort((a, b) => b - a);
  }

  if (colSet.size === 0) {
    matrixCols.value = [0.0, -0.5, -1.0, -1.5, -2.0];
  } else {
    matrixCols.value = Array.from(colSet).sort((a, b) => (isBifocalOrProgressive.value ? a - b : b - a));
  }
}

async function selectProduct(prod: LensProduct) {
  selectedProduct.value = prod;
  try {
    const detailed = await lensService.getProductById(prod.id);
    selectedProduct.value = detailed;
    buildMatrixGrid(detailed.variants || []);
  } catch {
    buildMatrixGrid(prod.variants || []);
  }

  if (selectedProduct.value) {
    batchForm.value.productId = selectedProduct.value.id;
    batchForm.value.brandId = selectedProduct.value.brandId;
    const spheres = matrixRows.value;
    const cols = matrixCols.value;
    if (spheres.length > 0) {
      batchForm.value.minSphere = Math.min(...spheres);
      batchForm.value.maxSphere = Math.max(...spheres);
    }
    if (cols.length > 0) {
      batchForm.value.minCol = Math.min(...cols);
      batchForm.value.maxCol = Math.max(...cols);
    }
  }
}

async function saveBatchUpdate() {
  try {
    const res = await lensService.batchUpdateVariants({
      brandId: batchForm.value.brandId,
      lensProductId: batchForm.value.productId,
      minSphere: batchForm.value.minSphere,
      maxSphere: batchForm.value.maxSphere,
      minCol: batchForm.value.minCol,
      maxCol: batchForm.value.maxCol,
      quantity: batchForm.value.quantity,
      costPrice: batchForm.value.costPrice,
      sellingPrice: batchForm.value.sellingPrice,
      cellColor: batchForm.value.cellColor,
    });
    openBatchModal.value = false;
    if (selectedProduct.value) {
      await selectProduct(selectedProduct.value);
    }
    showToast(`Dynamic batch update applied to ${res.updatedCount} matrix cells!`);
  } catch (err) {
    alert('Failed batch update: ' + err);
  }
}

async function saveBrand() {
  if (!brandForm.value.name) return;
  try {
    await lensService.createBrand(brandForm.value);
    const bName = brandForm.value.name;
    openBrandModal.value = false;
    brandForm.value = { name: '', code: '', description: '' };
    await fetchBrands();
    showToast(`Lens Brand "${bName}" added successfully!`);
  } catch (err) {
    alert('Failed to save brand: ' + err);
  }
}

async function saveProduct() {
  try {
    const created = await lensService.createProduct(productForm.value);
    openProductModal.value = false;
    await fetchProducts();
    selectProduct(created);
    showToast(`Product "${created.name}" created with matrix grid!`);
  } catch (err) {
    alert('Failed to create product: ' + err);
  }
}

async function processCheckout() {
  if (cartItems.value.length === 0) return;
  submittingOrder.value = true;
  try {
    const order = await lensService.createOrder({
      customerName: customerName.value,
      customerPhone: customerPhone.value,
      discount: cartDiscount.value,
      items: cartItems.value,
    });
    completedOrder.value = order;
    savedOrders.value.unshift(order);
    cartItems.value = [];
    customerName.value = '';
    customerPhone.value = '';
    cartDiscount.value = 0;

    if (selectedProduct.value) {
      await selectProduct(selectedProduct.value);
    }
    showToast('POS Order completed and saved to history!');
  } catch (err) {
    alert('Checkout failed: ' + err);
  } finally {
    submittingOrder.value = false;
  }
}

watch(eyeSideFilter, () => {
  if (selectedProduct.value) {
    buildMatrixGrid(selectedProduct.value.variants || []);
  }
});

onMounted(async () => {
  await Promise.all([fetchBrands(), fetchProducts(), fetchUnifiedOrders()]);
});
</script>
