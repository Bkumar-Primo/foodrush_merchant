import type { MenuItem, MenuItemAddon, MenuItemVariant } from "@/types";

type SeedCategory = {
  category: string;
  subcategory: string;
  foodType: MenuItem["foodType"];
  emoji: string;
  names: string[];
  basePrice: number;
};

const SEED_CATEGORIES: SeedCategory[] = [
  {
    category: "Punjabi Breakfast",
    subcategory: "Morning Favorites",
    foodType: "veg",
    emoji: "🌅",
    basePrice: 89,
    names: [
      "Aloo Paratha with Curd",
      "Gobi Paratha Plate",
      "Paneer Paratha Special",
      "Methi Thepla with Achar",
      "Amritsari Kulcha Chole",
      "Poha with Peanuts",
      "Chole Bhature [2 Pcs]",
      "Bedmi Puri with Aloo Sabzi",
      "Masala Chana Toast",
      "Desi Ghee Poha",
    ],
  },
  {
    category: "Starters & Snacks",
    subcategory: "Veg Appetizers",
    foodType: "veg",
    emoji: "🥗",
    basePrice: 129,
    names: [
      "Paneer Pakora",
      "Aloo Samosa [2 Pcs]",
      "Bread Pakora",
      "Moong Dal Pakoda",
      "Paneer Tikka",
      "Hara Bhara Kebab",
      "Dahi Bhalla Chaat",
      "Papdi Chaat",
      "Aloo Tikki Chaat",
      "Paneer 65",
    ],
  },
  {
    category: "Paneer Specials",
    subcategory: "Cottage Cheese Curries",
    foodType: "veg",
    emoji: "🧀",
    basePrice: 199,
    names: [
      "Paneer Butter Masala",
      "Kadai Paneer",
      "Palak Paneer",
      "Shahi Paneer",
      "Malai Kofta",
      "Paneer Lababdar",
      "Mattar Paneer",
      "Paneer Bhurji",
      "Paneer Do Pyaza",
      "Paneer Tikka Masala",
    ],
  },
  {
    category: "Dal & Kadhi",
    subcategory: "Lentils & Kadhi",
    foodType: "veg",
    emoji: "🍲",
    basePrice: 149,
    names: [
      "Dal Makhani",
      "Dal Tadka Yellow",
      "Amritsari Dal Fry",
      "Chana Dal Punjabi Style",
      "Moong Dal Tadka",
      "Punjabi Kadhi Pakora",
      "Dal Panchmel",
      "Rajma Masala",
      "Dal Amritsari",
      "Mixed Dal Handi",
    ],
  },
  {
    category: "Veg Curries",
    subcategory: "Vegetable Gravies",
    foodType: "veg",
    emoji: "🍛",
    basePrice: 169,
    names: [
      "Mix Veg Handi",
      "Aloo Gobi Masala",
      "Bhindi Masala",
      "Baingan Bharta",
      "Kadai Mushroom",
      "Methi Malai Matar",
      "Dum Aloo Punjabi",
      "Sarson Ka Saag",
      "Kathal Masala Curry",
      "Chole Masala",
    ],
  },
  {
    category: "Chicken Curries",
    subcategory: "Murgh Gravies",
    foodType: "non-veg",
    emoji: "🍗",
    basePrice: 229,
    names: [
      "Butter Chicken",
      "Punjab Chicken Curry",
      "Chicken Tikka Masala",
      "Kadai Chicken",
      "Chicken Rara",
      "Dhaba Style Chicken",
      "Chicken Do Pyaza",
      "Lemon Chicken Punjabi",
      "Chicken Saagwala",
      "Amritsari Chicken Masala",
    ],
  },
  {
    category: "Mutton & Lamb",
    subcategory: "Gosht Specials",
    foodType: "non-veg",
    emoji: "🥩",
    basePrice: 299,
    names: [
      "Punjabi Mutton Curry",
      "Keema Matar",
      "Rogan Josh Punjabi",
      "Mutton Rara",
      "Lamb Kadai",
      "Mutton Keema Pav",
      "Bhuna Gosht",
      "Nihari Slow Cooked",
      "Mutton Korma",
      "Saag Gosht",
    ],
  },
  {
    category: "Tandoor Specials",
    subcategory: "Veg Tandoor",
    foodType: "veg",
    emoji: "🔥",
    basePrice: 179,
    names: [
      "Tandoori Paneer Tikka",
      "Malai Tikka",
      "Achari Paneer Tikka",
      "Tandoori Mushroom",
      "Paneer Seekh Kebab",
    ],
  },
  {
    category: "Tandoor Specials",
    subcategory: "Non-Veg Tandoor",
    foodType: "non-veg",
    emoji: "🔥",
    basePrice: 249,
    names: [
      "Tandoori Chicken Half",
      "Chicken Seekh Kebab",
      "Lahori Chicken Tikka",
      "Tandoori Chicken Wings",
      "Mutton Seekh Kebab",
    ],
  },
  {
    category: "Breads & Paratha",
    subcategory: "Tandoor Fresh",
    foodType: "veg",
    emoji: "🫓",
    basePrice: 35,
    names: [
      "Butter Naan",
      "Garlic Naan",
      "Tandoori Roti",
      "Laccha Paratha",
      "Aloo Naan",
      "Paneer Kulcha",
      "Missi Roti",
      "Roomali Roti",
      "Makki Di Roti",
      "Stuffed Mirch Paratha",
    ],
  },
  {
    category: "Rice & Pulao",
    subcategory: "Steamed & Pulao",
    foodType: "veg",
    emoji: "🍚",
    basePrice: 139,
    names: [
      "Jeera Rice",
      "Veg Pulao",
      "Peas Pulao",
      "Lemon Rice",
      "Kashmiri Pulao",
      "Steamed Basmati Rice",
      "Khichdi Tadka",
      "Curd Rice Punjabi",
      "Tomato Rice",
      "Ghee Rice",
    ],
  },
  {
    category: "Biryani",
    subcategory: "Veg & Egg Biryani",
    foodType: "veg",
    emoji: "🍚",
    basePrice: 219,
    names: [
      "Veg Dum Biryani",
      "Paneer Biryani",
      "Mushroom Biryani",
      "Egg Biryani Bowl",
      "Veg Handi Biryani",
    ],
  },
  {
    category: "Biryani",
    subcategory: "Non-Veg Biryani",
    foodType: "non-veg",
    emoji: "🍚",
    basePrice: 269,
    names: [
      "Chicken Dum Biryani",
      "Mutton Biryani Punjabi",
      "Amritsari Biryani",
      "Boneless Chicken Biryani",
      "Keema Biryani",
    ],
  },
  {
    category: "Chole & Rajma",
    subcategory: "Punjabi Legumes",
    foodType: "veg",
    emoji: "🫘",
    basePrice: 149,
    names: [
      "Rajma Chawal Combo",
      "Chole Rice Bowl",
      "Rajma Masala Full",
      "Chole Kulche",
      "Rajma Garlic Naan Combo",
      "Chole Puri Plate",
      "Rajma Paratha Roll",
      "Chana Masala Dry",
      "Lobia Curry",
      "Kala Chana Curry",
    ],
  },
  {
    category: "Rolls & Street Food",
    subcategory: "Veg Rolls",
    foodType: "veg",
    emoji: "🌯",
    basePrice: 129,
    names: [
      "Paneer Tikka Roll",
      "Aloo Tikki Roll",
      "Chole Kulcha Roll",
      "Paneer Kathi Roll",
      "Veg Shawarma Roll",
    ],
  },
  {
    category: "Rolls & Street Food",
    subcategory: "Non-Veg Rolls",
    foodType: "non-veg",
    emoji: "🌯",
    basePrice: 159,
    names: [
      "Chicken Kathi Roll",
      "Mutton Seekh Roll",
      "Egg Roll Double",
      "Grilled Chicken Wrap",
      "Kebab Roll Supreme",
    ],
  },
  {
    category: "Lassi & Beverages",
    subcategory: "Drinks & Shakes",
    foodType: "veg",
    emoji: "🥤",
    basePrice: 59,
    names: [
      "Sweet Lassi",
      "Mango Lassi",
      "Salted Lassi",
      "Rose Lassi",
      "Masala Chai",
      "Cold Coffee Frappe",
      "Fresh Lime Soda",
      "Mint Mojito Mocktail",
      "Buttermilk Chaas",
      "Kesar Badam Milk",
    ],
  },
  {
    category: "Punjabi Sweets",
    subcategory: "Mithai & Desserts",
    foodType: "veg",
    emoji: "🍮",
    basePrice: 79,
    names: [
      "Gulab Jamun [2 Pcs]",
      "Rasmalai [2 Pcs]",
      "Kheer Bowl",
      "Jalebi Rabri Plate",
      "Gajar Halwa Seasonal",
      "Pinni [2 Pcs]",
      "Phirni Kesar",
      "Lassi Malai Kulfi",
      "Ghevar Rajasthani",
      "Besan Ladoo [2 Pcs]",
    ],
  },
];

