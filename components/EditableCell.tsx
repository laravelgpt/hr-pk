import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  isNumeric?: boolean;
  disableHoverEffect?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({ 
  initialValue, 
  onSave, 
  className, 
  inputClassName,
  isNumeric = false, 
  disableHoverEffect = false,
  style,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    // Revert to initial value if the new value is empty
    const newValue = value.trim();
    if (newValue === '') {
      setValue(initialValue);
    } else if (newValue !== initialValue) {
      onSave(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric) {
      // Allow numbers, decimal point, and currency symbols for display purposes.
      // The saving logic in App.tsx will handle final parsing.
      const sanitizedValue = e.target.value.replace(/[^0-9. SRsr]/g, '');
      setValue(sanitizedValue);
    } else {
      setValue(e.target.value);
    }
  };
  
  const hoverClass = disableHoverEffect ? '' : 'hover:bg-blue-100/50';
  const defaultInputClassName = "w-full bg-white text-gray-800 text-center border-2 border-blue-400 rounded-md p-2 outline-none shadow-inner";

  if (isEditing) {
    return (
      <div className={`flex items-center ${className}`} style={style}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={inputClassName || defaultInputClassName}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && setIsEditing(true)}
      className={`flex items-center transition-colors duration-200 ${!disabled && hoverClass} ${className} ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
      style={style}
    >
      {value}
    </div>
  );
};

export default EditableCell;