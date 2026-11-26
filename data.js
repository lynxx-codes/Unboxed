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
  announcement: "",

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
  batchSize: 24
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
    1.jpg |  |  |  | 
    2.jpg | 212 VIP Black |  |30000  | 
    3.jpg |  |  |  | 
    4.jpg | Bvlgari Man In Black |  | 30000 | 
    5.jpg | Burberry Touch for Women |  | 30000 | 
    6.jpg |  |  |  | 
    7.jpg |  |  |  | 
    8.jpg |  |  |  | 
    9.jpg |  |  |  | 
    10.jpg |  |  |  | 
    11.jpg |  |  |  | 
    12.jpg |  |  |  | 
    13.jpg |  |  |  | 
    14.jpg |  |  |  | 
    15.jpg |  |  |  | 
    16.jpg |  |  |  | 
    17.jpg |  |  |  | 
    18.jpg |  |  |  | 
    19.jpg |  |  |  | 
    20.jpg |  |  |  | 
    21.jpg |  |  |  | 
    22.jpg |  |  |  | 
    23.jpg |  |  |  | 
    24.jpg |  |  |  | 
    25.jpg |  |  |  | 
    26.jpg |  |  |  | 
    27.jpg |  |  |  | 
    28.jpg |  |  |  | 
    29.jpg |  |  |  | 
    30.jpg |  |  |  | 
    31.jpg |  |  |  | 
    32.jpg |  |  |  | 
    33.jpg |  |  |  | 
    34.jpg |  |  |  | 
    35.jpg |  |  |  | 
    36.jpg |  |  |  | 
    37.jpg |  |  |  | 
    38.jpg |  |  |  | 
    39.jpg |  |  |  | 
    40.jpg |  |  |  | 
    41.jpg |  |  |  | 
    42.jpg |  |  |  | 
    43.jpg |  |  |  | 
    44.jpg |  |  |  | 
    45.jpg |  |  |  | 
    46.jpg |  |  |  | 
    47.jpg |  |  |  | 
    48.jpg |  |  |  | 
    49.jpg |  |  |  | 
    50.jpg |  |  |  | 
    51.jpg |  |  |  | 
    52.jpg |  |  |  | 
    53.jpg |  |  |  | 
    54.jpg |  |  |  | 
    55.jpg |  |  |  | 
    56.jpg |  |  |  | 
    57.jpg |  |  |  | 
    58.jpg |  |  |  | 
    59.jpg |  |  |  | 
    60.jpg |  |  |  | 
    61.jpg |  |  |  | 
    62.jpg |  |  |  | 
    63.jpg |  |  |  | 
    64.jpg |  |  |  | 
    65.jpg |  |  |  | 
    66.jpg |  |  |  | 
    67.jpg |  |  |  | 
    68.jpg |  |  |  | 
    69.jpg |  |  |  | 
    70.jpg |  |  |  | 
    71.jpg |  |  |  | 
    72.jpg |  |  |  | 
    73.jpg |  |  |  | 
    74.jpg |  |  |  | 
    75.jpg |  |  |  | 
    76.jpg |  |  |  | 
    77.jpg |  |  |  | 
    78.jpg |  |  |  | 
    79.jpg |  |  |  | 
    80.jpg |  |  |  | 
    81.jpg |  |  |  | 
    82.jpg |  |  |  | 
    83.jpg |  |  |  | 
    84.jpg |  |  |  | 
`;


/* ---------------------------------------------------------------------
   3. CUSTOMER REVIEWS  (optional)

   Only add REAL reviews from real customers, with their permission.
   While this list is empty, the Reviews section sends visitors to your
   Instagram instead. Format (copy the block, one per review):

     { name: "First name + initial", area: "Lekki", stars: 5, text: "What they said." },
   --------------------------------------------------------------------- */
const REVIEWS = [
];
