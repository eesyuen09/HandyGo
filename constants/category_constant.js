import {
  FontAwesome5,
  Feather,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";

const colours = {
  darkest_coco: "#704F38",
  light_coco: "#CB9D83",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "E3E3E3",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
};

export const services_categories = [
  {
    title: "Cleaning",
    subcategories: [
      {
        label: "General House Cleaning",
        bannerImage: require("../assets/images/cleaning_banner.png"),
      },
      {
        label: "Home Organizing",
        bannerImage: require("../assets/images/home_organization.png"),
      },
      {
        label: "Deep Cleaning",
        bannerImage: require("../assets/images/deep_cleaning.jpg"),
      },
      {
        label: "Aircond Cleaning",
        bannerImage: require("../assets/images/aircond_repair.png"),
      },
      {
        label: "Carpet Cleaning",
        bannerImage: require("../assets/images/carpet_cleaning.jpg"),
      },
      {
        label: "Post-Renovation Cleaning",
        bannerImage: require("../assets/images/post_renovation.jpg"),
      },
      {
        label: "Sofa or Mattress Cleaning",
        bannerImage: require("../assets/images/sofa_cleaning.jpg"),
      },
    ],
    description:
      "Book trusted cleaners to dust, mop, sanitize, and freshen up your home—giving you a spotless space without the hassle.",
    price: 22,
    icon: (
      <MaterialIcons
        name="cleaning-services"
        size={18}
        color={colours.darkest_coco}
      />
    ),
    bannerImage: require("../assets/images/cleaning_banner.png"),
    questions: [
      {
        key: "homeSize",
        prompt: "Home size / number of rooms",
        type: "select",
        options: [
          { label: "Studio / 1-room", value: 1 },
          { label: "2-3 rooms", value: 2 },
          { label: "4+ rooms", value: 3 },
        ],
      },
      {
        key: "petHair",
        prompt: "Pet hair cleanup needed?",
        type: "select",
        options: [
          { label: "No", value: 1 },
          { label: "Light", value: 2 },
          { label: "Heavy", value: 3 },
        ],
      },
      {
        key: "access",
        prompt: "Stairs / elevator access",
        type: "select",
        options: [
          { label: "Ground floor", value: 1 },
          { label: "Elevator accessible", value: 2 },
          { label: "Stairs only", value: 3 },
        ],
      },
    ],
  },

  {
    title: "Repair",
    subcategories: [
      {
        label: "Plumbing Services",
        bannerImage: require("../assets/images/plumbing.jpg"),
      },
      {
        label: "Air Conditioner Repair",
        bannerImage: require("../assets/images/aircond_repair.png"),
      },
      {
        label: "Electrical Repair",
        bannerImage: require("../assets/images/electrical.jpg"),
      },
      {
        label: "Washing Machine Repair",
        bannerImage: require("../assets/images/washing_machine.jpg"),
      },
      {
        label: "Refrigerator Repair",
        bannerImage: require("../assets/images/refrigerator.jpg"),
      },
      {
        label: "Door & Lock Repair",
        bannerImage: require("../assets/images/lock_repair.jpg"),
      },
      {
        label: "Ceiling Repair",
        bannerImage: require("../assets/images/ceiling.jpg"),
      },
    ],
    description:
      "Connect with skilled repair technicians to fix everything from leaks and electrical issues to broken fixtures, keeping your home safe and fully functional.",
    price: 20,
    bannerImage: require("../assets/images/repair_banner.png"),
    icon: <Feather name="tool" size={18} color={colours.darkest_coco} />,
    questions: [
      {
        key: "severity",
        prompt: "How severe is the issue?",
        type: "select",
        options: [
          { label: "Minor (small leak, tiny crack)", value: 1 },
          { label: "Moderate (dripping)", value: 2 },
          {
            label: "Major (burst pipe, no power, completely broken lock)",
            value: 3,
          },
        ],
      },
      {
        key: "access",
        prompt: "Is access straightforward?",
        type: "select",
        options: [
          { label: "Easy (ground)", value: 1 },
          { label: "Moderate (lift accessible)", value: 2 },
          { label: "Difficult (upstairs, no elevator)", value: 3 },
        ],
      },
    ],
  },
  {
    title: "Maintenance",
    subcategories: [
      {
        label: "Furniture Assembly",
        bannerImage: require("../assets/images/furniture.jpg"),
      },
      {
        label: "Mounting",
        bannerImage: require("../assets/images/mounting.webp"),
      },
      {
        label: "Painting & Touch-up Work",
        bannerImage: require("../assets/images/painting.jpeg"),
      },
      {
        label: "Curtain or Blind Installation",
        bannerImage: require("../assets/images/curtain.jpg"),
      },
      {
        label: "Minor Welding Jobs",
        bannerImage: require("../assets/images/welding.jpg"),
      },
      {
        label: "Kitchen Remodeling",
        bannerImage: require("../assets/images/kitchen .jpg"),
      },
      {
        label: "Tiling & Flooring",
        bannerImage: require("../assets/images/flooring.jpg"),
      },
      {
        label: "Electrical Safety Check",
        bannerImage: require("../assets/images/safety.jpg"),
      },
      {
        label: "Gas Leak Detection",
        bannerImage: require("../assets/images/gasleak.png"),
      },
      {
        label: "Fire Extinguisher Servicing",
        bannerImage: require("../assets/images/fire_extinguisher.jpg"),
      },
    ],
    description:
      "Connect with experienced maintenance professionals to ensure your home systems stay in top working condition.",
    price: 38,
    bannerImage: require("../assets/images/maintenance_banner.png"),
    icon: (
      <FontAwesome6
        name="hands-holding"
        size={18}
        color={colours.darkest_coco}
      />
    ),
    questions: [
      {
        key: "itemCount",
        prompt: "Number of items (e.g. furniture, fixtures)",
        type: "number",
      },
      {
        key: "areaSize",
        prompt: "Area size in m² (e.g. painting, tiling)",
        type: "number",
      },
      {
        key: "complexity",
        prompt: "Task complexity",
        type: "select",
        options: [
          { label: "Basic - straightforward install or check", value: 1 },
          { label: "Intermediate - some prep or precision work", value: 2 },
          {
            label: "Advanced - needs special tools or partial demolition",
            value: 3,
          },
        ],
      },
    ],
  },
  {
    title: "Moving",
    subcategories: [
      {
        label: "House Moving",
        bannerImage: require("../assets/images/Moving.png"),
      },
      {
        label: "Large Item Delivery",
        bannerImage: require("../assets/images/large_item.jpeg"),
      },
      {
        label: "Small Item Delivery",
        bannerImage: require("../assets/images/small_item.jpeg"),
      },
    ],
    description:
      "Get help from professional movers who carefully pack, transport, and set up your belongings—making your move fast, safe, and hassle-free.",
    price: 20,
    bannerImage: require("../assets/images/Moving.png"),
    icon: (
      <FontAwesome5
        name="truck-moving"
        size={18}
        color={colours.darkest_coco}
      />
    ),
    questions: [
      {
        key: "sizeTier",
        prompt: "Home size or load tier",
        type: "select",
        options: [
          { label: "Studio / 1-2 items", value: 1 },
          { label: "1-2 BR (5-10 items)", value: 2 },
          { label: "3+ BR (10+ items)", value: 3 },
        ],
      },
      {
        key: "floors",
        prompt: "Stairs / elevator access",
        type: "select",
        options: [
          { label: "Ground floor only", value: 1 },
          { label: "Elevator accessible", value: 2 },
          { label: "No elevator", value: 3 },
        ],
      },
      {
        key: "distance",
        prompt: "Carry distance",
        type: "select",
        options: [
          { label: "< 5 km", value: 1 },
          { label: "5-10 km", value: 2 },
          { label: "> 10 km", value: 3 },
        ],
      },
    ],
  },
  {
    title: "Outdoor Services",
    subcategories: [
      {
        label: "Lawn Mowing",
        bannerImage: require("../assets/images/lawn_moving.jpg"),
      },
      {
        label: "Gardening",
        bannerImage: require("../assets/images/gardening.jpg"),
      },
      {
        label: "Tree Cutting",
        bannerImage: require("../assets/images/tree.jpeg"),
      },
      {
        label: "Roof or Gutter Cleaning",
        bannerImage: require("../assets/images/roof.webp"),
      },
    ],
    description:
      "Keep your outdoor spaces clean and beautiful with expert lawn care, tree trimming, and garden upkeep tailored to your needs.",
    price: 28,
    bannerImage: require("../assets/images/outdoor_banner.png"),
    icon: <FontAwesome5 name="tree" size={18} color={colours.darkest_coco} />,
    questions: [
      {
        key: "areaSize",
        prompt: "Area size in m²",
        type: "number",
        helperText: "Enter area, e.g. 100",
      },
    ],
  },
];
