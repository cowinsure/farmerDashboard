/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import SectionHeading from "@/components/new-ui/utils/SectionHeading";
import { ImageUploadBlock } from "@/components/new-ui/ui/ImageUploadBlock";

const StepFour: React.FC = () => {
  const { data, updateStep, validateStep } = useCowRegistration();

  const [images, setImages] = useState({
    special_mark: null as File | null,
    left_side_image: null as File | null,
    right_side_image: null as File | null,
    image_with_owner: null as File | null,
    vet_certificate: null as File | null,
    challan_paper: null as File | null, // optional
    chairman_certificate: null as File | null, // optional
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const requiredFields = React.useMemo<(keyof typeof images)[]>(
    () => [
      "special_mark",
      "left_side_image",
      "right_side_image",
      "image_with_owner",
      "vet_certificate",
    ],
    []
  );

  const updateImage = (key: keyof typeof images, file: File | null) => {
    setImages((prev) => ({ ...prev, [key]: file }));
    updateStep({
      [key]: file,
    });

    if (file && errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    if (data) {
      setImages({
        special_mark: data.special_mark || null,
        left_side_image: data.left_side_image || null,
        right_side_image: data.right_side_image || null,
        image_with_owner: data.image_with_owner || null,
        vet_certificate: data.vet_certificate || null,
        challan_paper: data.challan_paper || null,
        chairman_certificate: data.chairman_certificate || null,
      });
    }
  }, [data]);

  const isValid = requiredFields.every((field) => images[field] !== null);

  useEffect(() => {
    // ✅ Pass required fields (not boolean) into validateStep
    validateStep(requiredFields);

    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach((field) => {
      if (!images[field]) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
  }, [images, requiredFields, validateStep]);

  // 🔹 Restored unused functions
  const handlePhotoCapture = (
    file: File,
    property: string,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    setImage(file);
    updateStep({
      [property]: file,
    });
    console.log("Photo captured:", file);
  };

  const getPreviewUrl = (file: File | null): string | null => {
    return file ? URL.createObjectURL(file) : null;
  };

  return (
    <div className="lg:w-[90%] xl:w-[80%] mx-auto mt-8 p-4">
      <SectionHeading
        marginBottom="8"
        sectionTitle="Add Attachments"
        description="Provide the picture as instructed below and the documents"
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        data-aos="zoom-in"
      >
        <div>
          <ImageUploadBlock
            imageFile={images.right_side_image}
            onCapture={(file) => updateImage("right_side_image", file)}
            title="Right Side Image *"
            fieldKey="right_side_image"
          />
          {errors.right_side_image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.right_side_image}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.left_side_image}
            onCapture={(file) => updateImage("left_side_image", file)}
            title="Left Side Image *"
            fieldKey="left_side_image"
          />
          {errors.left_side_image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.left_side_image}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.image_with_owner}
            onCapture={(file) => updateImage("image_with_owner", file)}
            title="Owner & Cow Image *"
            fieldKey="image_with_owner"
          />
          {errors.image_with_owner && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image_with_owner}
            </p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.special_mark}
            onCapture={(file) => updateImage("special_mark", file)}
            title="Birthmark Image *"
            fieldKey="special_mark"
          />
          {errors.special_mark && (
            <p className="text-red-500 text-sm mt-1">{errors.special_mark}</p>
          )}
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.challan_paper}
            onCapture={(file) => updateImage("challan_paper", file)}
            title="Challan Image (Optional)"
            fieldKey="challan_paper"
          />
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.chairman_certificate}
            onCapture={(file) => updateImage("chairman_certificate", file)}
            title="Chairman Certificate (Optional)"
            fieldKey="chairman_certificate"
          />
        </div>

        <div>
          <ImageUploadBlock
            imageFile={images.vet_certificate}
            onCapture={(file) => updateImage("vet_certificate", file)}
            title="Vet Certificate *"
            fieldKey="vet_certificate"
          />
          {errors.vet_certificate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vet_certificate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepFour;
