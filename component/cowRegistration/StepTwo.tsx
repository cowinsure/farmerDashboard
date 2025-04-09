export default function StepTwo() {
    return (
      <div>
      
        <h2 className="text-xl font-semibold mb-4">Cow Details</h2>
        <input
          type="date"
          placeholder="Date of Birth"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Age"
          className="w-full p-2 border rounded mb-4"
        />
        <select
          className="w-full p-2 border rounded mb-4"
          defaultValue=""
        >
          <option value="" disabled>
        Select Sex
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="text"
          placeholder="Colour"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Weight"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Height"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Cow ID (System Generated)"
          className="w-full p-2 border rounded mb-4"
          disabled
        />
        <input
          type="text"
          placeholder="Identification Number (AI Generated)"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Tag (System Generated)"
          className="w-full p-2 border rounded mb-4"
          disabled
        />
        <div className="mb-4">
          <label className="block mb-2">has Disease?</label>
          <select
        className="w-full p-2 border rounded"
        defaultValue=""
          >
        <option value="" disabled>
          Select
        </option>
        <option value="true">Yes</option>
        <option value="false">No</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Disease Name"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="mb-4">
          <label className="block mb-2">Is Female?</label>
          <select
        className="w-full p-2 border rounded"
        defaultValue=""
          >
        <option value="" disabled>
          Select
        </option>
        <option value="true">Yes</option>
        <option value="false">No</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Is Pregnant?</label>
          <select
        className="w-full p-2 border rounded"
        defaultValue=""
          >
        <option value="" disabled>
          Select
        </option>
        <option value="true">Yes</option>
        <option value="false">No</option>
          </select>
        </div>
        <select
          className="w-full p-2 border rounded mb-4"
          defaultValue=""
        >
          <option value="" disabled>
        Stage of Pregnancy
          </option>
          <option value="early">Early</option>
          <option value="mid">Mid</option>
          <option value="late">Late</option>
        </select>
        <input
          type="date"
          placeholder="Date of Last Calving"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Milk Yield"
          className="w-full p-2 border rounded mb-4"
        />
      </div>
    )
  }