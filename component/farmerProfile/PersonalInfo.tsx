"use client";
import React, { useEffect, useState } from "react";
import PhotoCaptureModal from "../helper/PhotoCaptureModal";
import ModalGeneral from "../modal/DialogGeneral";
import Image from "next/image";
import logo from "../../public/Logo-03.png";
import { unauthorized, useRouter } from "next/navigation";
import SectionHeading from "@/components/new-ui/utils/SectionHeading";
import { GoPerson } from "react-icons/go";
import InputField from "@/components/new-ui/ui/InputField";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineCalendarToday } from "react-icons/md";
import ActionButton from "@/components/new-ui/utils/ActionButton";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { AIChatWidget } from "../ui/ai-chat-widget";
import { AIInterface } from "../ui/ai-interface";
import FallbackImage from "@/components/new-ui/utils/FallBackImage";

const PersonalInfo: React.FC = () => {
  // const handleInputChangen = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
  //     setState(e.target.value);
  // };
  const router = useRouter();
  const { phoneNumber } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [nidFront, setnidFront] = useState<File | null>(null);
  const [nidBack, setnidBack] = useState<File | null>(null);
  const [profileImage, setprofileImage] = useState<File | null>(null);

  // New states for storing URLs
  const [nidFrontUrl, setNidFrontUrl] = useState<string | null>(null);
  const [nidBackUrl, setNidBackUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // const [firstName, setFirstName] = useState<string>('');
  //   const [formData, setFormData] = useState({
  //     userType: localStorage.getItem("userId") || "",
  //     first_name: "",
  //     last_name: "",
  //     nid: "",
  //     date_of_birth: "",
  //     gender: "Male",
  //     tin: "",
  //     thana: "",
  //     upazila: "",
  //     zilla: "",
  //     union: "",
  //     village: "",
  //   });
  const [formData, setFormData] = useState({
    userType: "",
    first_name: "",
    last_name: "",
    nid: "",
    date_of_birth: "",
    gender: "Male",
    tin: "",
    thana: "",
    upazila: "",
    zilla: "",
    union: "",
    village: "",
  });
  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window === "undefined") return;

      const storedUserType = localStorage.getItem("userId");
      const authToken = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/personal-info/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 401) {
          setSessionExpired(true); // Handle session expiration
          return;
        }
        if (storedUserType) {
          setFormData((prev) => ({ ...prev, userType: storedUserType }));
        }

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          const data = result.data;
          setFormData((prevData) => ({
            ...prevData,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            nid: data.nid || "",
            date_of_birth: data.date_of_birth || "",
            gender: data.gender || "Male",
            tin: data.tin || "",
            thana: data.thana || "",

            zilla: data.zilla || "",
            village: data.village || "",
            union: data.union || "",
          }));

          // Save URLs in new states
          if (data.nid_front_image_url) {
            setNidFrontUrl(data.nid_front_image_url);
          }
          if (data.nid_back_image_url) {
            setNidBackUrl(data.nid_back_image_url);
          }
          if (data.profile_image_url) {
            setProfileImageUrl(data.profile_image_url);
          }
        } else {
          // setErrorMessage(result.statusMessage || 'Failed to fetch data');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  console.log(formData);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.nid.trim()) newErrors.nid = "NID number is required";
    if (formData.nid.length !== 10) newErrors.nid = "NID must be 10 digits";
    if (!formData.date_of_birth || validateDateOfBirth(formData.date_of_birth))
      newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.thana.trim()) newErrors.thana = "Thana is required";
    if (!formData.village.trim()) newErrors.village = "Village is required";
    if (!formData.union.trim()) newErrors.union = "Union is required";
    if (!formData.zilla.trim()) newErrors.zilla = "Zilla is required";

    // Image validations
    if (!profileImage && !profileImageUrl)
      newErrors.profile_image = "Profile image is required";
    if (!nidFront && !nidFrontUrl)
      newErrors.nid_front = "NID front image is required";
    if (!nidBack && !nidBackUrl)
      newErrors.nid_back = "NID back image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDateOfBirth = (dob: string): string | undefined => {
    // if (!dob) return "Date of birth is required";

    const selectedDate = new Date(dob);
    const today = new Date();

    if (selectedDate > today) {
      return "Date of birth cannot be in the future";
    }

    const ageDiffMs = today.getTime() - selectedDate.getTime();
    const ageDate = new Date(ageDiffMs); // Epoch time to age
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18) {
      return "You must be at least 18 years old";
    }

    return undefined; // no error
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });

    if (name === "date_of_birth") {
      const error = validateDateOfBirth(value);
      setErrors((prev) => ({
        ...prev,
        date_of_birth: error ?? "",
      }));
    }
  };

  const handlePhotoCapture = (
    file: File,
    property: string,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setImage(file);
    // updateStep({
    //     [property]: file,
    // });
    console.log("Photo captured:", file);
  };

  const resetFormData = () => {
    setFormData({
      userType: localStorage.getItem("userId") || "",
      first_name: "",
      last_name: "",
      nid: "",
      date_of_birth: "",
      gender: "Male",
      tin: "",
      thana: "",
      upazila: "",
      zilla: "",
      union: "",
      village: "",
    });
    // setProfileImage(null);
    // setNidFront(null);
    // setNidBack(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please provide the informations correctly.");
      return;
    }

    setIsLoading(true); // Show loading spinner
    setSuccessMessage(null); // Reset success message

    const formElementData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formElementData.entries());
    const multipartFormData = new FormData();
    multipartFormData.append("profile_image", profileImage as Blob);
    multipartFormData.append("nid_front", nidFront as Blob);
    multipartFormData.append("nid_back", nidBack as Blob);
    multipartFormData.append("first_name", formData.first_name);
    multipartFormData.append("last_name", formData.last_name);
    multipartFormData.append("nid", formData.nid);
    multipartFormData.append("date_of_birth", formData.date_of_birth);
    multipartFormData.append("gender", formData.gender);
    multipartFormData.append("tin", formData.tin);
    multipartFormData.append("thana", formData.thana);
    multipartFormData.append("zilla", formData.zilla);

    multipartFormData.append("village", formData.village);
    multipartFormData.append("union", formData.union);

    for (const [key, value] of Object.entries(data)) {
      multipartFormData.append(key, value as string);
    }

    console.log("Form data prepared for submission:");
    multipartFormData.forEach((value, key) => {
      console.log(key, value);
    });

    const authToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/personal-info/`,
        {
          method: "POST",
          body: multipartFormData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();
      console.log(result.data);

      if (response.ok) {
        setSuccessMessage("Form submitted successfully!");
        resetFormData();
      } else if (response.status === 400) {
        setErrorMessage(result.data.message);
      } else if (response.status === 401) {
        setSessionExpired(true);
        console.log(unauthorized);
        // Show session expired dialog
      } else {
        throw new Error(result.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Something went wrong. Please try again.\nError: ${error}`);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };
  return (
    <div className="p-2 md:p-6 rounded-md">
      <SectionHeading
        sectionTitle="Personal Information"
        description="Manage your personal information and preferences"
        icon={<GoPerson />}
      />
      <form onSubmit={handleSubmit}>
        <div
          data-aos="fade-in"
          data-aos-delay="400"
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-12"
        >
          {/* Profile Image */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="userType"
              className="mb-1 text-sm font-bold text-gray-600"
            >
              Profile Image
            </label>
            {profileImageUrl && (
              <div className="mt-2 text-center flex items-center justify-center">
                <FallbackImage
                  src={profileImageUrl}
                  alt="Profile Image"
                  width={128}
                  height={128}
                  className="w-[30%] object-cover rounded-full"
                  placeholderSrc="/userplaceholder.jpg"
                />
              </div>
            )}
            <PhotoCaptureModal
              onPhotoCapture={(file) =>
                handlePhotoCapture(file, "profile_image", setprofileImage)
              }
              triggerText="Capture profile Image"
              title="Capture profile Image"
            />
            {errors.profile_image && (
              <p className="text-red-600 text-sm mt-1">
                {errors.profile_image}
              </p>
            )}
            {profileImage && (
              <div className="mt-2 text-center">
                <Image
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile Image"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover border rounded-full"
                />
              </div>
            )}
          </div>

          {/* Phone Number (Read-only) */}
          <InputField
            placeholder=""
            label="Phone Number"
            id="userType"
            name="userType"
            value={phoneNumber || ""}
            onChange={handleInputChange}
            disabled
          />

          {/* First & Last Name */}
          <InputField
            placeholder="Enter first name"
            type="text"
            label="First Name"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            error={errors.first_name}
          />

          <InputField
            placeholder="Enter last name"
            type="text"
            label="Last Name"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            error={errors.last_name}
          />

          {/* Gender */}
          <div className="relative w-full flex flex-col">
            <label
              htmlFor="gender"
              className="mb-1 text-sm font-bold text-gray-600"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`appearance-none w-full border bg-gray-50 rounded-md p-2 pr-10 font-semibold cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50
          ${errors.gender ? "border-red-600" : "border-gray-300"}`}
            >
              <option value="" disabled className="text-sm text-gray-400">
                Select gender
              </option>
              <option value="male" className="text-sm text-gray-700">
                Male
              </option>
              <option value="female" className="text-sm text-gray-700">
                Female
              </option>
              <option value="other" className="text-sm text-gray-700">
                Other
              </option>
            </select>
            <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
              <IoMdArrowDropdown className="text-xl" />
            </div>
            {errors.gender && (
              <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="relative w-full">
            <InputField
              label="Date of Birth"
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              error={errors.date_of_birth}
              // max={new Date().toISOString().split("T")[0]}
            />
            <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
              <MdOutlineCalendarToday className="text-lg" />
            </div>
          </div>

          {/* NID Front */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-gray-600">
              NID Front
            </label>
            {nidFront && (
              <PhotoCaptureModal
                onPhotoCapture={(file) =>
                  handlePhotoCapture(file, "nid_front", setnidFront)
                }
                triggerText="Click to upload front image"
                title="Capture NID Front"
              />
            )}
            {errors.nid_front && (
              <p className="text-red-600 text-sm mt-1">{errors.nid_front}</p>
            )}
            {(nidFront || nidFrontUrl) && (
              <div className="mt-2 text-center flex items-center justify-center">
                <FallbackImage
                  src={
                    nidFront ? URL.createObjectURL(nidFront) : nidFrontUrl || ""
                  }
                  alt="NID Front"
                  width={128}
                  height={128}
                  className="w-[50%] object-cover rounded"
                  placeholderSrc="/front.png"
                />
              </div>
            )}
          </div>

          {/* NID Back */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-gray-600">
              NID Back
            </label>
            {nidBack && (
              <PhotoCaptureModal
                onPhotoCapture={(file) =>
                  handlePhotoCapture(file, "nid_back", setnidBack)
                }
                triggerText="Click to upload back image"
                title="Capture NID Back"
              />
            )}
            {errors.nid_back && (
              <p className="text-red-600 text-sm mt-1">{errors.nid_back}</p>
            )}
            {(nidBack || nidBackUrl) && (
              <div className="mt-2 text-center flex items-center justify-center">
                <FallbackImage
                  src={
                    nidBack ? URL.createObjectURL(nidBack) : nidBackUrl || ""
                  }
                  alt="NID Back"
                  width={128}
                  height={128}
                  className="w-[50%] object-cover rounded"
                  placeholderSrc="/back.png"
                />
              </div>
            )}
          </div>

          {/* NID Number */}
          <InputField
            placeholder="Enter NID number"
            label="NID (10 digit number)"
            id="nid"
            name="nid"
            type="text"
            maxLength={10}
            value={formData.nid}
            onChange={handleInputChange}
            error={errors.nid}
          />

          {/* Address Fields */}
          <InputField
            placeholder="Enter TIN number"
            label="TIN No."
            id="tin"
            name="tin"
            value={formData.tin}
            onChange={handleInputChange}
            error={errors.tin}
          />

          <InputField
            placeholder="Enter thana"
            label="Thana"
            id="thana"
            name="thana"
            value={formData.thana}
            onChange={handleInputChange}
            error={errors.thana}
          />

          <InputField
            placeholder="Enter village"
            label="Village"
            id="village"
            name="village"
            value={formData.village}
            onChange={handleInputChange}
            error={errors.village}
          />

          <InputField
            placeholder="Enter union"
            label="Union"
            id="union"
            name="union"
            value={formData.union}
            onChange={handleInputChange}
            error={errors.union}
          />

          <InputField
            placeholder="Enter zilla"
            label="Zilla"
            id="zilla"
            name="zilla"
            value={formData.zilla}
            onChange={handleInputChange}
            error={errors.zilla}
          />
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-2 mt-10 md:mt-8">
          <ActionButton btnText="Save Information" type="submit" />
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
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
          <p>{successMessage}</p>
        </div>
      )}

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

      <AIChatWidget
        onFormStateChange={(state) => {
          console.log("Form state changed:", state);
          // Update formData with the new state from AI chat widget
          setFormData((prevData) => ({
            ...prevData,
            ...state,
          }));
        }}
        formSchema={
          // Define the form schema
          {
            first_name:
              "First name of the farmer , first name convert to english and first name can have more then one word",
            last_name:
              "Last name of the farmer,Last name convert to english and Last name can have more then one word",
            nid: "National ID number of the farmer",
            date_of_birth: "Date of birth in DD-MM-YYYY format",
            gender: "Gender of the farmer (Male/Female/Other)",
            tin: "Tax Identification Number of the farmer",
            thana: "Thana (Police Station) of the farmer's address",
            zilla: "Zilla (District) of the farmer's address",
            union: "Union (Local administrative unit) of the farmer's address",
            village: "Village name of the farmer's address",
          }
        }
      />

      {/* <AIInterface onClose={()=>{}} /> */}
    </div>
  );
};

export default PersonalInfo;
