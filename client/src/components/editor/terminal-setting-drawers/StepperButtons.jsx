import React, { useContext } from "react";
import styled from "styled-components";
import { terminalSettingActionCreator } from "../../../actions/TerminalSetting";
import {
  TerminalSettingDispatch,
  TerminalSettingContext,
} from "../../../stores/TerminalSetting";
import { createTerminalFetch } from "../../../utils/Request";

const StepperButtonsWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: ceneter;
`;

const StepperButtons = () => {
  const { state } = useContext(TerminalSettingContext);
  const dispatch = useContext(TerminalSettingDispatch);

  const clickHandler = (e) => {
    if (e.target.textContent === "prev") {
      dispatch(terminalSettingActionCreator.prevStep(state.currentStep));
    } else {
      dispatch(terminalSettingActionCreator.nextStep(state.currentStep));
    }
  };

  const terminalButtonClickHandler = async () => {
    // TODO 함수로 분리 할 것
    const option = {
      OS: state.OS,
      PE: state.PE,
      DB: state.DB,
    };

    // TODO 받아 온 값을 store에 저장(cell, terminal)
    const result = await createTerminalFetch(option);

    console.log(result);
  };

  return (
    <StepperButtonsWrapper>
      <button onClick={clickHandler}>prev</button>
      <button onClick={clickHandler}>next</button>
      <button onClick={terminalButtonClickHandler}>createTerminal</button>
    </StepperButtonsWrapper>
  );
};

export default StepperButtons;
