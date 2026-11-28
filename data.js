/* =====================================================================
   UNBOXED by terdòô  —  data.js
   THIS IS THE ONLY FILE YOU NORMALLY NEED TO EDIT.
   (Products, prices, sizes, phone number, opening hours, reviews.)

   Keep this file in the same folder as index.html.
   Be careful to keep the quote marks " " and commas , exactly as they are.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. BUSINESS SETTINGS
   --------------------------------------------------------------------- */
const SETTINGS = {

  // WhatsApp number in international format: country code, no + and no leading 0
  // 0906 555 1118  ->  2349065551118
  whatsappNumber: "2349065551118",

  // How the phone number is shown on the page
  phoneDisplay: "0906 555 1118",

  // Instagram username (without the @)
  instagramHandle: "unboxed_by_terdoo",

  // Shown in "Visit us" and used for the Get directions button
  address: "Salem Lekki, Lekki, Lagos, Nigeria",

  // Opening hours: ["days", "time"]  — PLEASE CHECK THESE ARE CORRECT
  hours: [
    ["Monday – Saturday", "10am – 7pm"],
    ["Sunday", "By appointment"]
  ],

  // The three numbers under the main heading: ["big text", "small label"]
  // (Instagram numbers from the profile in September 2026 — update when you like)
  stats: [
    ["10.4K+", "Instagram posts"],
    ["7,580", "Instagram followers"],
    ["Nationwide", "Delivery"]
  ],

  // A banner across the top of the page (for sales etc.).
  // Leave as "" for no banner.   Example: "50ML SALES — limited pieces available."
  announcement: "50ml sales - limited prices available",

  // Folder that holds your product photos (the logo and hero photo are set in index.html)
  imageFolder: "images/",

  // While you are still setting up: a missing photo shows its file path so you can
  // see what is wrong. Change to false when everything works.
  showMissingPhotoPath: true,

  // The filter buttons above the products. They match what you type in the
  // Size column below (so a product with size "50ml" appears under the 50ml button).
  // Spaces and capitals don't matter: "100 ML" counts as 100ml.
  filterSizes: ["50ml", "100ml"],

  // How many products appear before the "Load more" button
  batchSize: 30
};


/* ---------------------------------------------------------------------
   2. YOUR PRODUCTS  —  ONE LINE PER PRODUCT

       photo file | Name | Size | Price | Old price
       ---------- | ---- | ---- | ----- | ---------

   Example:   12.jpg | Your Perfume Name | 100ml | 45000 |

   RULES
   - Photo file: the file name inside your images folder (1.jpg, 2.jpg ...).
   - Name, Size, Price: write them between the | symbols. Any can be left empty.
   - Size: type the ml, like 50ml or 100ml. The 50ml / 100ml filter buttons
     use this. (Other sizes still show under "All".)
   - Price: numbers only. 45000 is fine; so is 45,000 or ₦45,000.
   - Old price (optional): fill it in to show a crossed-out price (a sale).
   - To HIDE a product: put a # at the very start of its line.
   - To REMOVE a product: delete its line.  To ADD one: add a new line.
   - Do not use the | symbol or the ` symbol inside a name.
   - Products appear in the same order as the lines below.
   --------------------------------------------------------------------- */
