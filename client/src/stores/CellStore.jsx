import React, { useReducer } from "react";
import cellReducer from "../reducers/CellReducer";
import { UuidManager } from "../utils";

const CellContext = React.createContext();
const CellDispatchContext = React.createContext();

const CellStore = ({ children }) => {
  const [state, dispatch] = useReducer(cellReducer, {
    currentIndex: 0,
    inputRef: null,
    uuidManager: new UuidManager(),
    cells: [],
    texts: [],
    type: [],
    cursor: {
      start: 0,
      end: 0,
    },
  });

  return (
    <CellContext.Provider value={{ state }}>
      <CellDispatchContext.Provider value={dispatch}>
        {children}
      </CellDispatchContext.Provider>
    </CellContext.Provider>
  );
};

export { CellContext, CellDispatchContext, CellStore };
