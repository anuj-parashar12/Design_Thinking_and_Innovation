// Predefined state craft data and seed demonstration products

const envPhone = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_PHONE_NUMBER;
const envWA = typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_WHATSAPP_NUMBER;

const DEMO_PHONE = envPhone || '+919876543210';
const DEMO_WA = envWA || '919876543210';

export const STATES_DATA = {
  bihar: {
    id: 'bihar',
    name: 'Bihar',
    capital: 'Patna',
    primaryCraft: 'Madhubani Painting (Mithila Art)',
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Centuries-old folk art traditionally painted by women using natural pigments and twigs.',
    description: 'Madhubani art (or Mithila painting) is practiced in the Mithila region of Bihar. Characterized by eye-catching geometrical patterns and natural imagery, it was traditionally created on freshly plastered mud walls of huts during festivals and ceremonies.',
    history: 'Dating back to the Ramayana era when King Janak commissioned artisans to paint his daughter Sita’s wedding with Lord Rama, Madhubani art has been passed down matriarchally for generations.',
    materialsAndTechniques: [
      'Natural pigments derived from flowers, turmeric, indigo, soot, and rice powder',
      'Bamboo twigs, matchsticks, and nib-pens used for fine detailing',
      'Double-line borders with intricate hatching and geometric cross-patterns',
      'No blank spaces; filler elements like flowers, birds, and fish symbolize fertility and good omen'
    ],
    craftCategories: ['Folk Paintings', 'Handmade Paper Art', 'Terracotta']
  },
  odisha: {
    id: 'odisha',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    primaryCraft: 'Pattachitra & Palm Leaf Engraving',
    heroImage: 'https://i0.wp.com/utkalikaodisha.com/wp-content/uploads/2022/10/Radha-krsihna-Dashavatara.jpg?fit=1200%2C1200&ssl=1',
    // heroImage: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Cloth-based scroll paintings steeped in devotion to Lord Jagannath.',
    description: 'Pattachitra is a traditional cloth-based scroll painting renowned for its intricate details, mythological narratives, and traditional organic colours. The art form originated around Raghurajpur, a world-famous heritage crafts village near Puri.',
    history: 'Associated directly with the cult of Lord Jagannath dating over a thousand years. During the ritual bathing period (Anabasara), when the temple deities are sequestered, these sacred paintings were worshipped in their place.',
    materialsAndTechniques: [
      'Specially treated cotton cloth stiffened with tamarind seed gum and chalk stone',
      'Organic mineral & conch-shell whites, lamp soot black, and herbal extracts',
      'Very fine hair brushes made from mouse or squirrel hair for crisp line work',
      'Protective natural lacquer coating made from wild tree resins'
    ],
    craftCategories: ['Cloth Scroll Paintings', 'Palm Leaf Inscription', 'Dhokra Brass']
  },
  rajasthan: {
    id: 'rajasthan',
    name: 'Rajasthan',
    capital: 'Jaipur',
    primaryCraft: 'Jaipur Blue Pottery',
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlijgnYr07gBNYMcKzYsl9BXxOrfHiFpOJKUToxCuguUjjwTSQzDWAoog&s=10' ,
    // heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Distinctive turquoise glazed pottery made without clay using Egyptian paste.',
    description: 'Jaipur Blue Pottery is widely recognized by its vibrant cobalt blue and turquoise glazes painted on a dough prepared from quartz stone powder, powdered glass, Fuller’s earth (Multani Mitti), and natural gum.',
    history: 'Introduced to Jaipur by Maharaja Sawai Ram Singh II in the 19th century from Turko-Persian traditions. It became the signature craft of the royal Pink City.',
    materialsAndTechniques: [
      'Clay-free formulation: ground quartz, glass powder, Katira gum, and sajjimitti',
      'Poured into open plaster-of-paris moulds, smoothed and air-dried',
      'Hand-painted with copper oxide (turquoise) and cobalt oxide (deep royal blue)',
      'Single firing in low-temperature wood-fired or electric kilns'
    ],
    craftCategories: ['Ceramics & Pottery', 'Block Printing', 'Woodcraft']
  },
  uttar_pradesh: {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    primaryCraft: 'Lucknowi Chikankari Embroidery',
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVvDtoSXafmk__sRfKcu0MIWiQ7M5fS6mMpJOvlAds87tPzklHmLSLqoMY&s=10',
    // heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Delicate, ethereal shadow-work hand embroidery born in royal Awadhi courts.',
    description: 'Chikankari is the delicate and subtle art of hand embroidery on muslin, organza, and fine cotton fabrics. Associated with Lucknow’s aristocratic Nawabi elegance, it features over 32 diverse stitch styles.',
    history: 'Patronized by Empress Noor Jahan in the Mughal era and nurtured by the Nawabs of Awadh, Chikankari transformed ordinary white thread into royal couture.',
    materialsAndTechniques: [
      'Wooden block printing with fugitive washable ink to transfer traditional motifs (jaali, phanda, tepchi)',
      'Intricate needlework executed exclusively by hand by women artisans in rural clusters',
      'Mastery of inverted shadow-work (Bakhiya) creating translucent depth on sheer fabrics',
      'Traditional washing in Gomti river waters and starching for crisp finish'
    ],
    craftCategories: ['Textile & Embroidery', 'Brassware', 'Wood Carving']
  },
  gujarat: {
    id: 'gujarat',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    primaryCraft: 'Patan Patola (Double Ikat)',
    heroImage: 'https://www.luxurionworld.com/cdn/shop/files/PS1P3CH423090505_Blue_Patan_Patola_Handloom_Double_Ikat_Saree_6.jpg?v=1694069953&width=3840',
    // heroImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Legendary double ikat silk weaving where warp and weft are individually tie-dyed.',
    description: 'Patan Patola is one of the most complex handloom weaving techniques in the world. It requires both warp and weft threads to be precisely resist-dyed before weaving so that the patterns align flawlessly on both sides of the fabric.',
    history: 'In the 12th century, King Kumarapala brought 700 Patola weaver families from Maharashtra to Patan. Today, only a handful of families in the Salvi lineage continue this royal tradition.',
    materialsAndTechniques: [
      'Pure mulberry silk yarn naturally dyed using pomegranate rind, catechu, and madder',
      'Mathematical grid planning and hand-tying micro sections with cotton thread',
      'Slanted hand-operated teakwood harness loom operated by two master weavers simultaneously',
      'Requires 6 months to 1 year of continuous work to complete a single heirloom sari'
    ],
    craftCategories: ['Handloom Weaving', 'Rogan Art', 'Kutch Embroidery']
  }
};

