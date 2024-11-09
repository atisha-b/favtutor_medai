"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import Chat from "@/components/Chat";
import Link from "next/link";
import { MenuAlt1Icon, XIcon } from "@heroicons/react/solid";

const page = () => {
  const [allImage, setAllImage] = useState(null);
  const [show, setShow] = useState(false);
  const [pdfFile, setPdfFile] = useState<string>("");
  const [clicked, setClicked] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    getPdf();
  }, []);
  const showPdf = (pdf: any) => {
    // window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
    setPdfFile(`http://localhost:5000/files/${pdf}`);
    setShow(true);
    console.log(pdfFile);
  };
  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    const len = result.data.data.length;
    setAllImage(result.data.data[len - 1]);
    try {
      const response = await axios.get("http://localhost:7000/run-python-code");
      
      setText(response.data.result);
      console.log(text);
    } catch (error) {
      console.error("error bro");
    }
  };

  return (
    <div className="md:flex">
      <div className="hidden md:flex">
        {!show ? (
          <div className="h-[100vh] md:w-[50vw] md:justify-center md:flex items-center ">
            <button
              className="bg-slate-500 p-2 text-white rounded-md shadow-lg shadow-slate-900"
              onClick={() => showPdf(allImage!["pdf"])}
            >
              Show Pdf
            </button>
          </div>
        ) : (
          <div className="h-[50vh] md:w-[50vw]">
            <iframe
              src={pdfFile}
              frameBorder="0"
              className="h-[50vh] w-[100vw] md:h-screen md:w-[50vw]"
            ></iframe>
          </div>
        )}
      </div>
      <div className="flex md:hidden bg-black bg-opacity-80 justify-between px-4 py-5 h-[10vh]">
        <p className=" font-semibold rounded-lg p-1  flex justify-center text-white">
          {!clicked ? (
            <button onClick={() => setClicked(true)}>
              <p className="font-semibold rounded-lg p-1 text-sm flex items-center justify-center bg-slate-500 text-black">
                Show PDF
              </p>
            </button>
          ) : (
            <button onClick={() => setClicked(false)}>
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </p>

        <button>
          <p className=" font-semibold rounded-lg p-1 text-sm flex items-center justify-center bg-slate-500 text-black">
            <Link href="/dashboard">Dashboard</Link>
          </p>
        </button>
      </div>
      {clicked ? (
        <div className="h-[95vh] text-sm font-semibold text-black  ">
          if you are not able to see your pdf, go to the dashboard section and
          click on 'show pdf' <br /> your browser might not support showing pdf
          here
          <iframe
            src={pdfFile}
            frameBorder="0"
            className="h-[95vh] w-[100vw] md:hidden flex "
          ></iframe>
        </div>
      ) : (
        <div className="md:w-[55vw] md:h-screen h-[90vh]">
          <Chat message={text}/>
        </div>
      )}
    </div>
  );
};

export default page;