const PRODUCT_LIST = `
    2.jpg | 212 VIP Black |  |30000  | 
    4.jpg | Bvlgari Man In Black |  | 30000 | 
    5.jpg | Burberry Touch for Women |  | 30000 | 
    6.jpg | Dolce & Gabbana K |  | 30000 | 
    7.jpg | Narciso Rodriguez for Her |  | 30000 | 
    8.jpg | Diesel Bad |  | 40000 | 
    9.jpg | Al Haramain Amber Oud |  | 45000 | 
    10.jpg | Marc Jacobs Decadence |  | 35000 | 
    11.jpg | Jean Paul Gaultier Scandal |  | 35000 | 
    12.jpg | Al Haramain Amber Oud Dubai Night |  | 45000 | 
    13.jpg | Hugo Boss Hugo (red bottle) |  | 30000 | 
    14.jpg | Hugo Boss Femme |  | 30000 | 
    15.jpg | Jean Paul Gaultier Scandal |  | 35000 | 
    16.jpg | Michael Kors Gorgeous |  | 30000 | 
    17.jpg | Armaf Club De Nuit Precieux I |  | 35000 | 
    18.jpg | Lancôme La Vie Est Belle |  | 30000 | 
    19.jpg | Armani Code Elixir |  | 40000 | 
    20.jpg | Giorgio Armani Si |  | 35000 | 
    21.jpg | Just Cavalli |  | 35000 | 
    22.jpg | Marc Jacobs Daisy Love |  | 30000 | 
    23.jpg | Emporio Armani Diamonds |  | 30000 | 
    24.jpg | Calvin Klein Eternity For Men Aromatic Essence |  | 30000 | 
    25.jpg | Versace Crystal Noir |  | 35000 | 
    26.jpg | Versace Dylan Turquoise Pour Femme |  | 30000 | 
    27.jpg | L'Eau Kenzo Pour Femme |  | 30000 | 
    28.jpg | Jimmy Choo Flash |  | 30000 | 
    29.jpg | Gucci Bamboo |  | 30000 | 
    30.jpg | Elie Saab Girl of Now Forever |  | 30000 | 
    31.jpg | Bvlgari Man Wood Neroli |  | 30000 | 
    32.jpg | Dior Sauvage |  | 35000 | 
    33.jpg | Reefer 2 Hair & Body |  | 40000 | 
    34.jpg | Calvin Klein Women |  | 30000 | 
    35.jpg | Giorgio Armani Si Passione |  | 35000 | 
    36.jpg | Dolce & Gabbana Q |  | 30000 | 
    37.jpg | Tom Ford Rose Prick 50ml |  | 60000 | 
    38.jpg | Montblanc Lady Emblem |  | 30000 | 
    39.jpg |  |  |  | 
    40.jpg | Lancôme Idôle |  | 30000 | 
    41.jpg | Montblanc Explorer |  | 30000 | 
    42.jpg | Bleu de Chanel Eau de Parfum |  | 35000 | 
    43.jpg | Lancôme Trésor |  | 30000 | 
    44.jpg | Gucci Flora Gorgeous Jasmine |  | 35000 | 
    45.jpg | Dolce & Gabbana The Only One |  | 35000 | 
    46.jpg | Sunnamusk Amber Rose Original |  | 30000 | 
    47.jpg | Dolce & Gabbana Light Blue Pour Homme Eau de Toilette |  | 35000 | 
    48.jpg | Carolina Herrera Good Girl |  | 30000 | 
    49.jpg | Davidoff Cool Water |  | 30000 | 
    50.jpg | Chanel Allure Homme Sport Eau Extrême |  | 35000 | 
    51.jpg | Givenchy Irresistible |  | 35000 | 
    52.jpg | Lancôme La Vie Est Belle |  | 30000 | 
    53.jpg | Karl Lagerfeld Bois de Yuzu |  | 35000 | 
    54.jpg | Victoria's Secret Bombshell Intense |  | 35000 | 
    55.jpg | Moschino Forever |  |  30000| 
    56.jpg | Azzaro Wanted |  | 30000 | 
    57.jpg | Ralph Lauren Polo Red |  | 30000 | 
    58.jpg | Romance Night by Khajal |  | 45000 | 
    59.jpg | Bvlgari Goldea The Roman Night Absolute |  | 35000 | 
    60.jpg | Essenza Man Elixir by Flame |  | 30000 | 
    61.jpg | Noir by Khajal |  | 45000 | 
    62.jpg | Aesop Miraceti Eau de Parfum |  | 40000 | 
    63.jpg | Narciso Rodriguez All Of Me |  | 30000 | 
    64.jpg | Emporio Armani Stronger With You |  | 40000 | 
    65.jpg | Jean Paul Gaultier Scandal (purple crown) |  | 35000 | 
    66.jpg | Jean Paul Gaultier Scandal (pink) |  | 35000 | 
    67.jpg | Diesel Only The Brave Tattoo |  | 30000 | 
    68.jpg | Giorgio Armani My Way |  | 35000 | 
    69.jpg | Guess 1981 |  | 40000 | 
    70.jpg |  Marc Jacobs Daisy Love Eau So Sweet|  | 30000 | 
    71.jpg | Jimmy Choo (red faceted) |  | 30000 | 
    72.jpg | Jean Paul Gaultier Le Male (blue torso) |  | 35000 | 
    73.jpg | DKNY Be Delicious Fresh Blossom |  | 30000 | 
    74.jpg | Paco Rabanne Pure XS |  | 30000 | 
    75.jpg | Armani Code Colonia |  | 30000 | 
    76.jpg | Elizabeth Arden 5th Avenue |  | 30000 | 
    77.jpg | Yves Saint Laurent MYSLF Eau de Parfum |  | 35000 | 
    78.jpg | Elizabeth Arden 5th Avenue NYC Downtown |  | 30000 | 
    79.jpg | Escada Magnetism for Women |  | 30000 | 
    80.jpg | Calvin Klein Eternity Moment |  | 30000 | 
    81.jpg | Afnan Supremacy Collector's Edition |  | 35000 | 
    82.jpg | Giorgio Armani My Way |  | 35000 | 
    83.jpg | Cerruti 1881 Femme |  | 30000 | 
    84.jpg | Hugo Boss Femme |  | 30000 | 
`;


/* ---------------------------------------------------------------------
   3. CUSTOMER REVIEWS  (optional)

   Only add REAL reviews from real customers, with their permission.
   While this list is empty, the Reviews section sends visitors to your
   Instagram instead. Format (copy the block, one per review):

     { name: "First name + initial", area: "Lekki", stars: 5, text: "What they said." },
   --------------------------------------------------------------------- */
const REVIEWS = [
  { name: "", area: "", stars: 4, text: "I love it. Thank you so much. Been following u for a while now." },

  { name: "", area: "", stars: 5, text: "I love it. Don’t worry, you’ve got yourself a new and loyal customer." },

  { name: "", area: "", stars: 5, text: "Smells amazing. Best blind buy for fresh scent ever! Awesome." },

  { name: "", area: "", stars: 5, text: "Finally took delivery of the Queen of silk. My God. It is so beautiful. I’m so glad I was able to get it at such an affordable rate from you. Thank you for the professional service as usual. Feel free to post this review." },

  { name: "", area: "", stars: 5, text: "All of your perfume are so hard to stop smelling from my cloths after wash ooo. My dry cleaner just ask me just now that how do I use my perfume that it’s so hard to stop smelling after washing my cloths. This 50ml are great and it’s just too perfect." },

  
];
