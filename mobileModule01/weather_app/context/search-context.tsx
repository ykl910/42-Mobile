import React, { createContext, useContext, useState } from 'react';

type SearchContextType = {
  query: string;
  setQuery: (query: string) => void;
  geoloc: string;
  setGeoloc: (geoloc: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [geoloc, setGeoloc] = useState('');

  return (
    <SearchContext.Provider value={{ query, setQuery, geoloc, setGeoloc }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
