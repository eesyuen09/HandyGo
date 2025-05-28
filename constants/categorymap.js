import { useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';


export const categoryMap = {
  Cleaning: [
    'General House Cleaning',
    'Home Organizing',
    'Deep Cleaning',
    'Aircond Cleaning',
    'Carpet Cleaning',
    'Post-Renovation Cleaning',
    'Sofa or Mattress Cleaning',
  ],

  Repair: [
    'Plumbing Services',
    'Air Conditioner Repair',
    'Electrical Repair',
    'Washing Machine Repair',
    'Refrigerator Repair',
    'Door & Lock Repair',
    'Ceiling Repair'
  ],

  Moving: [
    'House Moving',
    'Large Item Delivery',
    'Small Item Delivery'
  ],

  Outdoor: [
    'Lawn Mowing',
    'Gardening',
    'Tree Cutting',
    'Roof or Gutter Cleaning',
  ],

  Maintenance: [
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
  ]
};


  export default function PrepopulateWorkerMaps() {
    useEffect(() => {
      const upload = async () => {
        const flagRef = doc(db, "initializationStatus", "workerMaps");
        const flagSnap = await getDoc(flagRef);
  
        if (flagSnap.exists() && flagSnap.data().initialized) {
          return;
        }
        console.log("categoryMap keys:", Object.keys(categoryMap));
      
  
        for (const [category, subcategories] of Object.entries(categoryMap)) {
          try {
            console.log("Writing category:", category);
            await setDoc(doc(db, "categoryToWorker", category), { workers: [] });
            console.log(`Wrote category: ${category}`);
        
            for (const sub of subcategories) {
              console.log(`   Sub: ${sub}`);
              await setDoc(doc(db, "subcategoryToWorker", sub), { workers: [] });
              console.log(`Wrote subcategory: ${sub}`);
            }
          } catch (error) {
            console.error(`Error writing ${category} / ${sub}:`, error.message);
          }
        }
        
        await setDoc(flagRef, { initialized: true });
        console.log("Worker maps initialized and flagged.");
      };
  
      upload();
    }, []);
  
    return null;
  }