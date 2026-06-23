"use client";

import { SRI_LANKAN_CITIES } from "@/lib/constants";

export default function CitySelect({ value, onChange, placeholder = "Select city", name }) {
  return (
    <select
      className="input"
      value={value || ""}
      name={name}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {SRI_LANKAN_CITIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

