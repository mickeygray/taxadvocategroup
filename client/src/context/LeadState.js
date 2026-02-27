import React, { useReducer } from "react";
import axios from "axios";
import LeadContext from "./leadContext";
import leadReducer from "./leadReducer";

const LeadState = (props) => {
  const initialState = {};

  const [state, dispatch] = useReducer(leadReducer, initialState);

  const sendEmail = async (emailPayload) => {
    dispatch({ type: "SENDING_EMAILS" });
    try {
      const response = await axios.post("/send-email", emailPayload);
      dispatch({ type: "EMAILS_SENT", payload: response.data.success });
    } catch (error) {
      console.error("Error sending emails:", error);
      dispatch({ type: "EMAILS_ERROR", payload: "Failed to send emails." });
    }
  };

  const sendLeadForm = async (formData) => {
    dispatch({ type: "SENDING_FORM" });
    try {
      const response = await axios.post("/send-email", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Lead form — Debt: ${formData.debtAmount || "N/A"}, Filed: ${formData.filedAllTaxes || "N/A"}, Best time: ${formData.bestTime || "Any"}${formData.state ? `, State: ${formData.state}` : ""}${formData.problemTypes ? `, Issues: ${formData.problemTypes}` : ""}${formData.owedAmount ? `, Amount: ${formData.owedAmount}` : ""}`,
      });
      dispatch({ type: "FORM_SENT", payload: response.data.success });
    } catch (error) {
      console.error("Error sending lead form:", error);
      dispatch({ type: "FORM_ERROR", payload: "Failed to send form data." });
    }
  };

  return (
    <LeadContext.Provider value={{ sendEmail, sendLeadForm }}>
      {props.children}
    </LeadContext.Provider>
  );
};

export default LeadState;
