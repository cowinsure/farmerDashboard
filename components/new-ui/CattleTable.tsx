import React from "react";
import {
  Column,
  DataTable,
  ImageCell,
  StatusIndicator,
  ViewButton,
} from "./ui/DataTable";
import { Asset } from "@/app/(dashboard)/farmer/page";

interface CattleTableProps {
  data: Asset[];
  onView?: (asset: Asset) => void;
  className?: string;
  maxHeight?: string;
  isLoading?: boolean;
}

export function CattleTable({
  data,
  onView,
  className,
  maxHeight,
  isLoading,
}: CattleTableProps) {
  const columns: Column<Asset>[] = [
    {
      key: "left_side_image",
      header: "Cow Image",
      width: "80px",
      className: "text-center",
      render: (value, row) => (
        <span className="flex items-center justify-center w-full">
          {" "}
          <ImageCell src={value} alt={`${row.breed} cow`} />
        </span>
      ),
    },
    {
      key: "asset_type",
      header: "Asset Type",
      width: "120px",
      className: "text-center",
    },
    {
      key: "breed",
      header: "Breed",
      width: "120px",
      className: "text-center",
      render: (value) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
          {value}
        </span>
      ),
    },
    {
      key: "color",
      header: "Color",
      width: "100px",
      className: "text-center",
    },
    {
      key: "age_in_months",
      header: "Age (months)",
      width: "110px",
      className: "text-center",
    },
    {
      key: "weight_kg",
      header: "Weight (KG)",
      width: "110px",
      className: "text-center",
    },
    {
      key: "height",
      header: "Height",
      width: "80px",
      className: "text-center",
    },
    {
      key: "vaccination_status",
      header: "Vaccination",
      width: "110px",
      className: "text-center",
      render: (value) => (
        <StatusIndicator
          status={value === true || value === "true" ? true : false}
        />
      ),
    },
    {
      key: "deworming_status",
      header: "Deworming",
      width: "110px",
      className: "text-center",
      render: (value) => (
        <StatusIndicator
          status={value === true || value === "true" ? true : false}
        />
      ),
    },
    {
      key: "gender",
      header: "Gender",
      width: "100px",
      className: "text-center",
    },
    {
      key: "id",
      header: "View",
      width: "60px",
      className: "text-center",
      sticky: "right",
      render: (_, row) => <ViewButton onClick={() => onView?.(row)} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      className={className}
      maxHeight={maxHeight}
      isLoading={isLoading}
    />
  );
}
