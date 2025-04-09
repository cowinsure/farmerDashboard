export default function StepOne() {
    function startCamera(): void {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
            const videoElement = document.getElementById("video") as HTMLVideoElement;
            if (videoElement) {
                videoElement.srcObject = stream;
            }
            console.log("Camera started");
            })
            .catch((error) => {
            console.error("Error accessing the camera: ", error);
            });
    }

    return (
    <div>
      <h2 className="text-xl font-semibold mb-4 ">Muzzle Detection</h2>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 w-full flex flex-col justify-center items-center"> 
          <video id="video" className="h-[50vh] w-full border-2 border-green-500 rounded mb-4" autoPlay muted></video>
          <button
        onClick={startCamera}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Start Camera
      </button>
        </div>
        <div className="lg:w-1/2 w-full text-start  flex flex-col justify-start items-center ">
          <div className="bg-green-700 text-white p-4 rounded-lg shadow-md ">
          <p className="text-center text-3xl mb-4">Guidline for using Muzzel Tech</p>
            <ul className="list-disc text-2xl pl-5 mt-2">
            <li>Take a 3-second video slowly.</li>
            <li>Move the camera steadily without shaking.</li>
            <li>Ensure the cows muzzle is placed inside the box on the screen.</li>
            <li>Make sure there is adequate lighting for better detection.</li>
            <li>Keep the background clear of distractions.</li>
            </ul>
          </div>
        </div>
      </div>
     
    </div>
    )
  }