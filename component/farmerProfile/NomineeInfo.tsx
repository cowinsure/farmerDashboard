"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ModalGeneral from "../modal/DialogGeneral";
import logo from "../../public/Logo-03.png";
import SectionHeading from "@/components/new-ui/utils/SectionHeading";
import { LuUsers } from "react-icons/lu";
import InputField from "@/components/new-ui/ui/InputField";
import ActionButton from "@/components/new-ui/utils/ActionButton";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "sonner";

interface NomineeInfoProps {
  isShowSubmit?: boolean;
}

const NomineeInfo: React.FC<NomineeInfoProps> = ({ isShowSubmit = true }) => {
  const [formData, setFormData] = useState({
    nominee_name: "",
    phone: "",
    nid: "",
    relationship: "",
    email: "",
  });

  const relationshipOptions = [
    { value: "", label: "Select Relationship" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "husband", label: "Husband" },
    { value: "wife", label: "Wife" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "grandfather", label: "Grandfather" },
    { value: "grandmother", label: "Grandmother" },
    { value: "uncle", label: "Uncle" },
    { value: "aunt", label: "Aunt" },
    { value: "nephew", label: "Nephew" },
    { value: "niece", label: "Niece" },
    { value: "cousin", label: "Cousin" },
    { value: "friend", label: "Friend" },
    { value: "partner", label: "Partner" },
    { value: "sibling", label: "Sibling" },
    { value: "other", label: "Other" },
  ];

  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Fetch nominee info on component mount
  useEffect(() => {
    const fetchNomineeInfo = async () => {
      const authToken = localStorage.getItem("accessToken");
      if (!authToken) {
        toast.error("Access token is missing. Please log in again.");
        return;
      }

      setIsLoading(true); // Show loading spinner
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/nominee-info/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          const data = result.data;
          setFormData({
            nominee_name: data.nominee_name || "",
            phone: data.phone || "",
            nid: data.nid || "",
            email: data.email || "",
            relationship: data.relationship || "",
          });
          setSuccessMessage("Nominee information fetched successfully!");
        } else if (response.status === 400) {
          // setErrorMessage(result.data.message);
        } else if (response.status === 404) {
          // setErrorMessage(result.data.message);
        } else if (response.status === 401) {
          setSessionExpired(true);
          console.log("Unauthorized");
        } else {
          throw new Error(
            result.message || "Failed to fetch nominee information"
          );
        }
      } catch (error) {
        console.error("Error fetching nominee information:", error);
        setErrorMessage(
          "An error occurred while fetching nominee information."
        );
      } finally {
        setIsLoading(false); // Hide loading spinner
      }
    };

    fetchNomineeInfo();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nominee_name.trim())
      newErrors.nominee_name = "Nominee name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?\d{7,15}$/.test(formData.phone.trim()))
      newErrors.phone = "Invalid phone number";

    if (!formData.nid.trim()) newErrors.nid = "NID is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email.trim()))
      newErrors.email = "Invalid email address";

  if (!formData.relationship) {
    console.log("relationship is empty"); // debug
    newErrors.relationship = "Relationship is required";
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please provide the informations correctly");
      return;
    }
    setIsLoading(true);
    console.log("Form Data:", formData);
    const authToken = localStorage.getItem("accessToken");
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/nominee-info/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          const result = await response.json();
          if (response.ok) {
            setSuccessMessage("Form submitted successfully!");
          } else if (response.status === 400) {
            setErrorMessage(result.data.message);
          } else if (response.status === 401) {
            setSessionExpired(true);
            console.log("Unauthorized");
          } else {
            throw new Error(result.message || "Failed to submit form");
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          toast.error(
            `Something went wrong. Please try again.\nError: ${error}`
          );
        });
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
    // Add form submission logic here
  };

  console.log(formData)

  return (
    <div className="p-2 md:p-6 rounded-md">
      <SectionHeading
        sectionTitle="Nominee Information"
        description="Add your nominee details for insurance claims"
        icon={<LuUsers />}
      />
      <form onSubmit={handleSubmit}>
        <div data-aos="fade-in" data-aos-delay="400" className="space-y-8">
          {" "}
          <InputField
            placeholder="Enter nominee name"
            label="Nominee Name"
            id="nominee_name"
            name="nominee_name"
            value={formData.nominee_name}
            onChange={handleChange}
            error={errors.nominee_name}
          />
          <InputField
            placeholder="Enter phone no."
            label="Phone"
            id="phone"
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <InputField
            placeholder="Enter NID number"
            label="NID"
            id="nid"
            name="nid"
            type="number"
            value={formData.nid}
            onChange={handleChange}
            error={errors.nid}
          />
          <InputField
            placeholder="Enter email"
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <div className="relative w-full flex flex-col">
            <label
              htmlFor="relationship"
              className="mb-1 text-sm font-bold text-gray-600"
            >
              Relationship
            </label>

            <select
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className={`appearance-none w-full border rounded-md p-2 pr-10 font-semibold cursor-pointer
    focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50
    hover:bg-green-50 hover:border-green-300
    ${errors.relationship ? "border-red-600" : "border-gray-300"}`}
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.relationship && (
              <p className="text-red-600 text-sm mt-1">{errors.relationship}</p>
            )}

            {/* Custom dropdown icon */}
            <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
              <IoMdArrowDropdown className="text-xl" />
            </div>
          </div>
          {isShowSubmit && <ActionButton btnText="Submit" type="submit" />}
        </div>
      </form>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-green-500 font-medium">
            Submitting, please wait...
          </p>
        </div>
      )}

      {/* Success Message Dialog */}
      {/* {successMessage && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
          <p>{successMessage}</p>
        </div>
      )} */}

      <ModalGeneral
        isOpen={sessionExpired}
        onClose={() => {
          setSessionExpired(false);
        }}
      >
        <div className="text-black  text-center flex flex-col items-center p-5">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="h-auto "
            priority
          />
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
            <p>Your session has expired. Please log in again.</p>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken"); // Clear token
                router.push("/auth/login"); // Redirect to login page
              }}
              className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Login Again
            </button>
          </div>
        </div>
      </ModalGeneral>

      <ModalGeneral
        isOpen={errorMessage != ""}
        onClose={() => {
          setErrorMessage("");
        }}
      >
        <div className="text-black  text-center flex flex-col items-center p-5">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="h-auto "
            priority
          />
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
            <p>{errorMessage}</p>
            <button
              onClick={() => {
                setErrorMessage(""); // Clear error message
              }}
              className="mt-2 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </ModalGeneral>
    </div>
  );
};

export default NomineeInfo;
