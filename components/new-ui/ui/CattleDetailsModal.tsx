// CattleDetailsModal.tsx
"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaMoneyBillAlt,
  FaUser,
} from "react-icons/fa";
// import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { RxIdCard } from "react-icons/rx";
import { FaDollarSign } from "react-icons/fa6";
import { MdOutlinePermMedia, MdCategory } from "react-icons/md";
import { IoColorPaletteSharp } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GiCow } from "react-icons/gi";

interface CattleData {
  id: number;
  owner: string;
  asset_type: string;
  breed: string;
  color?: string;
  age_in_months?: number;
  weight_kg?: string;
  height?: string;
  vaccination_status?: string;
  last_vaccination_date?: string;
  deworming_status?: string;
  last_deworming_date?: string;
  health_status?: string;
  gender: string;
  muzzle_video?: string;
  left_side_image?: string;
  right_side_image?: string;
  challan_paper?: string;
  vet_certificate?: string;
  chairman_certificate?: string;
  special_mark?: string;
  image_with_owner?: string;
  purchase_date?: string;
  purchase_from?: string;
  purchase_amount?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  cattle: CattleData;
}

export default function CattleDetailsModal({
  isOpen,
  onClose,
  cattle,
}: ModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const genderIcon =
  //     cattle.gender.toLowerCase() === "male" ? (
  //       <PiGenderMaleBold />
  //     ) : (
  //       <PiGenderFemaleBold />
  //     );

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-5xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <DialogTitle as="h3" className="text-xl font-bold">
                  Cattle Details
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-red-500"
                >
                  <IoClose size={24} className="cursor-pointer" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 overflow-y-auto max-h-[80vh]">
                {/* Basic Info */}
                <div className="bg-gray-50 border rounded-xl p-4 space-y-3">
                  {/* Image */}
                  <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                    <div className="w-full h-92 bg-gray-800 flex items-center justify-center rounded-lg overflow-hidden">
                      {cattle.left_side_image ? (
                        <Image
                          src={cattle.left_side_image}
                          alt="Left side"
                          width={140}
                          height={140}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          No Image Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 border rounded-xl p-4">
                  <ModalHeader icon={<RxIdCard />} header="Basic Information" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                    <DetailsSection
                      icon={<FaCalendarAlt />}
                      label="Age"
                      value={cattle.age_in_months}
                      text="months"
                    />
                    <DetailsSection
                      icon={<FaWeight />}
                      label="Weight"
                      value={cattle.weight_kg}
                      text="kg"
                    />
                    <DetailsSection
                      icon={<FaRulerVertical />}
                      label="Height"
                      value={cattle.height}
                      text="ft"
                    />
                    <DetailsSection
                      icon={<IoColorPaletteSharp />}
                      label="Color"
                      value={cattle.color}
                    />
                    <DetailsSection
                      icon={<MdCategory size={20} />}
                      label="Asset Type"
                      value={cattle.asset_type}
                    />
                    <DetailsSection
                      icon={<GiCow size={20} />}
                      label="Breed"
                      value={cattle.breed}
                    />
                    <DetailsSection
                      icon={<GiCow size={20} />}
                      label="Gender"
                      value={cattle.gender}
                    />
                  </div>
                </div>

                {/* Health Info */}
                <div className="bg-gray-50 border rounded-xl p-4 space-y-8">
                  <ModalHeader
                    icon={<FaRegHeart />}
                    header="Health Information"
                  />
                  <div className="grid sm:grid-cols-2 gap-8">
                    <DetailsSection
                      icon={<IoMdInformationCircleOutline size={25} />}
                      label="Health Status"
                      value={cattle.health_status || "N/A"}
                    />
                    <DetailsSection
                      icon={<IoMdInformationCircleOutline size={25} />}
                      label="Vaccination"
                      value={cattle.vaccination_status || "N/A"}
                    />
                    <DetailsSection
                      icon={<IoMdInformationCircleOutline size={25} />}
                      label="Last Vaccination"
                      value={cattle.last_vaccination_date || "N/A"}
                    />
                    <DetailsSection
                      icon={<IoMdInformationCircleOutline size={25} />}
                      label="Deworming"
                      value={cattle.deworming_status || "N/A"}
                    />
                    <DetailsSection
                      icon={<IoMdInformationCircleOutline size={25} />}
                      label="Last Deworming"
                      value={cattle.last_deworming_date || "N/A"}
                    />
                  </div>
                </div>

                {/* Purchase Info */}
                <div className="bg-gray-50 border rounded-xl p-4 space-y-8">
                  <ModalHeader
                    icon={<FaDollarSign />}
                    header="Purchase & Ownership"
                  />

                  <div className="grid md:grid-cols-2 gap-8">
                    <DetailsSection
                      label="Purchase Amount"
                      value={
                        cattle.purchase_amount
                          ? parseInt(cattle.purchase_amount).toLocaleString()
                          : "-"
                      }
                      icon={<FaMoneyBillAlt />}
                    />

                    <DetailsSection
                      label="Purchase Date"
                      value={cattle.purchase_date}
                      icon={<FaCalendarAlt />}
                    />

                    <DetailsSection
                      label="Purchase From"
                      value={cattle.purchase_from}
                      icon={<MdOutlineLocationOn size={20} />}
                    />

                    <DetailsSection
                      label="Owner"
                      value={cattle.owner}
                      icon={<FaUser />}
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="col-span-full bg-gray-50 border rounded-xl p-4">
                  <ModalHeader
                    icon={<MdOutlinePermMedia />}
                    header="Media Information"
                  />
                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    {[
                      ["Right Side Image", cattle.right_side_image],
                      ["Special Mark", cattle.special_mark],
                      ["Image with Owner", cattle.image_with_owner],
                      ["Challan Paper", cattle.challan_paper],
                      ["Vet Certificate", cattle.vet_certificate],
                      ["Chairman Certificate", cattle.chairman_certificate],
                    ].map(([label, url]) => (
                      <div
                        key={label as string}
                        className="border rounded-xl flex flex-col items-center justify-center gap-5 p-2"
                      >
                        <span className="font-semibold text-sm">{label}</span>
                        {url ? (
                          <Image
                            src={url as string}
                            alt={label as string}
                            width={200}
                            height={140}
                            className="rounded-md object-cover border flex-1"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No File</span>
                        )}
                      </div>
                    ))}
                    <div className="flex flex-col gap-4 items-center justify-center p-2 rounded-xl border">
                      <span className="font-semibold text-sm">
                        Muzzle Video:
                      </span>
                      {cattle.muzzle_video ? (
                        <video
                          src={cattle.muzzle_video}
                          controls
                          className="w-full h-40 rounded-md flex-1"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Video</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface HeaderProps {
  icon: React.ReactNode;
  header: string;
}
interface DetailsProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number | undefined;
  text?: string;
}

const ModalHeader = ({ icon, header }: HeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl text-green-600">{icon}</span>
      <h4 className="font-semibold text-lg text-green-700">{header}</h4>
    </div>
  );
};

const DetailsSection = ({ icon, label, value, text }: DetailsProps) => {
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <span className="text-green-700 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          {icon}
        </span>
      )}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <span className="font-bold text-gray-800">
          <span className="">{value}</span> {text}
        </span>
      </div>
    </div>
  );
};