const PORTION_VARIANT: MenuItemVariant = {
  id: "var_portion",
  name: "Portion Size",
  options: [
    { id: "opt_regular", name: "Regular", price: 0 },
    { id: "opt_large", name: "Large", price: 60 },
    { id: "opt_family", name: "Family", price: 120 },
  ],
};

const SPICE_VARIANT: MenuItemVariant = {
  id: "var_spice",
  name: "Spice Level",
  options: [
    { id: "opt_mild", name: "Mild", price: 0 },
    { id: "opt_medium", name: "Medium", price: 0 },
    { id: "opt_spicy", name: "Spicy", price: 0 },
  ],
};

const COMMON_ADDONS: MenuItemAddon[] = [
  { id: "add_extra_ghee", name: "Extra Ghee", price: 20, inStock: true },
  { id: "add_raita", name: "Boondi Raita", price: 35, inStock: true },
  { id: "add_salad", name: "Fresh Green Salad", price: 25, inStock: true },
  { id: "add_papad", name: "Roasted Papad", price: 15, inStock: true },
];

function buildDescription(name: string, category: string, subcategory: string): string {
  return `Freshly prepared ${name.toLowerCase()} from our ${subcategory} selection. A Punjabi favourite in ${category}, made with homestyle spices and quality ingredients. Best enjoyed hot.`;
}

