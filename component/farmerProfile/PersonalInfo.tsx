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

const PersonalInfo: React.FC = () => {
  // const handleInputChangen = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
  //     setState(e.target.value);
  // };
  const router = useRouter();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-8"
        >
          {/* Profile Image Column */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="userType"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Profile Image
            </label>
            <PhotoCaptureModal
              onPhotoCapture={(file) =>
                handlePhotoCapture(file, "profile_image", setprofileImage)
              }
              triggerText="Capture profile Image"
              title="Capture profile Image"
            />
            {profileImage && (
              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium mb-1">Profile Image</h3>
                <Image
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile Image"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover border rounded-full"
                />
              </div>
            )}
            {profileImageUrl && (
              <div className="mt-2 text-center flex items-center justify-center">
                {/* <h3 className="text-sm font-medium mb-1">Profile Image</h3> */}
                <Image
                  src={profileImageUrl}
                  alt="Profile Image"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover border rounded-full"
                />
              </div>
            )}
          </div>

          {/* User Type */}
          <InputField
            placeholder=""
            label="User Type"
            id="userType"
            name="userType"
            value={formData.userType || ""}
            onChange={handleInputChange}
            disabled
          />

          {/* First & Last Name */}
          <InputField
            placeholder="Enter first name"
            label="First Name"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />

          <InputField
            placeholder="Enter last name"
            label="Last Name"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
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
              required
              className="appearance-none w-full border border-gray-300 bg-gray-50 rounded-md p-2 pr-10 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-green-50 hover:bg-green-50 hover:border-green-300"
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

            {/* Custom dropdown icon */}
            <div className="pointer-events-none absolute right-3 top-8.5 text-gray-400">
              <IoMdArrowDropdown className="text-xl" />
            </div>
          </div>

          {/* Date of Birth  */}
          <div className="relative w-full">
            <InputField
              label="Date of Birth"
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              required
            />

            {/* Custom calendar icon */}
            <div className="pointer-events-none absolute right-3 bottom-2.5 text-gray-400">
              <MdOutlineCalendarToday className="text-lg" />
            </div>
          </div>

          {/* NID Front */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-gray-600">
              NID Front
            </label>
            <PhotoCaptureModal
              onPhotoCapture={(file) =>
                handlePhotoCapture(file, "nid_front", setnidFront)
              }
              triggerText="Click to upload front image"
              title="Capture NID Front"
            />
            {(nidFront || nidFrontUrl) && (
              <div className="mt-2 text-center flex items-center justify-center">
                {/* <h3 className="text-sm font-medium mb-1">NID Front</h3> */}
                <Image
                  src={
                    nidFront ? URL.createObjectURL(nidFront) : nidFrontUrl || ""
                  }
                  alt="NID Front"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>

          {/* NID Back */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-gray-600">
              NID Back
            </label>
            <PhotoCaptureModal
              onPhotoCapture={(file) =>
                handlePhotoCapture(file, "nidBackFile", setnidBack)
              }
              triggerText="Click to upload back image"
              title="Capture NID Back"
            />
            {(nidBack || nidBackUrl) && (
              <div className="mt-2 text-center flex items-center justify-center">
                {/* <h3 className="text-sm font-medium mb-1">NID Back</h3> */}
                <Image
                  src={
                    nidBack ? URL.createObjectURL(nidBack) : nidBackUrl || ""
                  }
                  alt="NID Back"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>

          {/* NID number */}
          <InputField
            placeholder="Enter NID number"
            label="NID (10 digit number)"
            id="nid"
            name="nid"
            type="text"
            maxLength={10}
            value={formData.nid}
            onChange={handleInputChange}
            required
          />

          {/* Address Fields */}
          <InputField
            placeholder="Enter TIN number"
            label="TIN No."
            id="tin"
            name="tin"
            value={formData.tin}
            onChange={handleInputChange}
          />

          <InputField
            placeholder="Enter thana"
            label="Thana"
            id="thana"
            name="thana"
            value={formData.thana}
            onChange={handleInputChange}
          />

          <InputField
            placeholder="Enter village"
            label="Village"
            id="village"
            name="village"
            value={formData.village}
            onChange={handleInputChange}
          />

          <InputField
            placeholder="Enter union"
            label="Union"
            id="union"
            name="union"
            value={formData.union}
            onChange={handleInputChange}
          />

          <InputField
            placeholder="Enter zilla"
            label="Zilla"
            id="zilla"
            name="zilla"
            value={formData.zilla}
            onChange={handleInputChange}
          />
        </div>

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
    </div>
  );
};

export default PersonalInfo;
