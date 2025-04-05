// import Image from "next/image";

import { MdOutlineCancel } from 'react-icons/md';



export default function Home() {
  return (
    <div className="flex flex-col w-full">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-4">
      <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-bold">Card 1</h2>
      
      <p>Content for card 1</p>
      </div>
      <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-bold">Card 2</h2>
      <p>Content for card 2</p>
      </div>
      <div className="bg-white rounded-md shadow-md p-4">
      <h2 className="text-lg font-bold">Card 3</h2>
      <p>Content for card 3</p>
      </div>
    </div>
    <div className="flex w-full items-center justify-center h-screen">
      hello
     <MdOutlineCancel size={12} />

    </div>
    </div>
    
  );
}
