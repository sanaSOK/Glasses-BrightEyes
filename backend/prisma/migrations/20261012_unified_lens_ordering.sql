-- =========================================================================
-- UNIFIED LENS ORDERING AND INVENTORY MANAGEMENT SYSTEM (PostgreSQL)
-- Custom Rx Lab Orders, Frame Measurements, Stock Lens SPH/CYL Matrix
-- =========================================================================

CREATE TABLE IF NOT EXISTS unified_lens_orders (
  id VARCHAR(36) PRIMARY KEY,
  order_no VARCHAR(64) UNIQUE NOT NULL,
  order_ref VARCHAR(64),
  order_type VARCHAR(64) DEFAULT 'RX Lab Order', -- 'RX Lab Order', 'Stock Lens Order', 'Remote Edging'
  buyer VARCHAR(128),
  shop VARCHAR(128),
  ordering_person VARCHAR(128),
  patient_name VARCHAR(128),
  patient_code VARCHAR(64),
  tray_id VARCHAR(64),
  order_status VARCHAR(64) DEFAULT 'Producing Surfacing', -- 'Pending', 'Producing Surfacing', 'Coating / Tinting', 'Quality Check', 'Ready for Dispatch', 'Shipped', 'Delivered'
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  logistics_date TIMESTAMP WITH TIME ZONE,
  is_urgent BOOLEAN DEFAULT FALSE,
  account_code VARCHAR(64), -- ACC
  notes TEXT,
  total_amount NUMERIC(12,2) DEFAULT 0,
  total_pieces INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_frames (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) UNIQUE NOT NULL REFERENCES unified_lens_orders(id) ON DELETE CASCADE,
  frame_shape VARCHAR(64),
  tracer_flag VARCHAR(64),
  frame_width_a NUMERIC(6,2),   -- A: Box width
  frame_height_b NUMERIC(6,2),  -- B: Box height
  effective_dia_ed NUMERIC(6,2),-- ED: Effective Diameter
  nose_bridge_dbl NUMERIC(6,2), -- DBL: Distance Between Lenses
  face_form_angle NUMERIC(6,2),
  pantoscopic_tilt NUMERIC(6,2),
  refracted_bvd NUMERIC(6,2),
  fitted_bvd NUMERIC(6,2),
  base_curve NUMERIC(6,2),
  frame_type VARCHAR(64),       -- 'Metal Fullrim', 'Plastic Fullrim', 'Rimless', 'Halfrim', etc.
  vd NUMERIC(6,2),
  tilt NUMERIC(6,2),
  wrap NUMERIC(6,2),
  pd_far_r NUMERIC(6,2),
  pd_far_l NUMERIC(6,2),
  pd_near_r NUMERIC(6,2),
  pd_near_l NUMERIC(6,2),
  height_r NUMERIC(6,2),
  height_l NUMERIC(6,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_lens_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL REFERENCES unified_lens_orders(id) ON DELETE CASCADE,
  lens_type VARCHAR(64),        -- 'Single Vision RX', 'Bifocal', 'Progressive', 'Stock Lens'
  product_name VARCHAR(255) NOT NULL,
  design_type VARCHAR(64),      -- 'Aspherical', 'Spherical', 'SV RX Golf', etc.
  refractive_index NUMERIC(4,2),
  material VARCHAR(64),
  tinting_type VARCHAR(64),
  tint_color VARCHAR(64),
  tint_from VARCHAR(32),
  tint_to VARCHAR(32),
  gradation_point VARCHAR(32),
  coating VARCHAR(64),
  treatments VARCHAR(128),      -- 'UNC', 'HC', 'HMC', 'Super HMC', 'Anti-Fog HMC'
  quantity INT DEFAULT 1,
  special_instructions TEXT,
  eye_side VARCHAR(16),         -- 'Right', 'Left', 'PAIR'
  sphere NUMERIC(6,2),          -- SPH
  cylinder NUMERIC(6,2),        -- CYL
  axis NUMERIC(6,2),            -- 0 - 180
  addition NUMERIC(6,2),        -- ADD
  diameter NUMERIC(6,2),        -- Dia
  dpd NUMERIC(6,2),
  npd NUMERIC(6,2),
  h_prism NUMERIC(6,2),
  h_base VARCHAR(16),           -- In / Out
  v_prism NUMERIC(6,2),
  v_base VARCHAR(16),           -- Up / Down
  fh NUMERIC(6,2),              -- Fitting Height
  remarks VARCHAR(255),
  unit_price NUMERIC(10,2) DEFAULT 0,
  subtotal NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_lens_variants (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(64),
  sphere NUMERIC(5,2) NOT NULL,    -- -6.00 to +6.00
  cylinder NUMERIC(5,2) NOT NULL,  -- 0.00 to -4.00
  stock_quantity INT DEFAULT 0,
  treatment VARCHAR(64),           -- 'UNC', 'HC', 'HMC', 'Super HMC', 'Anti-Fog HMC'
  coating VARCHAR(64),
  refractive_index NUMERIC(4,2),
  selling_price NUMERIC(10,2) DEFAULT 0,
  cost_price NUMERIC(10,2) DEFAULT 0,
  sku VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_unified_orders_no ON unified_lens_orders(order_no);
CREATE INDEX IF NOT EXISTS idx_unified_orders_status ON unified_lens_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_unified_orders_type ON unified_lens_orders(order_type);
CREATE INDEX IF NOT EXISTS idx_stock_lens_sph_cyl ON stock_lens_variants(sphere, cylinder);
