import React, { useContext, useEffect } from "react";

import propTypes from "prop-types";

import MarkdownWrapper from "../../style/MarkdownWrapper";
import { CellContext, CellDispatchContext } from "../../../../stores/CellStore";
import { cellActionCreator } from "../../../../actions/CellAction";
import { EVENT_TYPE } from "../../../../enums";
import { useCellState, useKeys } from "../../../../utils";

import {
  getSelection,
  saveCursorPosition,
  deleteCell,
  blockRelease,
} from "../Markdown/handler";
import { newCell, initCell } from "../Heading/handler";
import { cellGenerator, setGenerator } from "../CellGenerator";

setGenerator("blockquote", (uuid) => <QuoteCell cellUuid={uuid} />);

const QuoteCell = ({ cellUuid }) => {
  const { state } = useContext(CellContext);
  const dispatch = useContext(CellDispatchContext);
  const { currentIndex, cellIndex, tag, text, placeholder } = useCellState(
    state,
    cellUuid
  );
  const { block, cursor } = state;
  let inputRef = null;
  let intoShiftBlock = false;

  if (block.start !== null) {
    const blockStart = block.start < block.end ? block.start : block.end;
    const blockEnd = block.start > block.end ? block.start : block.end;
    if (blockStart <= cellIndex && cellIndex <= blockEnd) {
      intoShiftBlock = true;
    }
  }

  const backspaceEvent = (e) => {
    const { textContent } = e.target;
    const currentCursor = getSelection();
    const isStartPos =
      textContent.length === 0 ||
      (currentCursor.start === 0 && currentCursor.end === 0);

    if (isStartPos) {
      const componentCallback = cellGenerator.p;
      dispatch(cellActionCreator.input(cellUuid, textContent));
      initCell(cellUuid, dispatch, componentCallback);
    }
    if (state.block.start !== null) {
      deleteCell(dispatch);
    }
  };

  const enterEvent = (e) => {
    const { textContent } = e.target;
    if (textContent.length === 0) {
      backspaceEvent(e);
    } else {
      const componentCallback = cellGenerator.p;
      saveCursorPosition(dispatch);
      dispatch(cellActionCreator.input(cellUuid, textContent));
      newCell(cellUuid, dispatch, componentCallback);
    }
    blockRelease(dispatch);
  };

  const keydownHandlers = {
    [EVENT_TYPE.ENTER]: enterEvent,
    [EVENT_TYPE.BACKSPACE]: backspaceEvent,
  };

  const isFocus = currentIndex === cellIndex;
  if (isFocus) {
    inputRef = state.inputRef;
  }

  useKeys(keydownHandlers, isFocus, [block.end]);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.firstChild === null) {
        const emptyElement = document.createTextNode("");
        inputRef.current.appendChild(emptyElement);
      }
      const caretOffset =
        cursor.start > inputRef.current.firstChild.length
          ? inputRef.current.firstChild.length
          : cursor.start;
      window.getSelection().collapse(inputRef.current.firstChild, caretOffset);
    }
  }, [inputRef]);

  const onClick = () => {
    dispatch(cellActionCreator.focusMove(cellUuid));
    blockRelease(dispatch);
  };

  const onBlur = (e) => {
    const { textContent } = e.target;
    dispatch(cellActionCreator.input(cellUuid, textContent));
  };

  return (
    <MarkdownWrapper
      as={tag}
      contentEditable
      intoShiftBlock={intoShiftBlock}
      isCurrentCell={isFocus}
      isQuote
      placeholder={placeholder}
      onClick={onClick}
      onBlur={onBlur}
      ref={inputRef || null}
      spellCheck={false}
      suppressContentEditableWarning
    />
  );
};

QuoteCell.propTypes = {
  cellUuid: propTypes.string.isRequired,
};

export default QuoteCell;