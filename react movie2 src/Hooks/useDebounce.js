import React from "react";
import { useState, useEffect } from "react";
export default function useDebounce(value, delay) {
  const [debounce, setDebounce] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => {
      clearTimeout(delay);
    };
  }, [value, delay]);

  return debounce;
}