/** Generates 150 fully-populated Punjabi menu items for Firestore seeding. */
export function generateInventorySeedData(): MenuItem[] {
  const items: MenuItem[] = [];
  let index = 0;

  for (const group of SEED_CATEGORIES) {
    for (const name of group.names) {
      index += 1;
      const id = `item_${String(index).padStart(3, "0")}`;
      const price = group.basePrice + (index % 5) * 10;
      const customisable = index % 3 !== 0;
      const inStock = index % 17 !== 0;

      const item: MenuItem = {
        id,
        name,
        description: buildDescription(name, group.category, group.subcategory),
        price,
        foodType: group.foodType,
        serviceType: "Delivery",
        category: group.category,
        subcategory: group.subcategory,
        inStock,
        image: "",
        packagingCharge: 10 + (index % 4) * 5,
        customisable,
      };

      if (customisable) {
        item.variants = index % 2 === 0 ? [PORTION_VARIANT] : [PORTION_VARIANT, SPICE_VARIANT];
        item.addons = COMMON_ADDONS.slice(0, 2 + (index % 3));
      }

      if (!inStock) {
        item.backInStockTime = Date.now() + 3600000 * (2 + (index % 6));
      }

      items.push(item);
    }
  }

  return items;
}

export const INVENTORY_SEED_COUNT = generateInventorySeedData().length;
