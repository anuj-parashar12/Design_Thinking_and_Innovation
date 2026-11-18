# KalaSetu — Discover India's Arts & Crafts
> **College Design Thinking & Innovation (DTI) Project Prototype**

KalaSetu is a functional, responsive web application connecting patrons directly with traditional Indian artisans through interactive heritage discovery, state-by-state crafts exploration, direct buyer-to-seller communication, and our core differentiator: **Behind the Art** storytelling.

---

## 🌟 Key Features

1. **Interactive India Heritage Map**:
   - Visual SVG map of India with clickable regions.
   - Comprehensive deep-dive content for 5 core states:
     - **Bihar** — Madhubani / Mithila Painting
     - **Odisha** — Pattachitra & Palm Leaf Engraving
     - **Rajasthan** — Jaipur Blue Pottery
     - **Uttar Pradesh** — Lucknowi Chikankari Hand Embroidery
     - **Gujarat** — Patan Patola Double Ikat
   - Fallback messaging for expanding regional craft clusters.

2. **Core Innovation: Behind the Art**:
   - Artisans share why their artwork was created, ancestral lineage, and studio rituals.
   - Option A: Written personal story with custom serif typography and quotation layout.
   - Option B: Embedded studio footage & process video player (HTML5).
   - Option C: Story document attachment (PDF, TXT, DOCX) with direct viewer/download link.

3. **Direct Buyer-to-Artisan Communication**:
   - Zero-commission direct fair trade.
   - **WhatsApp Seller**: Click-to-chat (`https://wa.me/...`) with prefilled product title, inquiry message, and product link.
   - **Call Seller**: Telephone link (`tel:+91...`) with privacy opt-in toggles.

4. **Full Seller Dashboard & Product Management**:
   - Seller registration and authentication.
   - Add new handmade creations with genuine media storage.
   - Edit product titles, prices, descriptions, images, and availability.
   - Delete products with immediate removal from public marketplace.

5. **State-Wise Craft Pages & Product Filtering**:
   - When a seller tags their creation with a state, it automatically appears under that state's heritage page.
   - Full marketplace with keyword search, state filter, craft category filter, and price range filter.

6. **Digital Craft Passport**:
   - Automatically stamps visited state heritage pages in browser storage (`localStorage`).
   - Visual stamp collection with cultural emblems and progress tracking.

7. **Dual-Engine Architecture (Zero-Setup Demo Mode + Supabase)**:
   - **Local Demo Mode**: Works right out of the box without requiring external credentials or internet accounts! Uses `localStorage` for session/product metadata and `IndexedDB` for media/video/document storage.
   - **Supabase Cloud Mode**: Seamlessly switches to PostgreSQL and Supabase Storage when credentials are added in `.env`.

---

## 🚀 Quick Start Instructions

