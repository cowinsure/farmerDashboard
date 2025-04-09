export default function StepTwo() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
      </div>
    )
  }