// lib/categories.ts - UPDATED WITH ALL CATEGORIES
import { CategoryConfig } from '@/types/category'

// Subcategory-specific configurations for ALL categories
const subcategoryConfigs: { [key: string]: { [key: string]: any } } = {
  // ELECTRONICS SUBCATEGORIES (existing - keep as is)
  'Electronics': {
    'Phones': {
      specifications: [
        { fieldName: 'screenSize', label: 'Screen Size', type: 'select', required: false,
          options: ['< 5"', '5.1 - 5.5"', '5.6 - 6"', '6.1 - 6.5"', '6.6 - 6.8"', '> 6.8"'] },
        { fieldName: 'ram', label: 'RAM', type: 'select', required: false,
          options: ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB'] },
        { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
          options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'] },
        { fieldName: 'battery', label: 'Battery', type: 'text', required: false, unit: 'mAh' },
        { fieldName: 'camera', label: 'Camera', type: 'text', required: false, unit: 'MP' },
        { fieldName: 'simType', label: 'SIM Type', type: 'select', required: false,
          options: ['Single SIM', 'Dual SIM', 'eSIM'] },
        { fieldName: 'network', label: 'Network', type: 'select', required: false,
          options: ['2G', '3G', '4G', '5G'] },
      ],
      filters: [
        { fieldName: 'screenSize', label: 'Screen Size', type: 'checkbox', required: false },
        { fieldName: 'ram', label: 'RAM', type: 'checkbox', required: false },
        { fieldName: 'storage', label: 'Storage', type: 'checkbox', required: false },
        { fieldName: 'simType', label: 'SIM Type', type: 'checkbox', required: false },
      ]
    },
    'Computers': {
      specifications: [
        { fieldName: 'screenSize', label: 'Screen Size', type: 'select', required: false,
          options: ['11"', '13"', '14"', '15"', '16"', '17"'] },
        { fieldName: 'ram', label: 'RAM', type: 'select', required: false,
          options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
        { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
          options: ['128GB', '256GB', '512GB', '1TB', '2TB'] },
        { fieldName: 'processor', label: 'Processor', type: 'select', required: false,
          options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'] },
        { fieldName: 'graphics', label: 'Graphics', type: 'text', required: false },
        { fieldName: 'operatingSystem', label: 'OS', type: 'select', required: false,
          options: ['Windows', 'macOS', 'Linux', 'Chrome OS'] },
      ],
      filters: [
        { fieldName: 'screenSize', label: 'Screen Size', type: 'checkbox', required: false },
        { fieldName: 'ram', label: 'RAM', type: 'checkbox', required: false },
        { fieldName: 'storage', label: 'Storage', type: 'checkbox', required: false },
        { fieldName: 'processor', label: 'Processor', type: 'checkbox', required: false },
      ]
    },
    'Cameras': {
      specifications: [
        { fieldName: 'cameraType', label: 'Camera Type', type: 'select', required: false,
          options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Film Camera'] },
        { fieldName: 'megapixels', label: 'Megapixels', type: 'text', required: false, unit: 'MP' },
        { fieldName: 'lensMount', label: 'Lens Mount', type: 'text', required: false },
        { fieldName: 'sensorSize', label: 'Sensor Size', type: 'select', required: false,
          options: ['Full Frame', 'APS-C', 'Micro Four Thirds', '1"'] },
      ],
      filters: [
        { fieldName: 'cameraType', label: 'Camera Type', type: 'checkbox', required: false },
        { fieldName: 'sensorSize', label: 'Sensor Size', type: 'checkbox', required: false },
      ]
    },
    'TV & Audio': {
      specifications: [
        { fieldName: 'screenSize', label: 'Screen Size', type: 'select', required: false,
          options: ['32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"'] },
        { fieldName: 'displayType', label: 'Display Type', type: 'select', required: false,
          options: ['LED', 'OLED', 'QLED', '4K UHD', '8K UHD'] },
        { fieldName: 'smartTV', label: 'Smart TV', type: 'select', required: false,
          options: ['Yes', 'No'] },
      ],
      filters: [
        { fieldName: 'screenSize', label: 'Screen Size', type: 'checkbox', required: false },
        { fieldName: 'displayType', label: 'Display Type', type: 'checkbox', required: false },
      ]
    },
    'Gaming': {
      specifications: [
        { fieldName: 'consoleType', label: 'Console Type', type: 'select', required: false,
          options: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Gaming PC'] },
        { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
          options: ['500GB', '1TB', '2TB'] },
      ],
      filters: [
        { fieldName: 'consoleType', label: 'Console Type', type: 'checkbox', required: false },
      ]
    }
  },

  // In your category configurations - KEEP ORIGINAL FIELD NAMES
'Clothing': {
  'Men': {
    specifications: [
      { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
        options: ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater', 'Underwear', 'Suit', 'Shorts'] },
      { fieldName: 'size', label: 'Size', type: 'select', required: true,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
    ],
    filters: [
      { fieldName: 'clothingType', label: 'Clothing Type', type: 'checkbox', required: false },
      { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
    ]
  },
  'Women': {
    specifications: [
      { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
        options: ['Dress', 'Skirt', 'Blouse', 'T-Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater'] },
      { fieldName: 'size', label: 'Size', type: 'select', required: true,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
    ],
    filters: [
      { fieldName: 'clothingType', label: 'Clothing Type', type: 'checkbox', required: false },
      { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
    ]
  },
  'Shoes': {
    specifications: [
      { fieldName: 'shoeType', label: 'Shoe Type', type: 'select', required: true,
        options: ['Sneakers', 'Boots', 'Sandals', 'Formal', 'Sports', 'Casual'] },
      { fieldName: 'size', label: 'Size', type: 'select', required: true,
        options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] },
    ],
    filters: [
      { fieldName: 'shoeType', label: 'Shoe Type', type: 'checkbox', required: false },
      { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
    ]
  }
},
  // HOME & GARDEN SUBCATEGORIES (existing - keep as is)
  'Home & Garden': {
    'Furniture': {
      specifications: [
        { fieldName: 'furnitureType', label: 'Furniture Type', type: 'select', required: true,
          options: ['Sofa', 'Bed', 'Table', 'Chair', 'Cabinet', 'Wardrobe', 'Shelf'] },
        { fieldName: 'homeMaterial', label: 'Material', type: 'select', required: false,
          options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Ceramic'] },
      ],
      filters: [
        { fieldName: 'furnitureType', label: 'Furniture Type', type: 'checkbox', required: false },
        { fieldName: 'homeMaterial', label: 'Material', type: 'checkbox', required: false },
      ]
    },
    'Decor': {
      specifications: [
        { fieldName: 'decorType', label: 'Decor Type', type: 'select', required: true,
          options: ['Wall Art', 'Vases', 'Candles', 'Mirrors', 'Clocks', 'Rugs'] },
        { fieldName: 'style', label: 'Style', type: 'select', required: false,
          options: ['Modern', 'Traditional', 'Minimalist', 'Bohemian'] },
      ],
      filters: [
        { fieldName: 'decorType', label: 'Decor Type', type: 'checkbox', required: false },
        { fieldName: 'style', label: 'Style', type: 'checkbox', required: false },
      ]
    },
    'Kitchenware': {
      specifications: [
        { fieldName: 'kitchenwareType', label: 'Kitchenware Type', type: 'select', required: true,
          options: ['Cookware', 'Cutlery', 'Appliances', 'Storage', 'Serveware'] },
        { fieldName: 'material', label: 'Material', type: 'select', required: false,
          options: ['Stainless Steel', 'Ceramic', 'Glass', 'Plastic', 'Wood'] },
      ],
      filters: [
        { fieldName: 'kitchenwareType', label: 'Kitchenware Type', type: 'checkbox', required: false },
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
      ]
    },
    'Garden': {
      specifications: [
        { fieldName: 'gardenType', label: 'Garden Type', type: 'select', required: true,
          options: ['Tools', 'Plants', 'Furniture', 'Decor', 'Lighting'] },
        { fieldName: 'material', label: 'Material', type: 'select', required: false,
          options: ['Metal', 'Wood', 'Plastic', 'Ceramic'] },
      ],
      filters: [
        { fieldName: 'gardenType', label: 'Garden Type', type: 'checkbox', required: false },
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
      ]
    }
  },

  // BEAUTY & HEALTH SUBCATEGORIES - COMPLETE VERSION
  'Beauty & Health': {
    'Skincare': {
      specifications: [
        { fieldName: 'skinType', label: 'Skin Type', type: 'select', required: false,
          options: ['All Skin Types', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
        { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
          options: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Mask', 'Toner'] },
      ],
      filters: [
        { fieldName: 'skinType', label: 'Skin Type', type: 'checkbox', required: false },
        { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
      ]
    },
    'Makeup': {
      specifications: [
        { fieldName: 'makeupType', label: 'Makeup Type', type: 'select', required: true,
          options: ['Foundation', 'Lipstick', 'Eyeshadow', 'Mascara', 'Blush', 'Concealer'] },
        { fieldName: 'shade', label: 'Shade', type: 'text', required: false },
      ],
      filters: [
        { fieldName: 'makeupType', label: 'Makeup Type', type: 'checkbox', required: false },
      ]
    },
    'Hair Care': {
      specifications: [
        { fieldName: 'hairType', label: 'Hair Type', type: 'select', required: false,
          options: ['All Hair Types', 'Dry', 'Oily', 'Curly', 'Straight', 'Color-Treated'] },
        { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
          options: ['Shampoo', 'Conditioner', 'Treatment', 'Styling', 'Color'] },
      ],
      filters: [
        { fieldName: 'hairType', label: 'Hair Type', type: 'checkbox', required: false },
        { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
      ]
    },
    'Fragrance': {
      specifications: [
        { fieldName: 'fragranceType', label: 'Fragrance Type', type: 'select', required: true,
          options: ['Perfume', 'Cologne', 'Body Spray', 'Essential Oil'] },
        { fieldName: 'scent', label: 'Scent', type: 'select', required: false,
          options: ['Floral', 'Woody', 'Fresh', 'Oriental', 'Fruity'] },
      ],
      filters: [
        { fieldName: 'fragranceType', label: 'Fragrance Type', type: 'checkbox', required: false },
        { fieldName: 'scent', label: 'Scent', type: 'checkbox', required: false },
      ]
    },
    'Wellness': {
      specifications: [
        { fieldName: 'wellnessType', label: 'Wellness Type', type: 'select', required: true,
          options: ['Vitamins', 'Supplements', 'Fitness Equipment', 'Personal Care'] },
        { fieldName: 'benefit', label: 'Benefit', type: 'select', required: false,
          options: ['Energy', 'Immunity', 'Weight Management', 'Beauty'] },
      ],
      filters: [
        { fieldName: 'wellnessType', label: 'Wellness Type', type: 'checkbox', required: false },
        { fieldName: 'benefit', label: 'Benefit', type: 'checkbox', required: false },
      ]
    }
  },

  // SPORTS & OUTDOORS SUBCATEGORIES - COMPLETE VERSION
  'Sports & Outdoors': {
    'Football': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Shoes', 'Ball', 'Jersey', 'Gloves', 'Accessories'] },
        { fieldName: 'size', label: 'Size', type: 'select', required: false,
          options: ['S', 'M', 'L', 'XL', 'XXL'] },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
        { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      ]
    },
    'Basketball': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Shoes', 'Ball', 'Jersey', 'Shorts', 'Accessories'] },
        { fieldName: 'size', label: 'Size', type: 'select', required: false,
          options: ['S', 'M', 'L', 'XL', 'XXL'] },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
        { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      ]
    },
    'Running': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Shoes', 'Clothing', 'Accessories', 'Watches'] },
        { fieldName: 'size', label: 'Size', type: 'select', required: false,
          options: ['XS', 'S', 'M', 'L', 'XL'] },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
        { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      ]
    },
    'Fitness': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Weights', 'Machines', 'Mats', 'Accessories'] },
        { fieldName: 'weight', label: 'Weight', type: 'text', required: false, unit: 'kg' },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
      ]
    },
    'Cycling': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Bicycle', 'Helmet', 'Clothing', 'Accessories'] },
        { fieldName: 'bikesType', label: 'Bike Type', type: 'select', required: false,
          options: ['Mountain', 'Road', 'Hybrid', 'Electric'] },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
        { fieldName: 'bikeType', label: 'Bike Type', type: 'checkbox', required: false },
      ]
    },
    'Swimming': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Swimwear', 'Goggles', 'Accessories'] },
        { fieldName: 'size', label: 'Size', type: 'select', required: false,
          options: ['XS', 'S', 'M', 'L', 'XL'] },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
        { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      ]
    },
    'Hiking': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Boots', 'Backpack', 'Clothing', 'Accessories'] },
        { fieldName: 'size', label: 'Size', type: 'select', required: false,
          options: ['S', 'M', 'L', 'XL'] },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
        { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      ]
    },
    'Camping': {
      specifications: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
          options: ['Tent', 'Sleeping Bag', 'Cooking', 'Lighting'] },
        { fieldName: 'capacity', label: 'Capacity', type: 'text', required: false, unit: 'person' },
      ],
      filters: [
        { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
      ]
    }
  },

  // TOYS & GAMES SUBCATEGORIES - COMPLETE VERSION
  'Toys & Games': {
    'Action Figures': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['3-5 years', '6-8 years', '9-12 years', '13+ years'] },
        { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
          options: ['Lego', 'Hasbro', 'Mattel', 'Local Brand'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
      ]
    },
    'Dolls': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['3-5 years', '6-8 years', '9-12 years'] },
        { fieldName: 'dollType', label: 'Doll Type', type: 'select', required: false,
          options: ['Fashion', 'Baby', 'Action'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'dollType', label: 'Doll Type', type: 'checkbox', required: false },
      ]
    },
    'Board Games': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['6-8 years', '9-12 years', '13+ years', 'Adult'] },
        { fieldName: 'players', label: 'Number of Players', type: 'select', required: false,
          options: ['2', '2-4', '4-6', '6+'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'players', label: 'Players', type: 'checkbox', required: false },
      ]
    },
    'Educational': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['0-2 years', '3-5 years', '6-8 years', '9-12 years'] },
        { fieldName: 'subject', label: 'Subject', type: 'select', required: false,
          options: ['Math', 'Science', 'Language', 'Creative'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'subject', label: 'Subject', type: 'checkbox', required: false },
      ]
    },
    'Puzzles': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['3-5 years', '6-8 years', '9-12 years', '13+ years'] },
        { fieldName: 'pieces', label: 'Number of Pieces', type: 'select', required: false,
          options: ['< 50', '50-100', '100-500', '500-1000', '1000+'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'pieces', label: 'Pieces', type: 'checkbox', required: false },
      ]
    },
    'Outdoor Toys': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['3-5 years', '6-8 years', '9-12 years'] },
        { fieldName: 'toyType', label: 'Toy Type', type: 'select', required: false,
          options: ['Ride-on', 'Sports', 'Water', 'Playground'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'toyType', label: 'Toy Type', type: 'checkbox', required: false },
      ]
    },
    'Electronic Toys': {
      specifications: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
          options: ['3-5 years', '6-8 years', '9-12 years'] },
        { fieldName: 'powerSource', label: 'Power Source', type: 'select', required: false,
          options: ['Battery', 'Rechargeable', 'Solar'] },
      ],
      filters: [
        { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
        { fieldName: 'powerSource', label: 'Power Source', type: 'checkbox', required: false },
      ]
    }
  },

  // AUTOMOTIVE SUBCATEGORIES - COMPLETE VERSION
  'Automotive': {
    'Cars': {
      specifications: [
        { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true,
          options: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible'] },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
          options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
        { fieldName: 'transmission', label: 'Transmission', type: 'select', required: true,
          options: ['Manual', 'Automatic'] },
      ],
      filters: [
        { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'checkbox', required: false },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
        { fieldName: 'transmission', label: 'Transmission', type: 'checkbox', required: false },
      ]
    },
    'Motorcycles': {
      specifications: [
        { fieldName: 'bikeType', label: 'Bike Type', type: 'select', required: true,
          options: ['Sport', 'Cruiser', 'Off-road', 'Scooter'] },
        { fieldName: 'engineSize', label: 'Engine Size', type: 'select', required: false,
          options: ['< 125cc', '125-250cc', '250-500cc', '500-750cc', '750cc+'] },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
          options: ['Petrol', 'Electric'] },
      ],
      filters: [
        { fieldName: 'bikeType', label: 'Bike Type', type: 'checkbox', required: false },
        { fieldName: 'engineSize', label: 'Engine Size', type: 'checkbox', required: false },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
      ]
    },
    'Bicycles': {
      specifications: [
        { fieldName: 'bikeType', label: 'Bike Type', type: 'select', required: true,
          options: ['Mountain', 'Road', 'Hybrid', 'Electric', 'Kids'] },
        { fieldName: 'size', label: 'Frame Size', type: 'select', required: false,
          options: ['XS', 'S', 'M', 'L', 'XL'] },
        { fieldName: 'wheelSize', label: 'Wheel Size', type: 'select', required: false,
          options: ['20"', '24"', '26"', '27.5"', '29"'] },
      ],
      filters: [
        { fieldName: 'bikeType', label: 'Bike Type', type: 'checkbox', required: false },
        { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      ]
    },
    'Trucks': {
      specifications: [
        { fieldName: 'truckType', label: 'Truck Type', type: 'select', required: true,
          options: ['Pickup', 'Commercial', 'Heavy Duty'] },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
          options: ['Petrol', 'Diesel'] },
        { fieldName: 'capacity', label: 'Load Capacity', type: 'text', required: false, unit: 'tons' },
      ],
      filters: [
        { fieldName: 'truckType', label: 'Truck Type', type: 'checkbox', required: false },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
      ]
    },
    'SUVs': {
      specifications: [
        { fieldName: 'suvType', label: 'SUV Type', type: 'select', required: true,
          options: ['Compact', 'Mid-size', 'Full-size', 'Luxury'] },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
          options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
        { fieldName: 'transmission', label: 'Transmission', type: 'select', required: true,
          options: ['Manual', 'Automatic'] },
      ],
      filters: [
        { fieldName: 'suvType', label: 'SUV Type', type: 'checkbox', required: false },
        { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
        { fieldName: 'transmission', label: 'Transmission', type: 'checkbox', required: false },
      ]
    },
    'Parts & Accessories': {
      specifications: [
        { fieldName: 'partType', label: 'Part Type', type: 'select', required: true,
          options: ['Engine', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Interior'] },
        { fieldName: 'compatibility', label: 'Vehicle Compatibility', type: 'text', required: false },
      ],
      filters: [
        { fieldName: 'partType', label: 'Part Type', type: 'checkbox', required: false },
      ]
    }
  },

  // BOOKS & MEDIA SUBCATEGORIES - COMPLETE VERSION
  'Books & Media': {
    'Books': {
      specifications: [
        { fieldName: 'genre', label: 'Genre', type: 'select', required: true,
          options: ['Fiction', 'Non-Fiction', 'Educational', 'Children', 'Science Fiction', 'Romance', 'Mystery'] },
        { fieldName: 'format', label: 'Format', type: 'select', required: false,
          options: ['Paperback', 'Hardcover', 'Digital', 'Audio'] },
      ],
      filters: [
        { fieldName: 'genre', label: 'Genre', type: 'checkbox', required: false },
        { fieldName: 'format', label: 'Format', type: 'checkbox', required: false },
      ]
    },
    'DVDs': {
      specifications: [
        { fieldName: 'mediaType', label: 'Media Type', type: 'select', required: true,
          options: ['Movie', 'TV Series', 'Documentary', 'Music'] },
        { fieldName: 'genre', label: 'Genre', type: 'select', required: false,
          options: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance'] },
      ],
      filters: [
        { fieldName: 'mediaType', label: 'Media Type', type: 'checkbox', required: false },
        { fieldName: 'genre', label: 'Genre', type: 'checkbox', required: false },
      ]
    },
    'CDs': {
      specifications: [
        { fieldName: 'musicGenre', label: 'Music Genre', type: 'select', required: true,
          options: ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Traditional'] },
        { fieldName: 'format', label: 'Format', type: 'select', required: false,
          options: ['CD', 'Vinyl', 'Cassette'] },
      ],
      filters: [
        { fieldName: 'musicGenre', label: 'Music Genre', type: 'checkbox', required: false },
        { fieldName: 'format', label: 'Format', type: 'checkbox', required: false },
      ]
    },
    'Video Games': {
      specifications: [
        { fieldName: 'platform', label: 'Platform', type: 'select', required: true,
          options: ['PlayStation', 'Xbox', 'Nintendo', 'PC'] },
        { fieldName: 'genre', label: 'Genre', type: 'select', required: false,
          options: ['Action', 'Adventure', 'Sports', 'RPG', 'Strategy'] },
      ],
      filters: [
        { fieldName: 'platform', label: 'Platform', type: 'checkbox', required: false },
        { fieldName: 'genre', label: 'Genre', type: 'checkbox', required: false },
      ]
    },
    'Magazines': {
      specifications: [
        { fieldName: 'category', label: 'Category', type: 'select', required: true,
          options: ['News', 'Lifestyle', 'Sports', 'Entertainment', 'Educational'] },
        { fieldName: 'frequency', label: 'Frequency', type: 'select', required: false,
          options: ['Weekly', 'Monthly', 'Quarterly'] },
      ],
      filters: [
        { fieldName: 'category', label: 'Category', type: 'checkbox', required: false },
        { fieldName: 'frequency', label: 'Frequency', type: 'checkbox', required: false },
      ]
    }
  },

  // JEWELRY & ACCESSORIES SUBCATEGORIES - COMPLETE VERSION
  'Jewelry & Accessories': {
    'Necklaces': {
      specifications: [
        { fieldName: 'material', label: 'Material', type: 'select', required: true,
          options: ['Gold', 'Silver', 'Platinum', 'Stainless Steel'] },
        { fieldName: 'gemstone', label: 'Gemstone', type: 'select', required: false,
          options: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'None'] },
      ],
      filters: [
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
        { fieldName: 'gemstone', label: 'Gemstone', type: 'checkbox', required: false },
      ]
    },
    'Rings': {
      specifications: [
        { fieldName: 'material', label: 'Material', type: 'select', required: true,
          options: ['Gold', 'Silver', 'Platinum', 'Titanium'] },
        { fieldName: 'ringSize', label: 'Ring Size', type: 'select', required: false,
          options: ['4', '5', '6', '7', '8', '9', '10'] },
      ],
      filters: [
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
        { fieldName: 'ringSize', label: 'Ring Size', type: 'checkbox', required: false },
      ]
    },
    'Earrings': {
      specifications: [
        { fieldName: 'material', label: 'Material', type: 'select', required: true,
          options: ['Gold', 'Silver', 'Platinum', 'Surgical Steel'] },
        { fieldName: 'earringType', label: 'Earring Type', type: 'select', required: false,
          options: ['Stud', 'Hoop', 'Drop', 'Huggie'] },
      ],
      filters: [
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
        { fieldName: 'earringType', label: 'Earring Type', type: 'checkbox', required: false },
      ]
    },
    'Bracelets': {
      specifications: [
        { fieldName: 'material', label: 'Material', type: 'select', required: true,
          options: ['Gold', 'Silver', 'Leather', 'Beaded'] },
        { fieldName: 'braceletType', label: 'Bracelet Type', type: 'select', required: false,
          options: ['Chain', 'Bangle', 'Cuff', 'Charm'] },
      ],
      filters: [
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
        { fieldName: 'braceletType', label: 'Bracelet Type', type: 'checkbox', required: false },
      ]
    },
    'Watches': {
      specifications: [
        { fieldName: 'watchType', label: 'Watch Type', type: 'select', required: true,
          options: ['Analog', 'Digital', 'Smartwatch', 'Chronograph'] },
        { fieldName: 'material', label: 'Material', type: 'select', required: false,
          options: ['Stainless Steel', 'Leather', 'Rubber', 'Gold'] },
      ],
      filters: [
        { fieldName: 'watchType', label: 'Watch Type', type: 'checkbox', required: false },
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
      ]
    },
    'Bags': {
      specifications: [
        { fieldName: 'bagType', label: 'Bag Type', type: 'select', required: true,
          options: ['Handbag', 'Backpack', 'Clutch', 'Tote', 'Crossbody'] },
        { fieldName: 'material', label: 'Material', type: 'select', required: false,
          options: ['Leather', 'Canvas', 'Synthetic', 'Straw'] },
      ],
      filters: [
        { fieldName: 'bagType', label: 'Bag Type', type: 'checkbox', required: false },
        { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
      ]
    },
    'Sunglasses': {
      specifications: [
        { fieldName: 'frameMaterial', label: 'Frame Material', type: 'select', required: true,
          options: ['Plastic', 'Metal', 'Acetate'] },
        { fieldName: 'lensType', label: 'Lens Type', type: 'select', required: false,
          options: ['Polarized', 'Mirrored', 'Gradient'] },
      ],
      filters: [
        { fieldName: 'frameMaterial', label: 'Frame Material', type: 'checkbox', required: false },
        { fieldName: 'lensType', label: 'Lens Type', type: 'checkbox', required: false },
      ]
    }
  },

  // FOOD & BEVERAGES SUBCATEGORIES - COMPLETE VERSION
  'Food & Beverages': {
    'Snacks': {
      specifications: [
        { fieldName: 'snackType', label: 'Snack Type', type: 'select', required: true,
          options: ['Chips', 'Chocolate', 'Biscuits', 'Nuts', 'Dried Fruits'] },
        { fieldName: 'packageSize', label: 'Package Size', type: 'select', required: false,
          options: ['Small', 'Medium', 'Large', 'Family Size'] },
      ],
      filters: [
        { fieldName: 'snackType', label: 'Snack Type', type: 'checkbox', required: false },
        { fieldName: 'packageSize', label: 'Package Size', type: 'checkbox', required: false },
      ]
    },
    'Beverages': {
      specifications: [
        { fieldName: 'beverageType', label: 'Beverage Type', type: 'select', required: true,
          options: ['Soft Drinks', 'Juice', 'Water', 'Energy Drinks', 'Tea', 'Coffee'] },
        { fieldName: 'packageSize', label: 'Package Size', type: 'select', required: false,
          options: ['250ml', '500ml', '1L', '1.5L', '2L'] },
      ],
      filters: [
        { fieldName: 'beverageType', label: 'Beverage Type', type: 'checkbox', required: false },
        { fieldName: 'packageSize', label: 'Package Size', type: 'checkbox', required: false },
      ]
    },
    'Cooking Ingredients': {
      specifications: [
        { fieldName: 'ingredientType', label: 'Ingredient Type', type: 'select', required: true,
          options: ['Spices', 'Grains', 'Oils', 'Sauces', 'Flour'] },
        { fieldName: 'packageSize', label: 'Package Size', type: 'select', required: false,
          options: ['100g', '250g', '500g', '1kg', '5kg'] },
      ],
      filters: [
        { fieldName: 'ingredientType', label: 'Ingredient Type', type: 'checkbox', required: false },
        { fieldName: 'packageSize', label: 'Package Size', type: 'checkbox', required: false },
      ]
    },
    'Organic': {
      specifications: [
        { fieldName: 'organicType', label: 'Organic Type', type: 'select', required: true,
          options: ['Fruits', 'Vegetables', 'Grains', 'Dairy'] },
        { fieldName: 'certification', label: 'Certification', type: 'select', required: false,
          options: ['USDA', 'EU Organic', 'Local Certified'] },
      ],
      filters: [
        { fieldName: 'organicType', label: 'Organic Type', type: 'checkbox', required: false },
        { fieldName: 'certification', label: 'Certification', type: 'checkbox', required: false },
      ]
    },
    'International': {
      specifications: [
        { fieldName: 'cuisine', label: 'Cuisine', type: 'select', required: true,
          options: ['Italian', 'Chinese', 'Indian', 'Mexican', 'Middle Eastern'] },
        { fieldName: 'productType', label: 'Product Type', type: 'select', required: false,
          options: ['Sauces', 'Spices', 'Ready Meals', 'Snacks'] },
      ],
      filters: [
        { fieldName: 'cuisine', label: 'Cuisine', type: 'checkbox', required: false },
        { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
      ]
    }
  }
}

// Main category configurations
export const categoryConfigs: { [key: string]: CategoryConfig } = {
  'Electronics': {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: ['Phones', 'Computers', 'Cameras', 'TV & Audio', 'Gaming'],
    specifications: [
      { fieldName: 'brand', label: 'Brand', type: 'select', required: true, 
        options: ['Samsung', 'Apple', 'Tecno', 'Infinix', 'Xiaomi', 'Oppo', 'Vivo', 'Huawei', 'Nokia', 'Google', 'OnePlus', 'Realme', 'Motorola', 'LG', 'Sony', 'Asus', 'Lenovo', 'HTC', 'Honor', 'ZTE', 'Dell', 'HP', 'Canon', 'Nikon', 'Other'] },
      { fieldName: 'model', label: 'Model', type: 'text', required: true },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['Brand New', 'Refurbished', 'Used'] },
      { fieldName: 'color', label: 'Color', type: 'select', required: false,
        options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver', 'Gold', 'Gray', 'Other'] },
    ],
    filters: [
      { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'price', label: 'Price', type: 'range', required: false, min: 0, max: 500000 },
      { fieldName: 'color', label: 'Color', type: 'checkbox', required: false },
    ]
  },
  'Clothing': {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    subcategories: ['Men', 'Women', 'Kids', 'Shoes'],
    specifications: [
      // REMOVED BRAND FROM CLOTHING
      { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
        options: ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Skirt', 'Jacket', 'Sweater', 'Underwear', 'Other'] },
      { fieldName: 'size', label: 'Size', type: 'select', required: true,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
      { fieldName: 'color', label: 'Color', type: 'select', required: true,
        options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Gray', 'Brown', 'Other'] },
      { fieldName: 'material', label: 'Material', type: 'select', required: false,
        options: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Denim', 'Linen', 'Leather', 'Spandex', 'Mixed'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
      { fieldName: 'gender', label: 'Gender', type: 'select', required: true,
        options: ['Men', 'Women', 'Unisex', 'Kids'] },
    ],
    filters: [
      // REMOVED BRAND FILTER FROM CLOTHING
      { fieldName: 'clothingType', label: 'Type', type: 'checkbox', required: false },
      { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
      { fieldName: 'gender', label: 'Gender', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
    ]
  },
  'Home & Garden': {
    id: 'home-garden',
    name: 'Home & Garden',
    slug: 'home-garden',
    subcategories: ['Furniture', 'Decor', 'Kitchenware', 'Garden'],
    specifications: [
      { fieldName: 'itemType', label: 'Item Type', type: 'select', required: true,
        options: ['Furniture', 'Decor', 'Kitchenware', 'Garden Tool', 'Lighting', 'Storage'] },
      { fieldName: 'homeMaterial', label: 'Material', type: 'select', required: false,
        options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Ceramic'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
      { fieldName: 'color', label: 'Color', type: 'select', required: false,
        options: ['Black', 'White', 'Brown', 'Gray', 'Blue', 'Green', 'Red', 'Other'] },
      { fieldName: 'dimensions', label: 'Dimensions', type: 'text', required: false, unit: 'cm' },
    ],
    filters: [
      { fieldName: 'itemType', label: 'Item Type', type: 'checkbox', required: false },
      { fieldName: 'homeMaterial', label: 'Material', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
    ]
  },
  'Beauty & Health': {
    id: 'beauty-health',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness'],
    specifications: [
      { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
        options: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness', 'Personal Care'] },
      { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
        options: ['L\'Oreal', 'Maybelline', 'Nivea', 'Dove', 'Local Brand', 'International'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Lightly', 'Used'] },
      { fieldName: 'size', label: 'Size', type: 'select', required: false,
        options: ['Travel Size', 'Regular', 'Large', 'Jumbo'] },
      { fieldName: 'skinType', label: 'Skin Type', type: 'select', required: false,
        options: ['All Skin Types', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
    ],
    filters: [
      { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
      { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'skinType', label: 'Skin Type', type: 'checkbox', required: false },
    ]
  },
// ADD THE MISSING CATEGORIES:
  'Sports & Outdoors': {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    subcategories: ['Football', 'Basketball', 'Running', 'Fitness', 'Cycling', 'Swimming', 'Hiking', 'Camping'],
    specifications: [
      { fieldName: 'sportType', label: 'Sport Type', type: 'select', required: true,
        options: ['Football', 'Basketball', 'Running', 'Fitness', 'Cycling', 'Swimming', 'Hiking', 'Camping'] },
      { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
        options: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Local Brand'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
      { fieldName: 'size', label: 'Size', type: 'select', required: false,
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { fieldName: 'material', label: 'Material', type: 'select', required: false,
        options: ['Polyester', 'Nylon', 'Cotton', 'Mesh', 'Rubber'] },
    ],
    filters: [
      { fieldName: 'sportType', label: 'Sport Type', type: 'checkbox', required: false },
      { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
    ]
  },

  'Toys & Games': {
    id: 'toys-games',
    name: 'Toys & Games',
    slug: 'toys-games',
    subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles', 'Outdoor Toys', 'Electronic Toys'],
    specifications: [
      { fieldName: 'toyType', label: 'Toy Type', type: 'select', required: true,
        options: ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles', 'Outdoor Toys', 'Electronic Toys'] },
      { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
        options: ['0-2 years', '3-5 years', '6-8 years', '9-12 years', '13+ years'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
      { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
        options: ['Lego', 'Barbie', 'Hot Wheels', 'Nerf', 'Local Brand'] },
      { fieldName: 'material', label: 'Material', type: 'select', required: false,
        options: ['Plastic', 'Wood', 'Fabric', 'Metal'] },
    ],
    filters: [
      { fieldName: 'toyType', label: 'Toy Type', type: 'checkbox', required: false },
      { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
    ]
  },

  'Automotive': {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    subcategories: ['Cars', 'Motorcycles', 'Bicycles', 'Trucks', 'SUVs', 'Parts & Accessories'],
    specifications: [
      { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true,
        options: ['Car', 'Motorcycle', 'Bicycle', 'Truck', 'SUV'] },
      { fieldName: 'brand', label: 'Brand', type: 'select', required: true,
        options: ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Hyundai', 'Other'] },
      { fieldName: 'model', label: 'Model', type: 'text', required: true },
      { fieldName: 'year', label: 'Year', type: 'number', required: true, min: 1990, max: 2024 },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used', 'Reconditioned'] },
      { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
        options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
      { fieldName: 'transmission', label: 'Transmission', type: 'select', required: true,
        options: ['Manual', 'Automatic'] },
      { fieldName: 'mileage', label: 'Mileage', type: 'number', required: false, unit: 'km' },
    ],
    filters: [
      { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'checkbox', required: false },
      { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
      { fieldName: 'year', label: 'Year', type: 'range', required: false, min: 1990, max: 2024 },
      { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
      { fieldName: 'transmission', label: 'Transmission', type: 'checkbox', required: false },
    ]
  },

  'Books & Media': {
    id: 'books-media',
    name: 'Books & Media',
    slug: 'books-media',
    subcategories: ['Books', 'DVDs', 'CDs', 'Video Games', 'Magazines'],
    specifications: [
      { fieldName: 'mediaType', label: 'Media Type', type: 'select', required: true,
        options: ['Book', 'DVD', 'CD', 'Video Game', 'Magazine'] },
      { fieldName: 'genre', label: 'Genre', type: 'select', required: true,
        options: ['Fiction', 'Non-Fiction', 'Educational', 'Children', 'Science Fiction', 'Romance', 'Mystery'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
      { fieldName: 'format', label: 'Format', type: 'select', required: false,
        options: ['Paperback', 'Hardcover', 'Digital', 'Audio'] },
      { fieldName: 'language', label: 'Language', type: 'select', required: false,
        options: ['English', 'Amharic', 'French', 'Arabic', 'Other'] },
    ],
    filters: [
      { fieldName: 'mediaType', label: 'Media Type', type: 'checkbox', required: false },
      { fieldName: 'genre', label: 'Genre', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'format', label: 'Format', type: 'checkbox', required: false },
    ]
  },

  'Jewelry & Accessories': {
    id: 'jewelry-accessories',
    name: 'Jewelry & Accessories',
    slug: 'jewelry-accessories',
    subcategories: ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Watches', 'Bags', 'Sunglasses'],
    specifications: [
      { fieldName: 'Jewelry-itemType', label: 'Item Type', type: 'select', required: true,
        options: ['Necklace', 'Ring', 'Earrings', 'Bracelet', 'Watch', 'Bag', 'Sunglasses'] },
      { fieldName: 'Jewelry-material', label: 'Material', type: 'select', required: true,
        options: ['Gold', 'Silver', 'Platinum', 'Stainless Steel', 'Leather', 'Fabric', 'Plastic'] },
      { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
        options: ['New', 'Used - Excellent', 'Used - Good'] },
      { fieldName: 'color', label: 'Color', type: 'select', required: false,
        options: ['Gold', 'Silver', 'Black', 'White', 'Brown', 'Multi-color'] },
      { fieldName: 'gemstone', label: 'Gemstone', type: 'select', required: false,
        options: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'None'] },
    ],
    filters: [
      { fieldName: 'itemType', label: 'Item Type', type: 'checkbox', required: false },
      { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
      { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
      { fieldName: 'gemstone', label: 'Gemstone', type: 'checkbox', required: false },
    ]
  },

  'Food & Beverages': {
    id: 'food-beverages',
    name: 'Food & Beverages',
    slug: 'food-beverages',
    subcategories: ['Snacks', 'Beverages', 'Cooking Ingredients', 'Organic', 'International'],
    specifications: [
      { fieldName: 'productsType', label: 'Product Type', type: 'select', required: true,
        options: ['Snacks', 'Beverages', 'Cooking Ingredients', 'Organic', 'International'] },
      { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
        options: ['Local Brand', 'International Brand'] },
      { fieldName: 'expiryDate', label: 'Expiry Date', type: 'text', required: true },
      { fieldName: 'packageSize', label: 'Package Size', type: 'select', required: false,
        options: ['Small', 'Medium', 'Large', 'Family Size'] },
      { fieldName: 'storages', label: 'Storage', type: 'select', required: false,
        options: ['Room Temperature', 'Refrigerated', 'Frozen'] },
    ],
    filters: [
      { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
      { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
      { fieldName: 'packageSize', label: 'Package Size', type: 'checkbox', required: false },
    ]
  }
}

// Rest of the file remains the same...
export const getCategoryConfig = (categoryName: string, subcategory?: string): CategoryConfig | null => {
  const baseConfig = categoryConfigs[categoryName]
  if (!baseConfig) return null

  if (subcategory && subcategoryConfigs[categoryName] && subcategoryConfigs[categoryName][subcategory]) {
    const subConfig = subcategoryConfigs[categoryName][subcategory]
    return {
      ...baseConfig,
      specifications: [...baseConfig.specifications, ...subConfig.specifications],
      filters: [...baseConfig.filters, ...subConfig.filters]
    }
  }

  return baseConfig
}

export const getSubcategories = (categoryName: string): string[] => {
  return categoryConfigs[categoryName]?.subcategories || []
}

export const getAllCategories = () => {
  return Object.values(categoryConfigs).map(config => ({
    id: config.id,
    name: config.name,
    slug: config.slug,
    subcategories: config.subcategories || []
  }))
}

// // lib/categories.ts - FIXED WITH CORRECT TYPES
// import { CategoryConfig } from '@/types/category'

// // Subcategory-specific configurations for ALL categories
// const subcategoryConfigs: { [key: string]: { [key: string]: any } } = {
//   // ELECTRONICS SUBCATEGORIES
//   'Electronics': {
//     'Phones': {
//       specifications: [
//         { fieldName: 'screenSize', label: 'Screen Size', type: 'select', required: false,
//           options: ['< 5"', '5.1 - 5.5"', '5.6 - 6"', '6.1 - 6.5"', '6.6 - 6.8"', '> 6.8"'] },
//         { fieldName: 'ram', label: 'RAM', type: 'select', required: false,
//           options: ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB'] },
//         { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
//           options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'] },
//         { fieldName: 'battery', label: 'Battery', type: 'text', required: false, unit: 'mAh' },
//         { fieldName: 'camera', label: 'Camera', type: 'text', required: false, unit: 'MP' },
//         { fieldName: 'simType', label: 'SIM Type', type: 'select', required: false,
//           options: ['Single SIM', 'Dual SIM', 'eSIM'] },
//         { fieldName: 'network', label: 'Network', type: 'select', required: false,
//           options: ['2G', '3G', '4G', '5G'] },
//       ],
//       filters: [
//         { fieldName: 'screenSize', label: 'Screen Size', type: 'checkbox', required: false },
//         { fieldName: 'ram', label: 'RAM', type: 'checkbox', required: false },
//         { fieldName: 'storage', label: 'Storage', type: 'checkbox', required: false },
//         { fieldName: 'simType', label: 'SIM Type', type: 'checkbox', required: false },
//       ]
//     },
//     'Computers': {
//       specifications: [
//         { fieldName: 'screenSize', label: 'Screen Size', type: 'select', required: false,
//           options: ['11"', '13"', '14"', '15"', '16"', '17"'] },
//         { fieldName: 'ram', label: 'RAM', type: 'select', required: false,
//           options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
//         { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
//           options: ['128GB', '256GB', '512GB', '1TB', '2TB'] },
//         { fieldName: 'processor', label: 'Processor', type: 'select', required: false,
//           options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'] },
//         { fieldName: 'graphics', label: 'Graphics', type: 'text', required: false },
//         { fieldName: 'operatingSystem', label: 'OS', type: 'select', required: false,
//           options: ['Windows', 'macOS', 'Linux', 'Chrome OS'] },
//       ],
//       filters: [
//         { fieldName: 'screenSize', label: 'Screen Size', type: 'checkbox', required: false },
//         { fieldName: 'ram', label: 'RAM', type: 'checkbox', required: false },
//         { fieldName: 'storage', label: 'Storage', type: 'checkbox', required: false },
//         { fieldName: 'processor', label: 'Processor', type: 'checkbox', required: false },
//       ]
//     },
//     'Cameras': {
//       specifications: [
//         { fieldName: 'cameraType', label: 'Camera Type', type: 'select', required: false,
//           options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Film Camera'] },
//         { fieldName: 'megapixels', label: 'Megapixels', type: 'text', required: false, unit: 'MP' },
//         { fieldName: 'lensMount', label: 'Lens Mount', type: 'text', required: false },
//         { fieldName: 'sensorSize', label: 'Sensor Size', type: 'select', required: false,
//           options: ['Full Frame', 'APS-C', 'Micro Four Thirds', '1"'] },
//       ],
//       filters: [
//         { fieldName: 'cameraType', label: 'Camera Type', type: 'checkbox', required: false },
//         { fieldName: 'sensorSize', label: 'Sensor Size', type: 'checkbox', required: false },
//       ]
//     },
//     'TV & Audio': {
//       specifications: [
//         { fieldName: 'screenSize', label: 'Screen Size', type: 'select', required: false,
//           options: ['32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"'] },
//         { fieldName: 'displayType', label: 'Display Type', type: 'select', required: false,
//           options: ['LED', 'OLED', 'QLED', '4K UHD', '8K UHD'] },
//         { fieldName: 'smartTV', label: 'Smart TV', type: 'select', required: false,
//           options: ['Yes', 'No'] },
//       ],
//       filters: [
//         { fieldName: 'screenSize', label: 'Screen Size', type: 'checkbox', required: false },
//         { fieldName: 'displayType', label: 'Display Type', type: 'checkbox', required: false },
//       ]
//     },
//     'Gaming': {
//       specifications: [
//         { fieldName: 'consoleType', label: 'Console Type', type: 'select', required: false,
//           options: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Gaming PC'] },
//         { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
//           options: ['500GB', '1TB', '2TB'] },
//       ],
//       filters: [
//         { fieldName: 'consoleType', label: 'Console Type', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // CLOTHING SUBCATEGORIES
//   'Clothing': {
//     'Men': {
//       specifications: [
//         { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
//           options: ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater', 'Underwear', 'Suit', 'Shorts'] },
//         { fieldName: 'size', label: 'Size', type: 'select', required: true,
//           options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
//       ],
//       filters: [
//         { fieldName: 'clothingType', label: 'Clothing Type', type: 'checkbox', required: false },
//         { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       ]
//     },
//     'Women': {
//       specifications: [
//         { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
//           options: ['Dress', 'Skirt', 'Blouse', 'T-Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater'] },
//         { fieldName: 'size', label: 'Size', type: 'select', required: true,
//           options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
//       ],
//       filters: [
//         { fieldName: 'clothingType', label: 'Clothing Type', type: 'checkbox', required: false },
//         { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       ]
//     },
//     'Kids': {
//       specifications: [
//         { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
//           options: ['T-Shirt', 'Dress', 'Pants', 'Shorts', 'Jacket', 'Sweater'] },
//         { fieldName: 'size', label: 'Size', type: 'select', required: true,
//           options: ['Newborn', '0-3M', '3-6M', '6-12M', '1-2Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y'] },
//       ],
//       filters: [
//         { fieldName: 'clothingType', label: 'Clothing Type', type: 'checkbox', required: false },
//         { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       ]
//     },
//     'Shoes': {
//       specifications: [
//         { fieldName: 'shoeType', label: 'Shoe Type', type: 'select', required: true,
//           options: ['Sneakers', 'Boots', 'Sandals', 'Formal', 'Sports', 'Casual'] },
//         { fieldName: 'size', label: 'Size', type: 'select', required: true,
//           options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] },
//       ],
//       filters: [
//         { fieldName: 'shoeType', label: 'Shoe Type', type: 'checkbox', required: false },
//         { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // HOME & GARDEN SUBCATEGORIES
//   'Home & Garden': {
//     'Furniture': {
//       specifications: [
//         { fieldName: 'furnitureType', label: 'Furniture Type', type: 'select', required: true,
//           options: ['Sofa', 'Bed', 'Table', 'Chair', 'Cabinet', 'Wardrobe', 'Shelf'] },
//               { fieldName: 'homeMaterial', label: 'Material', type: 'select', required: false, // Changed from 'material' to 'homeMaterial'
//         options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Ceramic'] },
//       ],
//       filters: [
//         { fieldName: 'furnitureType', label: 'Furniture Type', type: 'checkbox', required: false },
//       { fieldName: 'homeMaterial', label: 'Material', type: 'checkbox', required: false }, // Changed here too

//       ]
//     },
//     'Decor': {
//       specifications: [
//         { fieldName: 'decorType', label: 'Decor Type', type: 'select', required: true,
//           options: ['Wall Art', 'Vases', 'Candles', 'Mirrors', 'Clocks', 'Rugs'] },
//         { fieldName: 'style', label: 'Style', type: 'select', required: false,
//           options: ['Modern', 'Traditional', 'Minimalist', 'Bohemian'] },
//       ],
//       filters: [
//         { fieldName: 'decorType', label: 'Decor Type', type: 'checkbox', required: false },
//         { fieldName: 'style', label: 'Style', type: 'checkbox', required: false },
//       ]
//     },
//     'Kitchenware': {
//       specifications: [
//         { fieldName: 'kitchenwareType', label: 'Kitchenware Type', type: 'select', required: true,
//           options: ['Cookware', 'Cutlery', 'Appliances', 'Storage', 'Serveware'] },
//         { fieldName: 'material', label: 'Material', type: 'select', required: false,
//           options: ['Stainless Steel', 'Ceramic', 'Glass', 'Plastic', 'Wood'] },
//       ],
//       filters: [
//         { fieldName: 'kitchenwareType', label: 'Kitchenware Type', type: 'checkbox', required: false },
//         { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
//       ]
//     },
//     'Garden': {
//       specifications: [
//         { fieldName: 'gardenType', label: 'Garden Type', type: 'select', required: true,
//           options: ['Tools', 'Plants', 'Furniture', 'Decor', 'Lighting'] },
//         { fieldName: 'material', label: 'Material', type: 'select', required: false,
//           options: ['Metal', 'Wood', 'Plastic', 'Ceramic'] },
//       ],
//       filters: [
//         { fieldName: 'gardenType', label: 'Garden Type', type: 'checkbox', required: false },
//         { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // BEAUTY & HEALTH SUBCATEGORIES
//   'Beauty & Health': {
//     'Skincare': {
//       specifications: [
//         { fieldName: 'skinType', label: 'Skin Type', type: 'select', required: false,
//           options: ['All Skin Types', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
//         { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
//           options: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Mask', 'Toner'] },
//       ],
//       filters: [
//         { fieldName: 'skinType', label: 'Skin Type', type: 'checkbox', required: false },
//         { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
//       ]
//     },
//     'Makeup': {
//       specifications: [
//         { fieldName: 'makeupType', label: 'Makeup Type', type: 'select', required: true,
//           options: ['Foundation', 'Lipstick', 'Eyeshadow', 'Mascara', 'Blush', 'Concealer'] },
//         { fieldName: 'shade', label: 'Shade', type: 'text', required: false },
//       ],
//       filters: [
//         { fieldName: 'makeupType', label: 'Makeup Type', type: 'checkbox', required: false },
//       ]
//     },
//     'Hair Care': {
//       specifications: [
//         { fieldName: 'hairType', label: 'Hair Type', type: 'select', required: false,
//           options: ['All Hair Types', 'Dry', 'Oily', 'Curly', 'Straight', 'Color-Treated'] },
//         { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
//           options: ['Shampoo', 'Conditioner', 'Treatment', 'Styling', 'Color'] },
//       ],
//       filters: [
//         { fieldName: 'hairType', label: 'Hair Type', type: 'checkbox', required: false },
//         { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
//       ]
//     },
//     'Fragrance': {
//       specifications: [
//         { fieldName: 'fragranceType', label: 'Fragrance Type', type: 'select', required: true,
//           options: ['Perfume', 'Cologne', 'Body Spray', 'Essential Oil'] },
//         { fieldName: 'scent', label: 'Scent', type: 'select', required: false,
//           options: ['Floral', 'Woody', 'Fresh', 'Oriental', 'Fruity'] },
//       ],
//       filters: [
//         { fieldName: 'fragranceType', label: 'Fragrance Type', type: 'checkbox', required: false },
//         { fieldName: 'scent', label: 'Scent', type: 'checkbox', required: false },
//       ]
//     },
//     'Wellness': {
//       specifications: [
//         { fieldName: 'wellnessType', label: 'Wellness Type', type: 'select', required: true,
//           options: ['Vitamins', 'Supplements', 'Fitness Equipment', 'Personal Care'] },
//         { fieldName: 'benefit', label: 'Benefit', type: 'select', required: false,
//           options: ['Energy', 'Immunity', 'Weight Management', 'Beauty'] },
//       ],
//       filters: [
//         { fieldName: 'wellnessType', label: 'Wellness Type', type: 'checkbox', required: false },
//         { fieldName: 'benefit', label: 'Benefit', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // SPORTS & OUTDOORS SUBCATEGORIES
//   'Sports & Outdoors': {
//     'Football': {
//       specifications: [
//         { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
//           options: ['Shoes', 'Ball', 'Jersey', 'Gloves', 'Accessories'] },
//         { fieldName: 'size', label: 'Size', type: 'select', required: false,
//           options: ['S', 'M', 'L', 'XL', 'XXL'] },
//       ],
//       filters: [
//         { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
//         { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       ]
//     },
//     'Basketball': {
//       specifications: [
//         { fieldName: 'equipmentType', label: 'Equipment Type', type: 'select', required: true,
//           options: ['Shoes', 'Ball', 'Jersey', 'Shorts', 'Accessories'] },
//         { fieldName: 'size', label: 'Size', type: 'select', required: false,
//           options: ['S', 'M', 'L', 'XL', 'XXL'] },
//       ],
//       filters: [
//         { fieldName: 'equipmentType', label: 'Equipment Type', type: 'checkbox', required: false },
//         { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // TOYS & GAMES SUBCATEGORIES
//   'Toys & Games': {
//     'Action Figures': {
//       specifications: [
//         { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
//           options: ['3-5 years', '6-8 years', '9-12 years', '13+ years'] },
//         { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
//           options: ['Lego', 'Hasbro', 'Mattel', 'Local Brand'] },
//       ],
//       filters: [
//         { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
//         { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // AUTOMOTIVE SUBCATEGORIES
//   'Automotive': {
//     'Cars': {
//       specifications: [
//         { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true,
//           options: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible'] },
//         { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
//           options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
//         { fieldName: 'transmission', label: 'Transmission', type: 'select', required: true,
//           options: ['Manual', 'Automatic'] },
//       ],
//       filters: [
//         { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'checkbox', required: false },
//         { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
//         { fieldName: 'transmission', label: 'Transmission', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // BOOKS & MEDIA SUBCATEGORIES
//   'Books & Media': {
//     'Books': {
//       specifications: [
//         { fieldName: 'genre', label: 'Genre', type: 'select', required: true,
//           options: ['Fiction', 'Non-Fiction', 'Educational', 'Children', 'Science Fiction', 'Romance', 'Mystery'] },
//         { fieldName: 'format', label: 'Format', type: 'select', required: false,
//           options: ['Paperback', 'Hardcover', 'Digital', 'Audio'] },
//       ],
//       filters: [
//         { fieldName: 'genre', label: 'Genre', type: 'checkbox', required: false },
//         { fieldName: 'format', label: 'Format', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // JEWELRY & ACCESSORIES SUBCATEGORIES
//   'Jewelry & Accessories': {
//     'Necklaces': {
//       specifications: [
//         { fieldName: 'material', label: 'Material', type: 'select', required: true,
//           options: ['Gold', 'Silver', 'Platinum', 'Stainless Steel'] },
//         { fieldName: 'gemstone', label: 'Gemstone', type: 'select', required: false,
//           options: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'None'] },
//       ],
//       filters: [
//         { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
//         { fieldName: 'gemstone', label: 'Gemstone', type: 'checkbox', required: false },
//       ]
//     }
//   },

//   // FOOD & BEVERAGES SUBCATEGORIES
//   'Food & Beverages': {
//     'Snacks': {
//       specifications: [
//         { fieldName: 'snackType', label: 'Snack Type', type: 'select', required: true,
//           options: ['Chips', 'Chocolate', 'Biscuits', 'Nuts', 'Dried Fruits'] },
//         { fieldName: 'packageSize', label: 'Package Size', type: 'select', required: false,
//           options: ['Small', 'Medium', 'Large', 'Family Size'] },
//       ],
//       filters: [
//         { fieldName: 'snackType', label: 'Snack Type', type: 'checkbox', required: false },
//         { fieldName: 'packageSize', label: 'Package Size', type: 'checkbox', required: false },
//       ]
//     }
//   }
// }

// // Main category configurations
// export const categoryConfigs: { [key: string]: CategoryConfig } = {
//   'Electronics': {
//     id: 'electronics',
//     name: 'Electronics',
//     slug: 'electronics',
//     subcategories: ['Phones', 'Computers', 'Cameras', 'TV & Audio', 'Gaming'],
//     specifications: [
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: true, 
//         options: ['Samsung', 'Apple', 'Tecno', 'Infinix', 'Xiaomi', 'Oppo', 'Vivo', 'Huawei', 'Nokia', 'Google', 'OnePlus', 'Realme', 'Motorola', 'LG', 'Sony', 'Asus', 'Lenovo', 'HTC', 'Honor', 'ZTE', 'Dell', 'HP', 'Canon', 'Nikon', 'Other'] },
//       { fieldName: 'model', label: 'Model', type: 'text', required: true },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['Brand New', 'Refurbished', 'Used'] },
//       { fieldName: 'color', label: 'Color', type: 'select', required: false,
//         options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver', 'Gold', 'Gray', 'Other'] },
//     ],
//     filters: [
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'price', label: 'Price', type: 'range', required: false, min: 0, max: 500000 },
//       { fieldName: 'color', label: 'Color', type: 'checkbox', required: false },
//     ]
//   },

//   'Clothing': {
//     id: 'clothing',
//     name: 'Clothing',
//     slug: 'clothing',
//     subcategories: ['Men', 'Women', 'Kids', 'Shoes'],
//     specifications: [
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
//         options: ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma', 'Levi\'s', 'Local Brand', 'Other'] },
//       { fieldName: 'clothingType', label: 'Clothing Type', type: 'select', required: true,
//         options: ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Skirt', 'Jacket', 'Sweater', 'Underwear', 'Other'] },
//       { fieldName: 'size', label: 'Size', type: 'select', required: true,
//         options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
//       { fieldName: 'color', label: 'Color', type: 'select', required: true,
//         options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Gray', 'Brown', 'Other'] },
//       { fieldName: 'material', label: 'Material', type: 'select', required: false,
//         options: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Denim', 'Linen', 'Leather', 'Spandex', 'Mixed'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
//       { fieldName: 'gender', label: 'Gender', type: 'select', required: true,
//         options: ['Men', 'Women', 'Unisex', 'Kids'] },
//     ],
//     filters: [
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       { fieldName: 'clothingType', label: 'Type', type: 'checkbox', required: false },
//       { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//       { fieldName: 'gender', label: 'Gender', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
//     ]
//   },

//   'Home & Garden': {
//     id: 'home-garden',
//     name: 'Home & Garden',
//     slug: 'home-garden',
//     subcategories: ['Furniture', 'Decor', 'Kitchenware', 'Garden'],
//     specifications: [
//       { fieldName: 'itemType', label: 'Item Type', type: 'select', required: true,
//         options: ['Furniture', 'Decor', 'Kitchenware', 'Garden Tool', 'Lighting', 'Storage'] },
//       { fieldName: 'material', label: 'Material', type: 'select', required: false,
//         options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Ceramic'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
//       { fieldName: 'color', label: 'Color', type: 'select', required: false,
//         options: ['Black', 'White', 'Brown', 'Gray', 'Blue', 'Green', 'Red', 'Other'] },
//       { fieldName: 'dimensions', label: 'Dimensions', type: 'text', required: false, unit: 'cm' },
//     ],
//     filters: [
//       { fieldName: 'itemType', label: 'Item Type', type: 'checkbox', required: false },
//       { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//     ]
//   },

//   'Beauty & Health': {
//     id: 'beauty-health',
//     name: 'Beauty & Health',
//     slug: 'beauty-health',
//     subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness'],
//     specifications: [
//       { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
//         options: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness', 'Personal Care'] },
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
//         options: ['L\'Oreal', 'Maybelline', 'Nivea', 'Dove', 'Local Brand', 'International'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Lightly', 'Used'] },
//       { fieldName: 'size', label: 'Size', type: 'select', required: false,
//         options: ['Travel Size', 'Regular', 'Large', 'Jumbo'] },
//       { fieldName: 'skinType', label: 'Skin Type', type: 'select', required: false,
//         options: ['All Skin Types', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
//     ],
//     filters: [
//       { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'skinType', label: 'Skin Type', type: 'checkbox', required: false },
//     ]
//   },

//   'Sports & Outdoors': {
//     id: 'sports-outdoors',
//     name: 'Sports & Outdoors',
//     slug: 'sports-outdoors',
//     subcategories: ['Football', 'Basketball', 'Running', 'Fitness', 'Cycling', 'Swimming', 'Hiking', 'Camping'],
//     specifications: [
//       { fieldName: 'sportType', label: 'Sport Type', type: 'select', required: true,
//         options: ['Football', 'Basketball', 'Running', 'Fitness', 'Cycling', 'Swimming', 'Hiking', 'Camping'] },
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
//         options: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Local Brand'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
//       { fieldName: 'size', label: 'Size', type: 'select', required: false,
//         options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
//       { fieldName: 'material', label: 'Material', type: 'select', required: false,
//         options: ['Polyester', 'Nylon', 'Cotton', 'Mesh', 'Rubber'] },
//     ],
//     filters: [
//       { fieldName: 'sportType', label: 'Sport Type', type: 'checkbox', required: false },
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'size', label: 'Size', type: 'checkbox', required: false },
//     ]
//   },

//   'Toys & Games': {
//     id: 'toys-games',
//     name: 'Toys & Games',
//     slug: 'toys-games',
//     subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles', 'Outdoor Toys', 'Electronic Toys'],
//     specifications: [
//       { fieldName: 'toyType', label: 'Toy Type', type: 'select', required: true,
//         options: ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles', 'Outdoor Toys', 'Electronic Toys'] },
//       { fieldName: 'ageRange', label: 'Age Range', type: 'select', required: true,
//         options: ['0-2 years', '3-5 years', '6-8 years', '9-12 years', '13+ years'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'] },
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
//         options: ['Lego', 'Barbie', 'Hot Wheels', 'Nerf', 'Local Brand'] },
//       { fieldName: 'material', label: 'Material', type: 'select', required: false,
//         options: ['Plastic', 'Wood', 'Fabric', 'Metal'] },
//     ],
//     filters: [
//       { fieldName: 'toyType', label: 'Toy Type', type: 'checkbox', required: false },
//       { fieldName: 'ageRange', label: 'Age Range', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//     ]
//   },

//   'Automotive': {
//     id: 'automotive',
//     name: 'Automotive',
//     slug: 'automotive',
//     subcategories: ['Cars', 'Motorcycles', 'Bicycles', 'Trucks', 'SUVs', 'Parts & Accessories'],
//     specifications: [
//       { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true,
//         options: ['Car', 'Motorcycle', 'Bicycle', 'Truck', 'SUV'] },
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: true,
//         options: ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Hyundai', 'Other'] },
//       { fieldName: 'model', label: 'Model', type: 'text', required: true },
//       { fieldName: 'year', label: 'Year', type: 'number', required: true, min: 1990, max: 2024 },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used', 'Reconditioned'] },
//       { fieldName: 'fuelType', label: 'Fuel Type', type: 'select', required: true,
//         options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
//       { fieldName: 'transmission', label: 'Transmission', type: 'select', required: true,
//         options: ['Manual', 'Automatic'] },
//       { fieldName: 'mileage', label: 'Mileage', type: 'number', required: false, unit: 'km' },
//     ],
//     filters: [
//       { fieldName: 'vehicleType', label: 'Vehicle Type', type: 'checkbox', required: false },
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       { fieldName: 'year', label: 'Year', type: 'range', required: false, min: 1990, max: 2024 },
//       { fieldName: 'fuelType', label: 'Fuel Type', type: 'checkbox', required: false },
//       { fieldName: 'transmission', label: 'Transmission', type: 'checkbox', required: false },
//     ]
//   },

//   'Books & Media': {
//     id: 'books-media',
//     name: 'Books & Media',
//     slug: 'books-media',
//     subcategories: ['Books', 'DVDs', 'CDs', 'Video Games', 'Magazines'],
//     specifications: [
//       { fieldName: 'mediaType', label: 'Media Type', type: 'select', required: true,
//         options: ['Book', 'DVD', 'CD', 'Video Game', 'Magazine'] },
//       { fieldName: 'genre', label: 'Genre', type: 'select', required: true,
//         options: ['Fiction', 'Non-Fiction', 'Educational', 'Children', 'Science Fiction', 'Romance', 'Mystery'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
//       { fieldName: 'format', label: 'Format', type: 'select', required: false,
//         options: ['Paperback', 'Hardcover', 'Digital', 'Audio'] },
//       { fieldName: 'language', label: 'Language', type: 'select', required: false,
//         options: ['English', 'Amharic', 'French', 'Arabic', 'Other'] },
//     ],
//     filters: [
//       { fieldName: 'mediaType', label: 'Media Type', type: 'checkbox', required: false },
//       { fieldName: 'genre', label: 'Genre', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'format', label: 'Format', type: 'checkbox', required: false },
//     ]
//   },

//   'Jewelry & Accessories': {
//     id: 'jewelry-accessories',
//     name: 'Jewelry & Accessories',
//     slug: 'jewelry-accessories',
//     subcategories: ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Watches', 'Bags', 'Sunglasses'],
//     specifications: [
//       { fieldName: 'itemType', label: 'Item Type', type: 'select', required: true,
//         options: ['Necklace', 'Ring', 'Earrings', 'Bracelet', 'Watch', 'Bag', 'Sunglasses'] },
//       { fieldName: 'material', label: 'Material', type: 'select', required: true,
//         options: ['Gold', 'Silver', 'Platinum', 'Stainless Steel', 'Leather', 'Fabric', 'Plastic'] },
//       { fieldName: 'condition', label: 'Condition', type: 'select', required: true,
//         options: ['New', 'Used - Excellent', 'Used - Good'] },
//       { fieldName: 'color', label: 'Color', type: 'select', required: false,
//         options: ['Gold', 'Silver', 'Black', 'White', 'Brown', 'Multi-color'] },
//       { fieldName: 'gemstone', label: 'Gemstone', type: 'select', required: false,
//         options: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'None'] },
//     ],
//     filters: [
//       { fieldName: 'itemType', label: 'Item Type', type: 'checkbox', required: false },
//       { fieldName: 'material', label: 'Material', type: 'checkbox', required: false },
//       { fieldName: 'condition', label: 'Condition', type: 'checkbox', required: false },
//       { fieldName: 'gemstone', label: 'Gemstone', type: 'checkbox', required: false },
//     ]
//   },

//   'Food & Beverages': {
//     id: 'food-beverages',
//     name: 'Food & Beverages',
//     slug: 'food-beverages',
//     subcategories: ['Snacks', 'Beverages', 'Cooking Ingredients', 'Organic', 'International'],
//     specifications: [
//       { fieldName: 'productType', label: 'Product Type', type: 'select', required: true,
//         options: ['Snacks', 'Beverages', 'Cooking Ingredients', 'Organic', 'International'] },
//       { fieldName: 'brand', label: 'Brand', type: 'select', required: false,
//         options: ['Local Brand', 'International Brand'] },
//       { fieldName: 'expiryDate', label: 'Expiry Date', type: 'text', required: true },
//       { fieldName: 'packageSize', label: 'Package Size', type: 'select', required: false,
//         options: ['Small', 'Medium', 'Large', 'Family Size'] },
//       { fieldName: 'storage', label: 'Storage', type: 'select', required: false,
//         options: ['Room Temperature', 'Refrigerated', 'Frozen'] },
//     ],
//     filters: [
//       { fieldName: 'productType', label: 'Product Type', type: 'checkbox', required: false },
//       { fieldName: 'brand', label: 'Brand', type: 'checkbox', required: false },
//       { fieldName: 'packageSize', label: 'Package Size', type: 'checkbox', required: false },
//     ]
//   }
// }

// // Get category configuration with subcategory support
// export const getCategoryConfig = (categoryName: string, subcategory?: string): CategoryConfig | null => {
//   const baseConfig = categoryConfigs[categoryName]
//   if (!baseConfig) return null

//   // If we have subcategory-specific config, merge it
//   if (subcategory && subcategoryConfigs[categoryName] && subcategoryConfigs[categoryName][subcategory]) {
//     const subConfig = subcategoryConfigs[categoryName][subcategory]
//     return {
//       ...baseConfig,
//       specifications: [...baseConfig.specifications, ...subConfig.specifications],
//       filters: [...baseConfig.filters, ...subConfig.filters]
//     }
//   }

//   return baseConfig
// }

// // Get subcategories for a category
// export const getSubcategories = (categoryName: string): string[] => {
//   return categoryConfigs[categoryName]?.subcategories || []
// }

// export const getAllCategories = () => {
//   return Object.values(categoryConfigs).map(config => ({
//     id: config.id,
//     name: config.name,
//     slug: config.slug,
//     subcategories: config.subcategories || []
//   }))
// }