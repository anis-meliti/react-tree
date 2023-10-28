import { React, useState } from "react";
import { useAsyncDebounce } from "react-table";

export const Filter = ({ globalFilter, setGlobalFilter }) => {
  // default input field value
  const [value, setValue] = useState(globalFilter);
  // Update value on change
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div>
      Filter results:
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Filter through results...`}
        style={{
          marginLeft: "15px",
          borderRadius: "10px",
          padding: "4px 5px"
        }}
      />
    </div>
  );
};
