import { FontAwesome5, Feather, MaterialIcons, FontAwesome6} from '@expo/vector-icons';

const colours = {
  darkest_coco: "#704F38",
  light_coco: "#CB9D83",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "E3E3E3",
  white: '#FFFFFF',
  yellow_brown: '#DDA853',
  black: "#000000",
};

export const services_categories = [  
    {
      title: 'Cleaning',
      subcategories: [
        'General House Cleaning',
        'Home Organizing',
        'Deep Cleaning',
        'Aircond Cleaning',
        'Carpet Cleaning',
        'Post-Renovation Cleaning',
        'Sofa or Mattress Cleaning',
      ],
      description: "Book trusted cleaners to dust, mop, sanitize, and freshen up your home—giving you a spotless space without the hassle.",
      price: 20,
      icon: <MaterialIcons name="cleaning-services" size={18} color = {colours.darkest_coco} />,
      bannerImage: require('../assets/images/cleaning_banner.png'),
    },

    {
      title: 'Repair',
      subcategories: [
        'Plumbing Services',
        'Air Conditioner Repair',
        'Electrical Repair',
        'Washing Machine Repair',
        'Refrigerator Repair',
        'Door & Lock Repair',
        'Ceiling Repair'
      ],
      description: "Connect with skilled repair technicians to fix everything from leaks and electrical issues to broken fixtures, keeping your home safe and fully functional.",
      price: 20,
      bannerImage: require('../assets/images/repair_banner.png'),
      icon: <Feather name="tool" size={18} color = {colours.darkest_coco} />
    },
    {
      title: 'Maintenance',
      subcategories:[
        'Furniture Assembly',
        'Mounting',
        'Painting & Touch-up Work',
        'Curtain or Blind Installation',
        'Minor Welding Jobs',
        'Kitchen Remodeling',
        'Tiling & Flooring',
        'Electrical Safety Check',
        'Gas Leak Detection',
        'Fire Extinguisher Servicing'
      ],
      description: "Connect with experienced maintenance professionals to perform safety checks, fix minor wear and tear, and ensure your home systems stay in top working condition.",
      price: 20,
      bannerImage: require('../assets/images/maintenance_banner.png'),
      icon: <FontAwesome6 name="hands-holding" size={18} color = {colours.darkest_coco} />

    },
    {
      title: 'Moving',
      subcategories: [
        'House Moving',
        'Large Item Delivery',
        'Small Item Delivery'
      ],
      description: "Get help from professional movers who carefully pack, transport, and set up your belongings—making your move fast, safe, and hassle-free.",
      price: 50,
      bannerImage: require('../assets/images/Moving.png'),
      icon: <FontAwesome5 name="truck-moving" size={18} color = {colours.darkest_coco}/>
    },
    {
      title: 'Outdoor Services',
      subcategories:[
        'Lawn Mowing',
        'Gardening',
        'Tree Cutting',
        'Roof or Gutter Cleaning',
      ],
      description: "Keep your outdoor spaces clean and beautiful with expert lawn care, tree trimming, and garden upkeep tailored to your needs.",
      price: 50,
      bannerImage: require('../assets/images/outdoor_banner.png'),
      icon: <FontAwesome5 name="tree" size={18} color = {colours.darkest_coco} />
    },
    
  ];
