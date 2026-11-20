# KalaSetu — Discover India's Arts & Crafts
> **College Design Thinking & Innovation (DTI) Project Prototype**

KalaSetu is a functional, responsive web application connecting patrons directly with traditional Indian artisans through interactive heritage discovery, state-by-state crafts exploration, direct buyer-to-seller communication, bespoke custom commissions, verified artisan reviews, dynamic heritage impact tracking, and our core differentiator: **Behind the Art** storytelling.

---

## 🌟 Key Features

### 1. Interactive India Heritage Map
- Visual SVG map of India with clickable regions and state filtering.
- Comprehensive deep-dive content for 5 core states:
  - **Bihar** — Madhubani / Mithila Painting
  - **Odisha** — Pattachitra & Palm Leaf Engraving
  - **Rajasthan** — Jaipur Blue Pottery
  - **Uttar Pradesh** — Lucknowi Chikankari Hand Embroidery
  - **Gujarat** — Patan Patola Double Ikat
- Fallback messaging for expanding regional craft clusters.

### 2. Core Innovation: Behind the Art
- Artisans share why their artwork was created, ancestral lineage, and studio rituals.
- **Option A**: Written personal story with custom serif typography and quotation layout.
- **Option B**: Embedded studio footage & process video player (HTML5).
- **Option C**: Story document attachment (PDF, TXT, DOCX) with direct viewer/download link.

### 3. Custom Orders & Personalization
- **Bespoke Product Requests**: Buyers can commission custom creations with custom dimensions/size, natural pigment color palettes, quantity, budget (₹ INR), delivery deadline, and an optional reference photo or sketch.
- **Artisan Dashboard Management**: Artisans receive requests in their dashboard and can **Accept**, **Reject**, or propose a **Counter-Proposal** with an adjusted price, deadline, and note.
- **Patron Proposal Decision**: Buyers can review the artisan's counter-proposal and choose to accept or decline with automatic order recalculation.

### 4. Custom Order Tracking & Visual Timeline
- **Buyer "My Orders" Section** (`/orders`, `/my-orders`): Filter orders by *All*, *Active / In-Crafting*, and *Completed*.
- **7-Stage Lifecycle Stepper**:
  $$\text{Request Received} \longrightarrow \text{Accepted} \longrightarrow \text{Design Finalized} \longrightarrow \text{Work in Progress} \longrightarrow \text{Quality Check} \longrightarrow \text{Ready for Dispatch} \longrightarrow \text{Completed}$$
- **Live Progress Updates**: Artisans upload behind-the-scenes workshop photos and stage messages.
- **Visual Timeline**: Stepper with date timestamps, milestone history, and an interactive progress photo gallery with full-screen lightbox.

### 5. Artisan Reviews & Ratings
- **Verified Patron Reviews**: Buyers with completed orders can submit a 1–5 star rating, detailed feedback, and photographs of the finished artwork.
- **Review Integrity & Security**: Blocks duplicate reviews (one review per completed order) and prevents unauthorized reviews from users without completed purchases.
- **Dynamic Rating Breakdown**: Calculates real-time average star ratings and review counts across product cards, artwork details, artisan profiles, and the artisan directory.

### 6. Wishlist & Curated Gift Collections
- **Quick Heart Toggle**: Heart button on product cards and artwork pages to save items instantly to your default wishlist or curate into specific collections.
- **Personalized Gift Collections**: Create, rename, and delete custom collections (e.g., *"Wedding Gifts"*, *"Diwali Decorations"*, *"Living Room Heritage"*).
- **Public & Private Collections**: Toggle collection visibility. Public collections generate a shareable token link (`/collection/:shareId`) so friends and family can browse curated items.

### 7. Direct Buyer-to-Artisan Communication
- Zero-commission direct fair trade.
- **WhatsApp Seller**: Click-to-chat (`https://wa.me/...`) with prefilled product title, inquiry message, and product link.
- **Call Seller**: Telephone link (`tel:+91...`) with privacy opt-in toggles.

### 8. Digital Craft Passport
- Automatically stamps visited state heritage pages in browser storage (`localStorage`).
- Visual stamp collection with cultural emblems and progress tracking.

### 9. Full Seller Dashboard & Product Management
 - Seller registration and authentication.
 - Add new handmade creations with genuine media storage.
 - Edit product titles, prices, descriptions, images, and availability.
 - Delete products with immediate removal from public marketplace.

### 10. State-Wise Craft Pages & Product Filtering**:
 - When a seller tags their creation with a state, it automatically appears under that state's heritage page.
 - Full marketplace with keyword search, state filter, craft category filter, and price range filter.

### 11. Dual-Engine Architecture (Zero-Setup Demo Mode + Supabase)
- **Local Demo Mode**: Works right out of the box without requiring external credentials or internet accounts! Uses `localStorage` for session/product/order/review metadata and `IndexedDB` for high-resolution images, progress photos, videos, and documents.
- **Supabase Cloud Mode**: Seamlessly switches to PostgreSQL and Supabase Storage when credentials are added to `.env`.

