import React, { useState, useEffect, useRef } from "react";
import { Dropdown, FormControl } from "react-bootstrap";

const SearchableDropdown = ({ options, onSelect, selectedLanguage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.LanguageName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <Dropdown
      show={isOpen}
      onToggle={(isOpen) => setIsOpen(isOpen)}
      ref={dropdownRef}
    >
      <Dropdown.Toggle>{selectedLanguage.LanguageName}</Dropdown.Toggle>

      <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={handleSearch}
          value={searchTerm}
        />
        {filteredOptions.slice(0, 5).map((option) => (
          <Dropdown.Item
            key={option.LanguageCode}
            onClick={() => handleSelect(option)}
          >
            {option.LanguageName}
          </Dropdown.Item>
        ))}
        {filteredOptions.length > 5 && (
          <Dropdown.Item disabled>
            {filteredOptions.length - 5} more options...
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SearchableDropdown;
