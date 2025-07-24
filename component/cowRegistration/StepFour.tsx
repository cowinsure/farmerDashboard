/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useCowRegistration } from "@/context/CowRegistrationContext";
import SectionHeading from "@/components/new-ui/utils/SectionHeading";
import { ImageUploadBlock } from "@/components/new-ui/ui/ImageUploadBlock";

const StepFour: React.FC = () => {
  const { data, updateStep, validateStep, reset } = useCowRegistration();

  const [images, setImages] = useState({
    special_mark: null as File | null,

    left_side_image: null as File | null,
    right_side_image: null as File | null,
    challan_paper: null as File | null,
    vet_certificate: null as File | null,
    chairman_certificate: null as File | null,
    image_with_owner: null as File | null,
  });

  const updateImage = (key: keyof typeof images, file: File | null) => {
    setImages((prev) => ({ ...prev, [key]: file }));
    updateStep({
      [key]: file,
    });
  };
  React.useEffect(() => {
    if (data) {
      setImages({
        left_side_image: data.left_side_image || null,
        right_side_image: data.right_side_image || null,
        image_with_owner: data.image_with_owner || null,
        special_mark: data.special_mark || null,
        challan_paper: data.challan_paper || null,
        chairman_certificate: data.chairman_certificate || null,
        vet_certificate: data.vet_certificate || null,
      });
    }
  }, [data]);

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
    <div className="lg:w-[80%] mx-auto mt-8 p-4">
      <SectionHeading
        marginBottom="8"
        sectionTitle="Add Attachments"
        description="Provide the picture as instructed below and the documents"
      />
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        data-aos="zoom-in"
      >
        <ImageUploadBlock
          imageFile={images.right_side_image}
          onCapture={(file) => updateImage("right_side_image", file)}
          title="Right Side Image"
          fieldKey="right_side_image"
        />
        <ImageUploadBlock
          imageFile={images.left_side_image}
          onCapture={(file) => updateImage("left_side_image", file)}
          title="Left Side Image"
          fieldKey="left_side_image"
        />
        <ImageUploadBlock
          imageFile={images.image_with_owner}
          onCapture={(file) => updateImage("image_with_owner", file)}
          title="Owner & Cow Image"
          fieldKey="image_with_owner"
        />
        <ImageUploadBlock
          imageFile={images.special_mark}
          onCapture={(file) => updateImage("special_mark", file)}
          title="Birthmark Image"
          fieldKey="special_mark"
        />
        <ImageUploadBlock
          imageFile={images.challan_paper}
          onCapture={(file) => updateImage("challan_paper", file)}
          title="Challan Image"
          fieldKey="challan_paper"
        />
        <ImageUploadBlock
          imageFile={images.chairman_certificate}
          onCapture={(file) => updateImage("chairman_certificate", file)}
          title="Chairman Certificate"
          fieldKey="chairman_certificate"
        />
        <ImageUploadBlock
          imageFile={images.vet_certificate}
          onCapture={(file) => updateImage("vet_certificate", file)}
          title="Vet Certificate"
          fieldKey="vet_certificate"
        />
      </div>
    </div>
  );
};

export default StepFour;
