'use client';

import React, { useState } from 'react';

interface TagPickerProps {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
  locale?: 'ja' | 'en';
}

export default function TagPicker({
  label,
  options,
  selected,
  onChange,
  maxSelections,
  locale = 'ja',
}: TagPickerProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      if (maxSelections && selected.length >= maxSelections) {
        return;
      }
      onChange([...selected, tag]);
    }
  };

  const helperText = maxSelections
    ? locale === 'ja'
      ? `最大${maxSelections}個まで選択できます (${selected.length}/${maxSelections})`
      : `Select up to ${maxSelections} (${selected.length}/${maxSelections})`
    : null;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const isSelected = selected.includes(tag);
          const isDisabled = maxSelections && selected.length >= maxSelections && !isSelected;

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              disabled={isDisabled}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {helperText && (
        <p className="mt-2 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