export const INITIAL_DEMO_PRODUCTS = [
  {
    id: 'prod-101',
    seller_id: 'artisan-sita-devi',    
    name: 'Tree of Life with Sun & Moon — Madhubani Canvas',
    price: 3450,
    state: 'Bihar',
    category: 'Folk Paintings',
    materials: 'Handmade Tussar silk paper, bamboo nibs, natural vegetable dyes (indigo, turmeric, soot)',
    quantity: 3,
    image_urls: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An authentic Mithila Kachni style painting portraying the cosmic Tree of Life flanked by Surya (Sun) and Chandra (Moon), symbolizing perpetual balance, vitality, and eternal nature.',
    story_text: 'I learned this sacred motif from my maternal grandmother in Ranti village when I was just 8 years old. We used to coat our courtyard with cow dung and paint during Chhath Puja. When I paint the Tree of Life, every leaf is a prayer for my family’s health and the longevity of our village’s soil. It takes nearly two weeks of steady handwork with bamboo twigs to ink every fine line.',
    story_video_url: '',
    story_document_url: '',
    available: true,
    craftsmanship_hours: 52,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    seller: {
      id: 'artisan-sita-devi',
      name: 'Sita Devi Mahasundari',
      state: 'Bihar',
      craft_specialization: 'Madhubani & Kohbar Art',
      bio: 'Master artisan from Jitwarpur, Madhubani. Practicing the heritage art form for over 32 years with an artisan cooperative of 24 women.',
      public_phone: DEMO_PHONE,
      whatsapp_number: DEMO_WA,
      show_phone: true,
      show_whatsapp: true,
      profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'prod-102',
    seller_id: 'artisan-rabindra-barik',
    name: 'Dasavatara & Krishna Lila Pattachitra Scroll',
    price: 6800,
    state: 'Odisha',
    category: 'Cloth Scroll Paintings',
    materials: 'Specially treated treated cotton canvas, conch shell white, tamarind seed paste, herbal pigments',
    quantity: 2,
    image_urls: [
      'https://cdn.shopify.com/s/files/1/0582/4007/3878/files/pattachitra-1.jpg?v=1635751688',
      // 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&auto=format&fit=crop&q=80',
      // 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Exquisite Pattachitra illustrating the ten divine incarnations of Vishnu surrounding the celestial Rasalila of Radha-Krishna. Finished with hand-ground stone pigments and natural lacquer glaze.',
    story_text: 'Our family has painted for Lord Jagannath’s temple for seven generations in Raghurajpur. Before touching brush to cloth, we perform a morning puja to invoke divine guidance. The conch-shell white takes three days of continuous mortar grinding. When someone hangs this Pattachitra, they carry the holy air of Puri into their home.',
    story_video_url: '',
    story_document_url: '',
    available: true,
    craftsmanship_hours: 90,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    seller: {
      id: 'artisan-rabindra-barik',
      name: 'Rabindra Barik',
      state: 'Odisha',
      craft_specialization: 'Heritage Pattachitra & Tussar Silk Scroll Painting',
      bio: 'Chitrakar from Raghurajpur Craft Village. Dedicated to maintaining century-old mineral pigment formulas without synthetic chemicals.',
      public_phone: '+919811223344',
      whatsapp_number: '919811223344',
      show_phone: true,
      show_whatsapp: true,
      // profile_image_url: 'https://cdn.shopify.com/s/files/1/0582/4007/3878/files/pattachitra-1.jpg?v=1635751688'
      profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'prod-103',
    seller_id: 'artisan-kripal-sharma',
    name: 'Royal Cobalt Blue Floral Urn with Lid',
    price: 2800,
    state: 'Rajasthan',
    category: 'Ceramics & Pottery',
    materials: 'Ground quartz powder, glass glaze, multani mitti, natural cobalt oxide',
    quantity: 5,
    image_urls: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlijgnYr07gBNYMcKzYsl9BXxOrfHiFpOJKUToxCuguUjjwTSQzDWAoog&s=10',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Handcrafted Jaipur Blue Pottery urn featuring hand-painted Persian Arabesque flourishes and blooming lotus motifs in signature cobalt and turquoise tones.',
    story_text: 'Blue pottery is unlike any other ceramic because we use zero river clay. My father revived our kiln near Sanganer in the 1980s. Each urn takes 18 separate steps—from mixing quartz dust to the delicate firing. You can feel the coolness of Rajasthan quartz whenever you touch it.',
    story_video_url: '',
    story_document_url: '',
    available: true,
    craftsmanship_hours: 34,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    seller: {
      id: 'artisan-kripal-sharma',
      name: 'Mohan Lal Kumhar',
      state: 'Rajasthan',
      craft_specialization: 'Jaipur Blue Pottery Master Craftsman',
      bio: 'State-awarded artisan studio based in Kot Jewar, Jaipur, crafting eco-friendly quartz pottery for over 25 years.',
      public_phone: '+919712345678',
      whatsapp_number: '919712345678',
      show_phone: true,
      show_whatsapp: true,
      profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'prod-104',
    seller_id: 'artisan-noor-jahan',
    name: 'Fine Hand-Embroidered Chikankari Kurta on Mulmul',
    price: 4200,
    state: 'Uttar Pradesh',
    category: 'Textile & Embroidery',
    materials: '100% fine cotton mulmul, silk thread, pure mother-of-pearl buttons',
    quantity: 4,
    image_urls: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVvDtoSXafmk__sRfKcu0MIWiQ7M5fS6mMpJOvlAds87tPzklHmLSLqoMY&s=10'
      // 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An ethereal pastel ivory Chikankari tunic featuring intricate Bakhiya (shadow work), Tepchi, and exquisite Jaali openwork hand-stitched by master craftswomen in Kakori.',
    story_text: 'Chikan embroidery is an exercise in patience and serenity. A single artisan works on this single piece over 28 afternoons under the winter sun. We sing Awadhi folk songs while working each knot. The shadow work on the reverse gives the subtle depth that machine embroidery can never recreate.',
    story_video_url: '',
    story_document_url: '',
    available: true,
    craftsmanship_hours: 76,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    seller: {
      id: 'artisan-noor-jahan',
      name: 'Farzana Begum',
      state: 'Uttar Pradesh',
      craft_specialization: 'Authentic Lucknowi Chikankari & Zardozi',
      bio: 'Community craft leader empowering 45 rural artisan sisters in Kakori, Lucknow through dignified needlework heritage.',
      public_phone: '+919833445566',
      whatsapp_number: '919833445566',
      show_phone: true,
      show_whatsapp: true,
      profile_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'prod-105',
    seller_id: 'artisan-salvi-bhai',
    name: 'Navratna Chhabdi Double Ikat Patola Silk Stole',
    price: 18500,
    state: 'Gujarat',
    category: 'Handloom Weaving',
    materials: '100% Mulberry silk warp and weft, vegetable madder and turmeric dyes',
    quantity: 1,
    image_urls: [
      'https://www.luxurionworld.com/cdn/shop/files/PS1P3CH423090505_Blue_Patan_Patola_Handloom_Double_Ikat_Saree_6.jpg?v=1694069953&width=3840',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Authentic Patan Patola silk stole adorned with geometric elephant (Kunjar), parrot (Popat), and nine jewel floral baskets. Perfectly reversible with identical color brilliance on both sides.',
    story_text: 'There is a Gujarati proverb: "Padi Patole Bhat, Phate Pan Fite Nahi" (The design laid in Patola will outlast the fabric itself; it may tear with age, but its color never fades). We tie-dye every single silk thread before it ever touches the loom. It took my brother and me 75 days to weave this stole. It is not just clothing; it is geometry and devotion woven into silk.',
    story_video_url: '',
    story_document_url: '',
    available: true,
    craftsmanship_hours: 320,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    seller: {
      id: 'artisan-salvi-bhai',
      name: 'Ketan Salvi',
      state: 'Gujarat',
      craft_specialization: 'Patan Double Ikat Patola Master Weaver',
      bio: 'Direct descendant of the royal Salvi weavers of Patan, continuing the 900-year-old double ikat technique passed down through generations.',
      public_phone: '+919825012345',
      whatsapp_number: '919825012345',
      show_phone: true,
      show_whatsapp: true,
      profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  }
];