---

## 🚀 Quick Start Instructions

### 1. Install & Run
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open `http://localhost:3000` (or the port shown in terminal) in your browser.

---

## 🪔 Step-by-Step Professor Demonstration Guide

Follow these comprehensive test scenarios during your presentation:

### Demo 1 — Explore India & Craft Passport
1. Open the homepage (`/`).
2. Scroll to the interactive India map or click **Explore India**.
3. Click on **Bihar** on the map (or select the Bihar chip).
4. Review the Madhubani craft introduction, historical origins, and materials.
5. Click **Craft Passport** in the navigation bar to see the Bihar cultural stamp added to your passport.

### Demo 2 — Dual-Role Authentication (Artisan & Art Patron)
1. Navigate to `/login`.
2. Notice the **1-Click Demo Accounts**:
   - **Sita Devi (Master Artisan)**: Preloaded with listed Madhubani crafts and incoming custom requests.
   - **Priya Sharma (Art Patron / Buyer)**: Preloaded with active orders, completed reviews, and curated gift collections.
3. Click on **Priya Sharma (Buyer)** to log in as a patron instantly.

### Demo 3 — Bespoke Custom Commission
1. Browse to **Marketplace** (`/marketplace`) and select an artwork (e.g., *Mithila Peacock Kohbar*).
2. Click **Request Customization / Bespoke Size** in the commission card.
3. Enter custom dimensions (e.g., `36x24 inches`), desired colors (e.g., `Indigo and turmeric yellow`), quantity (`1`), budget (`₹7,500`), and a completion deadline.
4. Optionally upload a sketch or reference photo.
5. Click **Submit Custom Commission Request**. The order is immediately registered.

### Demo 4 — Artisan Order Management & Counter-Proposals
1. Log out and 1-Click login as **Sita Devi (Master Artisan)**.
2. Go to **Seller Dashboard** (`/dashboard`) and click the **Custom Orders & Tracking** tab.
3. See the incoming order in the **Request Received** state.
4. Click **Propose Counter Terms**:
   - Change proposed price to `₹8,200` (for high-grade organic tussar silk).
   - Change deadline and add a personal note.
   - Submit proposal.
5. Switch back to **Priya Sharma (Buyer)** under `/orders`:
   - View the counter-proposal banner.
   - Click **Accept Proposal** to confirm the adjusted terms.

### Demo 5 — Live Order Tracking & Progress Photo Upload
1. Log back in as **Sita Devi (Master Artisan)** in `/dashboard`.
2. Select the accepted order and click **Advance to Design Finalized**, then **Advance to Work in Progress**.
3. Under **Post In-Progress Update & Behind-the-Scenes Photo**:
   - Type: *"Completed the central sacred borders using natural soot black ink."*
   - Upload a work-in-progress photo.
   - Click **Post Milestone Update**.
4. Log back in as **Priya Sharma (Buyer)** under `/orders`:
   - Open the visual timeline stepper to see the current active milestone.
   - View the progress photo gallery and click an image to open the full-screen lightbox.

### Demo 6 — Verified Patron Reviews & Dynamic Ratings
1. Log in as **Priya Sharma (Buyer)** under `/orders`.
2. Under the **Completed** tab, find an order that has reached the `Completed` stage.
3. Click **Leave a Review**:
   - Select 5 stars.
   - Enter your review: *"The intricate detail in this Pattachitra is breathtaking. Arrived safely packaged."*
   - Upload a photo of the received artwork.
   - Submit the review.
4. Navigate to the artisan's profile or product page:
   - Notice the updated dynamic star rating badge (e.g., `★ 5.0 (2)`).
   - Scroll to **Verified Patron Reviews** to see the review and uploaded photograph.

### Demo 7 — Live Dynamic Impact Tracker
1. Click **Our Impact** (`/impact`) in the navigation bar.
2. Verify the 4 dynamically calculated metrics:
   - **Total Order Value Preserved** (sum of completed orders).
   - **Unique Artisans Supported** (distinct artisans from completed orders).
   - **Total Craftsmanship Hours Preserved** (calculated from `craftsmanship_hours`).
   - **Craft Traditions Represented** (unique craft disciplines sustained).
3. Try the interactive **Livelihood Direct Impact Simulator** at the bottom of the page.

### Demo 8 — Wishlist & Curated Gift Collections
1. In the **Marketplace**, click the heart icon on any artwork card.
2. Select an existing collection (e.g., *"Wedding Gifts"*, *"Diwali Decorations"*) or click **+ New Collection** to create one inline.
3. Click the Heart icon in the top header to visit `/collections`.
4. Curate your collection:
   - Rename collection or edit description.
   - Toggle **Public / Shareable**.
   - Click **Copy Shareable Link**.
