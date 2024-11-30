"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth, storage, app } from "@/firebase";
import { Textarea, Input, Button } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { InboxIcon } from "@heroicons/react/solid";
import Link from "next/link";

const FillForm = () => {
  const [user, setUser] = useState(null);
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
  const [step, setStep] = useState(1);
  const auth = getAuth(app);

  const options = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "trans", label: "Transgender" },
    { value: "intersex", label: "Intersex" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (user) {
      const loadFormData = async () => {
        const docRef = doc(db, "users", user.uid, "medicalForms", "userdata");
        try {
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setDateOfBirth(data.dateOfBirth?.toDate() || new Date());
            setWeight(data.weight || "");
            setGender(data.gender || "");
            setMedicalHistory(data.medicalHistory || "");
            setCurrentMedications(data.currentMedications || "");
            setAllergies(data.allergies || "");
            setSymptoms(data.symptoms || "");
            setFiles(data.fileURLs || []);
          } else {
            console.log("No document found for this user");
          }
        } catch (error) {
          console.error("Error loading form data: ", error);
        }
      };
      loadFormData();
    }
  }, [user]);

  const handleSkip = () => {
    router.push("/ChatWindow");
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit the form.");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid, "medicalForms", "userdata");
      const fileURLs = await Promise.all(
        files.map(async (file) => {
          const fileRef = ref(storage, `reports/${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        })
      );

      const formData = {
        dateOfBirth,
        gender,
        weight,
        symptoms,
        medicalHistory,
        currentMedications,
        allergies,
        fileURLs,
        timestamp: serverTimestamp(),
      };

      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        await updateDoc(docRef, formData);
        alert("Form updated successfully!");
      } else {
        await setDoc(docRef, formData);
        alert("Form submitted successfully!");
      }

      router.push("/ChatWindow");
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white mb-0">
              Medical Information Form
            </h2>
            <button
              onClick={handleSkip}
              className="bg-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-all duration-200"
            >
              Skip
            </button>
          </div>

          <div className="flex justify-between items-center mt-8 relative">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className="flex flex-col items-center w-1/3 cursor-pointer"
                onClick={() => setStep(stepNumber)}
              >
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  ${
                    step === stepNumber
                      ? "bg-white text-blue-600"
                      : step > stepNumber
                      ? "bg-green-500 text-white"
                      : "bg-white/50 text-white"
                  } font-bold text-lg transition-all duration-200`}
                >
                  {step > stepNumber ? "✓" : stepNumber}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step === stepNumber ? "text-white" : "text-white/70"
                  }`}
                >
                  {stepNumber === 1
                    ? "Basic Info"
                    : stepNumber === 2
                    ? "Medical History"
                    : "Documents"}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-5 h-1 bg-white/30 w-full -z-0">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          <div className="flex justify-between px-8 mt-6">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-2 rounded-lg text-white transition-all duration-200 
      ${
        step === 1
          ? "opacity-50 cursor-not-allowed"
          : "bg-white/20 hover:bg-white/30"
      }`}
              disabled={step === 1}
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={dateOfBirth}
                    onChange={(date) => setDateOfBirth(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Current Symptoms
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-blue-500 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Medical History
                </label>
                <Textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-blue-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Current Medications
                </label>
                <Textarea
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-blue-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-semibold">
                  Allergies
                </label>
                <Textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-2 !border !border-gray-200 rounded-lg focus:!ring-2 focus:!ring-blue-500 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-full">
                      <InboxIcon className="w-12 h-12 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">
                        Upload Medical Reports
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag and drop or click to select files
                      </p>
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Uploaded Files
                  </h4>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
                      >
                        <Link href={file} target="_blank">
                          <span className="text-sm text-gray-600 hover:underline">
                            Click here to see the file
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FillForm;
