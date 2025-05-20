import React, { useState, useEffect } from 'react';
interface Cow {
  id: number;
  reference_id: string;
  owner_name: string;
  breed_name: string;
  color_name: string;
  age_in_months: number;
  weight_kg: number;
  height: number;
  vaccination_status_name: string;
  last_vaccination_date: string;
  deworming_status_name: string;
  last_deworming_date: string;
  health_issues: string;
  pregnancy_status: string;
  last_date_of_calving: string | null;
  purchase_date: string;
  purchase_from: string;
  purchase_amount: number;
  gender: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  muzzle_video: string;
  left_side_image: string;
  right_side_image: string;
  challan_paper: string;
  vet_certificate: string;
  chairman_certificate: string;
  image_with_owner: string;
}

interface SearchCowProps {
    reference_id: string
}

const CowDetails = ({ reference_id }: SearchCowProps) => {
  // State to store the cow data
  const [cowData, setCowData] = useState<Cow[]>([]);
  // State to store any error that might occur
  const [error, setError] = useState(null);
   const token = localStorage.getItem('accessToken');


   

  // useEffect to fetch data when the component mounts
  useEffect(() => {
   
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/insurecow-agent/cows/?string_id=${reference_id}`, {
  headers: {
    // "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCowData(data);
      } catch (error:any) {
        setError(error.message);
        console.error('Error fetching cow data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cowData) {
    return <div>Loading...</div>;
  }

  // Render the cow data here
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cow Details</h1>
      <ul className="overflow-y-auto max-h-96 border border-gray-300 rounded-lg p-4">
        {cowData.map(cow => (
          <li key={cow.id} className="border-b border-gray-300 pb-4 mb-4 last:border-b-0">
            <h2 className="text-xl font-semibold mb-2">{cow.reference_id}</h2>
            <p className="mb-1">Owner Name: {cow.owner_name}</p>
            <p className="mb-1">Breed Name: {cow.breed_name}</p>
            <p className="mb-1">Color Name: {cow.color_name}</p>
            <p className="mb-1">Age in Months: {cow.age_in_months}</p>
            <p className="mb-1">Weight (kg): {cow.weight_kg}</p>
            <p className="mb-1">Height: {cow.height}</p>
            <p className="mb-1">Vaccination Status: {cow.vaccination_status_name}</p>
            <p className="mb-1">Last Vaccination Date: {cow.last_vaccination_date}</p>
            <p className="mb-1">Deworming Status: {cow.deworming_status_name}</p>
            <p className="mb-1">Last Deworming Date: {cow.last_deworming_date}</p>
            <p className="mb-1">Health Issues: {cow.health_issues}</p>
            <p className="mb-1">Pregnancy Status: {cow.pregnancy_status}</p>
            <p className="mb-1">Last Date of Calving: {cow.last_date_of_calving !== null ? cow.last_date_of_calving : 'N/A'}</p>
            <p className="mb-1">Purchase Date: {cow.purchase_date}</p>
            <p className="mb-1">Purchase From: {cow.purchase_from}</p>
            <p className="mb-1">Purchase Amount: {cow.purchase_amount}</p>
            <p className="mb-1">Gender: {cow.gender}</p>
            <p className="mb-1">Remarks: {cow.remarks}</p>
            <p className="mb-1">Created At: {cow.created_at}</p>
            <p className="mb-1">Updated At: {cow.updated_at}</p>
            <p className="mb-1">Is Active: {cow.is_active ? 'Yes' : 'No'}</p>
            <p className="mb-1">Muzzle Video: <a href={cow.muzzle_video} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Video</a></p>
            <p className="mb-1">Left Side Image: <img src={cow.left_side_image} alt="Left Side" className="w-50 h-auto" /></p>
            <p className="mb-1">Right Side Image: <img src={cow.right_side_image} alt="Right Side" className="w-50 h-auto" /></p>
            <p className="mb-1">Challan Paper: <a href={cow.challan_paper} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Paper</a></p>
            <p className="mb-1">Vet Certificate: <a href={cow.vet_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Certificate</a></p>
            <p className="mb-1">Chairman Certificate: <a href={cow.chairman_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Certificate</a></p>
            <p className="mb-1">Image with Owner: <img src={cow.image_with_owner} alt="With Owner" className="w-50 h-auto" /></p>
          </li>
        ))}
      </ul>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};

export default CowDetails;