5. Open the copied link (`/collection/:shareId`) in an incognito window:
   - See the public, beautifully styled gift collection accessible to anyone!

---

## 🛠️ Supabase Configuration (Optional Cloud Mode)

To connect KalaSetu to live Supabase PostgreSQL and Storage:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run the SQL script in `supabase/setup.sql`.
   *(This creates `products`, `profiles`, `custom_orders`, `reviews`, `collections`, `collection_items`, storage buckets `craft-media`, `orders`, `reviews`, and all security policies).*
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart the Vite server (`npm run dev`). The status badge in the navbar will switch to **Supabase**.

---

## 📁 Project Structure

```text
Design_Thinking_and_Innovation/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Header with navigation, role buttons & wishlist badge
│   │   ├── Footer.jsx              # Cultural footer with quick links & impact routes
│   │   ├── IndiaMap.jsx            # Interactive SVG map of India with 5 core state highlights
│   │   ├── ProductCard.jsx         # Card with state badge, dynamic star rating & wishlist heart
│   │   ├── StorySection.jsx        # Behind the Art: text, HTML5 video player & doc link
│   │   ├── ContactSeller.jsx       # Direct Call & WhatsApp click-to-chat
│   │   ├── CustomOrderModal.jsx    # Bespoke commission request modal with photo upload
│   │   ├── OrderTimeline.jsx       # 7-stage visual order stepper, milestone log & photo gallery
│   │   ├── ReviewModal.jsx         # 1-5 star review submission modal with photo uploads
│   │   ├── ReviewsList.jsx         # Rating breakdown bars & verified patron reviews feed
│   │   └── WishlistButton.jsx      # Heart icon with collection selection dropdown
│   │
│   ├── pages/
│   │   ├── Home.jsx                # Hero, map preview, featured states, products & stories
│   │   ├── ExploreIndia.jsx        # Dedicated state discovery & heritage explorer
│   │   ├── StatePage.jsx           # State deep-dive (Bihar, Odisha, Rajasthan, UP, Gujarat)
│   │   ├── Marketplace.jsx         # Filterable product catalog (search, state, category, price)
│   │   ├── ProductDetails.jsx      # Craft showcase + StorySection + Custom Orders + Reviews
│   │   ├── ArtisanProfile.jsx      # Public artisan portfolio, biography, ratings & reviews
│   │   ├── ArtisansDirectory.jsx   # Directory of master artisans with dynamic star ratings
│   │   ├── CraftPassport.jsx       # Digital Craft Passport with virtual cultural stamps
│   │   ├── Login.jsx               # Sign in with 1-click demo accounts (Artisan & Buyer)
│   │   ├── Register.jsx            # Dual-role onboarding (Master Artisan vs Art Patron)
│   │   ├── SellerDashboard.jsx     # Manage products, custom orders lifecycle & reviews
│   │   ├── AddProduct.jsx          # Upload artwork, photos, story text, video & document
│   │   ├── EditProduct.jsx         # Update artwork info, price, and story media
│   │   ├── MyOrders.jsx            # Buyer orders portal with live tracking & review launcher
│   │   ├── OurImpact.jsx           # Dynamic impact dashboard (value, artisans, hours, crafts)
│   │   ├── Collections.jsx         # Wishlist & gift collections manager (create, edit, share)
│   │   └── PublicCollection.jsx    # Public shareable collection viewer (/collection/:shareId)
│   │
│   ├── lib/
│   │   ├── supabase.js             # Dual-mode engine: Supabase client + persistent LocalDB
│   │   └── indexedDb.js            # IndexedDB helper for high-res media/video/document storage
│   │
│   ├── data/
│   │   └── crafts.js               # Cultural heritage data for 5 core states & seed catalog
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx         # Unified auth, orders, reviews, collections & impact state
│   │
│   ├── App.jsx                     # Route definitions & scroll restoration
│   ├── main.jsx                    # React DOM entry point
│   └── index.css                   # Tailwind CSS & custom styling
│
├── supabase/
│   └── setup.sql                   # PostgreSQL schema, RLS policies & storage buckets
│
├── .env.example
├── package.json
└── README.md
```

---

## 🎨 Cultural Design Palette

KalaSetu utilizes a hand-picked, authentic Indian earthy palette:
- **Terracotta** (`#D95D39`): Reflects sacred temple terracotta tiles and earthen pottery.
- **Cream** (`#FFFDF7` to `#F4EFE6`): Reminiscent of unbleached khadi cotton and handmade paper.
- **Earth / Charcoal** (`#2B2118` to `#1A1410`): Inspired by traditional lampblack and natural kajal pigments.
- **Golden Ochre & Haldi** (`#E5A93C`): Inspired by sacred turmeric and marigold garlands.
