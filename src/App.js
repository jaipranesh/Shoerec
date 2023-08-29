import React, { useState } from "react";
//import { FormContainer, FormGroup, HomeContainer, ListContainer } from "./App";
import "./App.css";
import  { createGlobalStyle } from "styled-components";
//import { GlobalStyles } from "./styles/global";
import { useForm } from "react-hook-form";
//import { api } from "./lib/axios";
import axios from "axios";


const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    background: black;
  }
`;

function App() {
  const [details, setDetails] = useState([]);
  const [satisfaction, setSatisfaction] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sizeNA, setSizeNA] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [availableSizesByBrand, _setAvailableSizesByBrand] = useState({
    Adidas: ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13","13.5","14"],
    Reebok: ["2","2.5","3","3.5","4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
    NewBalance: ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13","13.5","14"],
    Vans : ["3.5","4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    Woodlands : ["5","6","7","8","9","10","11"],
    Puma : ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13","13.5","14","14.5","15","15.5","16"],
    Asics : ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
    Crocs: ["2" , "3","4", "5", "6", "7", "8", "9","10","11","12","13","14","15","16","17"],
    Nike : ["6" , "7" , "8","9","10","11","12","13"]
  });
  const [availableSizes, setAvailableSizes] = useState([]);

  const brands = ["Adidas", "New Balance", "Crocs", "Vans", "Puma", "Woodlands", "Reebok", "Asics", "Nike"];

  const onSubmit = async (data) => {
    console.log("I am trying to submit")
    setErrorMessage(""); 
    const { cBrand, size, nBrand } = data;
    console.log("Submitting form with data");

    try {
      const response = await axios.get(`http://127.0.0.1:1246/getRecommend/${cBrand}/${size}/${nBrand}`);
      
      const newData = response.data;
      setDetails((state) => [newData, ...state]);
      if (newData.nSize === "") {
        setSizeNA(true);
        setErrorMessage("This size is not available in the asked brand");
      } else {
        setSizeNA(false);
        setErrorMessage("");
      }
      setSelectedRecommendation(newData);
      setShowFeedback(true);
  
      reset();
      setSatisfaction("");
    } catch (error) {
      const errorMessage = error.message || "An error occurred";
      setErrorMessage("Error fetching recommendation: " + errorMessage);
      setSizeNA(false); 
      console.error("Error fetching recommendation:", errorMessage);
    }
  };

  const submitFeedback = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:1246/submitFeedback", {
        cBrand: selectedRecommendation?.cBrand,
        size: selectedRecommendation?.size,
        nBrand: selectedRecommendation?.nBrand,
        nSize: selectedRecommendation?.nSize,
        satisfaction: satisfaction,
        comment: feedbackComment,
      });

      console.log(response.data.message); // You can handle the response message as needed
      if (satisfaction === "no") {
        setShowCommentBox(true);
      } else {
        setShowCommentBox(false);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      cBrand: "",
      size: "",
      nBrand: "",
    },
  });

  const handleUsingBrandChange = (selectedBrand) => {
    const sizes = availableSizesByBrand[selectedBrand] || [];
    setAvailableSizes(sizes);
    setValue("size", "");
    setValue("cBrand", selectedBrand);
  };

  return (
    <>
      <GlobalStyles />
      <div className="main">
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <h2>Shoe Size Recommender</h2>
  
          <div className="form-group">
            <label className="label" htmlFor="cBrand">Using Brand</label>
            <select
                id="cBrand"
                name="cBrand" // Set the name attribute for validation
                {...register('cBrand', { required: true })} 
                 // Add validation rules
                onChange={(e) => {
                  handleUsingBrandChange(e.target.value);
                }}
                className="select"
              >
                <option value="" disabled>
                  Choose one
                </option>
                {Object.keys(availableSizesByBrand).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
          </div>
  
          <div className="form-group">
            <label className="label" htmlFor="size">Size</label>
            <select
              id="size"
              name = "size"
              {...register('size', { required: true })} 
              disabled={!availableSizes.length}
              className="select"
            >
              <option value="" disabled>
                Choose one
              </option>
              {availableSizes.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption}>
                  {sizeOption}
                </option>
              ))}
            </select>
          </div>
  
          <div className="form-group">
            <label className="label" htmlFor="nBrand">New Brand</label>
            <select
              id="nBrand"
              name = "nBrand"
              {...register('nBrand', { required: true })} 
              className="select"
            >
              <option value="" disabled>
                Choose one
              </option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
  
          <div className="button-container">
            <button className="submit-button" type="submit">Get Recommendation</button>
          </div>
        </form>
  
        <div className="list-container">
          {errorMessage !== "" && <p style={{ color: "red" }}>{errorMessage}</p>}
          <h2>Recommendation</h2>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Current Brand</th>
                  <th>Size</th>
                  <th>New Brand</th>
                  <th>New Size</th>
                </tr>
              </thead>
              <tbody>
                {details.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.cBrand}</td>
                    <td>{emp.size}</td>
                    <td>{emp.nBrand}</td>
                    <td style={{ color: sizeNA ? "red" : "white" }}>
                      {emp.nSize === "" ? "Size NA in this brand" : emp.nSize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {showFeedback && (
          <div className="list-container feedback-container">
            <h2>Feedback</h2>
            <div className="form-group">
              <p>Are you satisfied with the recommendation feature?</p>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label style={{ marginRight: '10px' }}>
                  <input
                    type="radio"
                    value="yes"
                    checked={satisfaction === 'yes'}
                    onChange={(e) => {
                      setSatisfaction(e.target.value);
                      setShowCommentBox(false);
                      setFeedbackComment("");
                    }}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    value="no"
                    checked={satisfaction === 'no'}
                    onChange={(e) => {
                      setSatisfaction(e.target.value);
                      setShowCommentBox(true);
                    }}
                  />
                  No
                </label>
              </div>
              {showCommentBox && (
                <div>
                  <label htmlFor="feedbackComment">Please provide your feedback:</label>
                  <textarea
                    id="feedbackComment"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                  />
                </div>
              )}
            </div>
  
            <div className="button-container" style={{ textAlign: "center" }}>
              <button className="submit-button" onClick={submitFeedback}>Submit Feedback</button>
            </div>
          </div>
        )}
  
      </div>
    </>
  );
  
  }

export default App;
