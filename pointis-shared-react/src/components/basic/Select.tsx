// TODO update it later

import React from 'react';

interface SelectProps {
    options: { label: string; value: string }[];
    onChange: (value: { value: string }) => void;
    initialValue?: string;
}

const Select: React.FC<SelectProps> = ({ options, onChange }) => {
    return (
        <select onChange={(e) => onChange({ value: e.target.value })}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;