### 1. Install & Run
```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🪔 Step-by-Step Professor Demonstration Guide

Follow these 6 test scenarios during your presentation:

### Demo 1 — Explore India
1. Open the homepage (`/`).
2. Scroll to the interactive India map or click **Explore India**.
3. Click on **Bihar** on the map (or select the Bihar chip).
4. Review the Madhubani craft introduction, historical origins, and materials.
5. Scroll down to see products originating from Bihar.

### Demo 2 — Seller Registration
1. Click **Sell Your Craft** in the top navigation.
2. Fill out the short registration form (Name, State, Craft Specialization, Phone, WhatsApp).
3. Click **Complete Registration & Go to Dashboard**.
4. You are now logged in and placed directly in your **Seller Dashboard**.

*(Tip: You can also use the 1-Click Demo Fill buttons on `/login` to sign in as **Sita Devi** or **Arjun Das** immediately).*

### Demo 3 — Product Upload
1. In the Seller Dashboard, click **Add New Product**.
2. Enter:
   - **Title**: *Handmade Terracotta Diya Set*
   - **Price**: *1250*
   - **State**: *Rajasthan*
   - **Category**: *Ceramics & Pottery*
   - **Description**: *Crafted by hand using locally sourced alluvial clay.*
3. Choose a photo from your computer (or paste an image link).
4. Click **Publish Artwork & Story**.
5. The app automatically redirects you to the live product page.
6. Open **Marketplace** (`/marketplace`) and confirm your new product appears at the top.
7. Refresh your browser (F5) to prove data persists across sessions.

### Demo 4 — Artisan Story (Behind the Art)
1. On your uploaded product page, click **Edit This Product** (or from the Dashboard).
2. Under **Behind the Art**, add a written story:
   > *"This pattern was taught to me by my mother during Diwali when I was 10. Every contour represents protection for the home."*
3. Attach a video file (MP4/WebM) or PDF document.
4. Click **Save Product Changes**.
5. View the product page: see the story quote card, the embedded video player, and the document link.

### Demo 5 — Contact Seller
1. Open any product page as a buyer.
2. In the **Direct Artisan Contact** card:
   - Click **Call Seller**: triggers phone dialer.
   - Click **WhatsApp Seller**: opens WhatsApp with a prefilled inquiry message containing the product name and current link.
3. Click **Meet the Artisan** to view their public profile and complete portfolio.

### Demo 6 — Seller Management
1. In the **Seller Dashboard**, click the edit icon on your product.
2. Change the price (e.g. from ₹1,250 to ₹950) and change availability.
3. Save changes, open the Marketplace, and confirm the updated price appears immediately.
4. Return to the dashboard and click the **Delete (Trash)** icon.
5. Confirm deletion — the product disappears instantly from public listings.

---

## 🛠️ Supabase Configuration (Optional)

If you wish to demonstrate live Supabase cloud storage and PostgreSQL:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run the SQL script in `supabase/setup.sql`.
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart the Vite server (`npm run dev`). The status badge in the navbar will switch to **Supabase**.

---

## 📁 Project Structure

```text
c:\Users\HP\Desktop\DTI_PROJECT\
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header with navigation & Demo/Supabase status badge
│   │   ├── Footer.jsx          # Cultural footer with quick links & credit
│   │   ├── IndiaMap.jsx        # Interactive SVG map of India with 5 core state highlights
│   │   ├── ProductCard.jsx     # Reusable product card with state & story badges
│   │   ├── StorySection.jsx    # Behind the Art: text, HTML5 video player & doc link
│   │   └── ContactSeller.jsx   # Call & WhatsApp click-to-chat with prefilled text
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Hero, map preview, featured states, products & stories
│   │   ├── ExploreIndia.jsx    # Dedicated state discovery & heritage explorer
│   │   ├── StatePage.jsx       # State deep-dive (Bihar, Odisha, Rajasthan, UP, Gujarat)
│   │   ├── Marketplace.jsx     # Filterable product catalog (search, state, category, price)
│   │   ├── ProductDetails.jsx  # Detailed craft showcase + StorySection + ContactSeller
│   │   ├── ArtisanProfile.jsx  # Public artisan portfolio & biography
│   │   ├── ArtisansDirectory.jsx # Directory of master artisans
│   │   ├── CraftPassport.jsx   # Digital Craft Passport with virtual cultural stamps
│   │   ├── Login.jsx           # Sign in with 1-click demo accounts
│   │   ├── Register.jsx        # Seller onboarding without bureaucratic hurdles
│   │   ├── SellerDashboard.jsx # Manage products (list, edit, delete) & profile
│   │   ├── AddProduct.jsx      # Upload artwork, photos, story text, video & document
│   │   └── EditProduct.jsx     # Update artwork information, price, and story media
│   │
│   ├── lib/
│   │   ├── supabase.js         # Supabase client + persistent local storage fallback
│   │   └── indexedDb.js        # IndexedDB helper for media/video/document storage
│   │
│   ├── data/
│   │   └── crafts.js           # Cultural heritage data for 5 core states & seed listings
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx     # Unified authentication and reactive product state
│   │
│   ├── App.jsx                 # Route definitions & scroll restoration
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Tailwind CSS & custom styling
│
├── supabase/
│   └── setup.sql               # Ready-to-run PostgreSQL schema, RLS & storage buckets
│
├── .env.example
├── package.json
└── README.md
```
