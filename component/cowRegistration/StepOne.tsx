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
      <video id="video" className="h-[50vh] w-full border rounded mb-4" autoPlay muted></video>
      <button
        onClick={startCamera}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Start Camera
      </button>
    </div>
    )
  }