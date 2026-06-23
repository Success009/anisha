import React, { useState } from 'react';

/**
 * Reusable input component with dynamic autocomplete.
 * Scans all currently entered courses to provide recommendations.
 */
export default function AutocompleteInput({
  label,
  required = false,
  placeholder,
  value,
  onChange,
  courses,
  field,
  className = ""
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Compute unique values already entered for this field in the database
  const getOptions = () => {
    if (!value || typeof value !== 'string') return [ ];
    const query = value.toLowerCase().trim();
    if (!query) return [ ];

    const uniqueValues = Array.from(
      new Set(
        courses
          .map(c => c[field])
          .filter(val => typeof val === 'string' && val.trim().length > 0)
      )
    );

    return uniqueValues.filter(val => 
      val.toLowerCase().includes(query) && 
      val.toLowerCase() !== query
    );
  };

  const options = getOptions();

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay hiding options so onMouseDown can trigger click selection
          setTimeout(() => setIsFocused(false), 200);
        }}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
      />
      
      {isFocused && options.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
          {options.map((opt, i) => (
            <div
              key={i}
              onMouseDown={() => onChange(opt)}
              className="px-4 py-2 hover:bg-indigo-50 text-slate-700 text-sm cursor-pointer transition-colors duration-150"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
