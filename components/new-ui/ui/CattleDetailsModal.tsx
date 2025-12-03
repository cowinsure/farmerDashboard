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
import { FaCalendarAlt, FaMoneyBillAlt, FaUser } from "react-icons/fa";
// import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { RxIdCard } from "react-icons/rx";
import { FaDollarSign } from "react-icons/fa6";
import { MdOutlinePermMedia, MdOutlineCalendarToday } from "react-icons/md";
import { IoColorPaletteSharp } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TfiRuler } from "react-icons/tfi";
import { LiaWeightSolid } from "react-icons/lia";
import { LuSyringe } from "react-icons/lu";
import FallbackImage from "../utils/FallBackImage";
import { QRCodeSVG } from "qrcode.react";
interface CattleData {
  id: number;
  owner: string;
  asset_type: string;
  breed: string;
  color?: string;
  reference_id?: string;
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

              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:p-4 overflow-x-hidden overflow-y-auto md:overflow-y-hidden max-h-[80vh] md:max-h-auto">
                {/* Basic Info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 md:col-span-2 shadow-xs md:sticky md:top-0 md:self-start">
                  <div className="flex flex-col gap-8 items-center h-full">
                    {/* Image */}
                    <div className="w-64 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                      {cattle.left_side_image ? (
                        <FallbackImage
                          src={cattle.left_side_image as string}
                          alt={"Image" as string}
                          width={256}
                          height={256}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          No Image Available
                        </span>
                      )}
                    </div>

                    <div className="w-full space-y-3 min-w-[250px]">
                      <div className="flex items-center gap-2">
                        <div className="flex justify-between items-center w-full px-1">
                          <label className="text-sm font-medium text-gray-500">Cow ID</label>
                          <span className="font-semibold text-gray-700">
                            <span className="px-3 py-1 border border-gray-200 rounded-full break-all max-w-[250px]">
                              {cattle.reference_id ? cattle.reference_id : "N/A"}
                            </span>
                          </span>
                        </div>
                      </div>
                      {/* QR Code for Cow ID */}
                      {cattle.reference_id && (
                        <div className="flex flex-col items-center mt-3 mb-2">
                          <span className="text-sm font-medium text-gray-600 mb-2">QR Code</span>
                          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <QRCodeSVG
                              value={cattle.reference_id}
                              size={128}
                              bgColor="#ffffff"
                              fgColor="#000000"
                              level="Q"
                              includeMargin={false}
                            />
                          </div>
                        </div>
                      )}
                      <CowCardData
                        // icon={<MdCategory size={20} />}
                        label="Asset Type"
                        value={cattle.asset_type}
                      />
                      <CowCardData
                        // icon={<GiCow size={20} />}
                        label="Breed"
                        value={cattle.breed}
                      />
                      <CowCardData
                        // icon={<GiCow size={20} />}
                        label="Gender"
                        value={cattle.gender}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="md:col-span-3 space-y-5 md:max-h-[80vh] md:overflow-y-auto">
                  {/* Basic Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <ModalHeader
                      icon={<RxIdCard />}
                      header="Basic Information"
                    />
                    <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                      <DetailsSection
                        icon={<MdOutlineCalendarToday size={20} />}
                        label="Age"
                        value={cattle.age_in_months}
                        text="months"
                        className="text-green-700 bg-green-200"
                      />
                      <DetailsSection
                        icon={<LiaWeightSolid size={25} />}
                        label="Weight"
                        value={cattle.weight_kg}
                        text="kg"
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        icon={<TfiRuler size={20} />}
                        label="Height"
                        value={cattle.height}
                        text="ft"
                        className="text-purple-700 bg-purple-200"
                      />
                      <DetailsSection
                        icon={<IoColorPaletteSharp />}
                        label="Color"
                        value={cattle.color}
                        className="text-yellow-700 bg-yellow-200"
                      />
                    </div>
                  </div>

                  {/* Health Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-8">
                    <ModalHeader
                      icon={<FaRegHeart />}
                      header="Health Information"
                    />
                    <div className="grid sm:grid-cols-2 gap-8">
                      {/* <div className="sm:col-span-2">
                        <DetailsSection
                          icon={<IoMdInformationCircleOutline size={25} />}
                          label="Health Status"
                          value={cattle.health_status || "N/A"}
                          className="text-green-700 bg-green-200"
                        />
                      </div> */}
                      <DetailsSection
                        icon={<LuSyringe size={20} />}
                        label="Vaccination"
                        value={cattle.vaccination_status || "N/A"}
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        icon={<LuSyringe size={20} />}
                        label="Last Vaccination"
                        value={cattle.last_vaccination_date || "N/A"}
                        className="text-red-700 bg-red-200"
                      />
                      <DetailsSection
                        icon={<IoMdInformationCircleOutline size={25} />}
                        label="Deworming"
                        value={cattle.deworming_status || "N/A"}
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        icon={<IoMdInformationCircleOutline size={25} />}
                        label="Last Deworming"
                        value={cattle.last_deworming_date || "N/A"}
                        className="text-red-700 bg-red-200"
                      />
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-8">
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
                        className="text-green-700 bg-green-200"
                      />
                      <DetailsSection
                        label="Purchase Date"
                        value={cattle.purchase_date}
                        icon={<FaCalendarAlt size={15} />}
                        className="text-blue-700 bg-blue-200"
                      />
                      <DetailsSection
                        label="Purchase From"
                        value={cattle.purchase_from}
                        icon={<MdOutlineLocationOn size={20} />}
                        className="text-purple-700 bg-purple-200"
                      />
                      <DetailsSection
                        label="Owner"
                        value={cattle.owner}
                        icon={<FaUser size={15} />}
                        className="text-yellow-700 bg-yellow-200 "
                      />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
                    <ModalHeader
                      icon={<MdOutlinePermMedia />}
                      header="Media Information"
                    />
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
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
                          className="border rounded-xl flex flex-col items-center justify-center gap-3 p-4 text-center bg-white"
                        >
                          <span className="font-semibold text-sm truncate w-full">
                            {label}
                          </span>
                          {url ? (
                            <FallbackImage
                              src={url as string}
                              alt={label as string}
                              width={200}
                              height={140}
                              className="rounded-md object-cover border w-full h-48"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No File
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Muzzle Video */}
                      <div className="flex flex-col gap-3 items-center justify-center p-4 rounded-xl border text-center bg-white">
                        <span className="font-semibold text-sm">
                          Muzzle Video
                        </span>
                        {cattle.muzzle_video ? (
                          <video
                            src={cattle.muzzle_video}
                            controls
                            className="w-full h-64 rounded-md object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Video
                          </span>
                        )}
                      </div>
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
  className?: string;
}

const ModalHeader = ({ icon, header }: HeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl text-gray-800">{icon}</span>
      <h4 className="font-semibold text-lg text-gray-800">{header}</h4>
    </div>
  );
};

const DetailsSection = ({
  icon,
  label,
  value,
  text,
  className,
}: DetailsProps) => {
  return (
    <div className="flex items-center gap-2">
      <div>
        {icon && (
          <span
            className={` w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              className ? className : "text-gray-600 bg-gray-100"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between w-full">
        <label className="text-sm text-gray-500">{label}</label>
        <span className="font-bold text-[#4e4e4e]">
          <span className="">{value}</span> {text}
        </span>
      </div>
    </div>
  );
};

const CowCardData = ({ icon, label, value }: DetailsProps) => {
  return (
    <div className="flex items-center gap-2">
      {icon && (
        <span className="text-green-700 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          {icon}
        </span>
      )}
      <div className="flex justify-between items-center w-full px-1">
        <label className="text-sm font-medium text-gray-500">{label ? label : "-"}</label>
        <span className="font-semibold text-gray-700">
          <span className="px-3 py-1 border border-gray-200 rounded-full break-all max-w-[200px]">
            {value ? value : "N/A"}
          </span>
        </span>
      </div>
    </div>
  );
};
