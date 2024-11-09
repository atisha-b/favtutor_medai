"use client";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth, storage } from "@/firebase";
import { Textarea,Input, Button } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { InboxIcon } from "@heroicons/react/solid";

const FillForm = () => {
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [files, setFiles] = useState([]);
  const options = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "trans", label: "Transgender" },
    { value: "intersex", label: "Intersex" },
  ];

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileURLs = await Promise.all(
        files.map(async (file) => {
          const fileRef = ref(storage, `reports/${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        })
      );
      await addDoc(collection(db, "medicalForms"), {

        dateOfBirth,
        gender,
        //weight,
        //height,
        medicalHistory,
        currentMedications,
        allergies,
        fileURLs,
        timestamp: serverTimestamp(),
      });
      alert("Form submitted successfully!");
      setDateOfBirth(new Date());
      setGender("");
      //setWeight("");
      //setHeight("");
      setMedicalHistory("");
      setCurrentMedications("");
      setAllergies("");
      setFiles([]);
      
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="p-20 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl relative">
      <h2 className="text-3xl font-bold mb-11">Medical Information Form</h2>
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Skip
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 border-b-2">
          <div className="flex justify-between">
            <button
              type="button"
              className={`py-2 px-8 text-lg font-semibold ${
                step === 1
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setStep(1)}
            >
              Basic Information
            </button>
            <button
              type="button"
              className={`py-2 px-2 text-lg font-semibold ${
                step === 2
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setStep(2)}
            >
              Medications
            </button>
            <button
              type="button"
              className={`py-2 px-8 text-lg font-semibold ${
                step === 3
                  ? "border-b-4 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setStep(3)}
            >
              Reports
            </button>
          </div>
        </div>

        {step === 1 && (
          <>
          
            <div className="flex space-x-4 mb-4 mt-8">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date of Birth
                </label>
                
                <DatePicker
                  selected={dateOfBirth}
                  onChange={(date) => setDateOfBirth(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-2 py-1 text-sm border rounded"
                  required
                  
          
                />
                
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            
            
            <Button type="button" color="blue" className="w-full" onClick={nextStep}>
              Next
            </Button>

          </>
        )}

        {step === 2 && (
          <>
          
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Medical History
              </label>
              <Textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Medications
              </label>
              <Textarea
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Allergies
              </label>
              <Textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" color="blue" className="w-full mr-2" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" color="blue" className="w-full" onClick={nextStep}>
                Next
              </Button>
            </div>
            
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Reports
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700"
              />
              <div className="mt-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="text-gray-600 mr-2">{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" color="blue" className="w-full mr-2" onClick={prevStep}>
                Previous
              </Button>
              <Button type="submit" color="blue" className="w-full">
                Submit
              </Button>
            </div>
          </>
        )}
      </form>
      
    </div>
  );
};

export default FillForm;
