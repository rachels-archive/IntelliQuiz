"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";

const QuizForm = () => {
  const [title, setTitle] = useState<string>("");
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [numOfQuestions, setNumOfQuestions] = useState<number>(10);
  const [numOfChoices, setNumOfChoices] = useState<number>(4);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  }, []);

  const validatePDFPages = async (file: File): Promise<boolean> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      console.log("Number of pages in uploaded PDF:", pdf.numPages);
      return pdf.numPages === 1;
    } catch (error) {
      console.error("Error reading PDF:", error);
      return false;
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const selectedFile = e.target.files?.[0];
    setFileError("");

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFileError("Please upload a PDF file.");
        setFile(null);
        return;
      }

      const isValidPageCount = await validatePDFPages(selectedFile);

      if (!isValidPageCount) {
        setFileError("Oops! Please upload a PDF with just 1 page.");
        e.target.value = "";
        setFile(null);
        return;
      }

      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const isFormValid = (): boolean => {
    if (title.trim() === "") {
      return false;
    }
    if (inputType === "text") {
      return textInput.trim() !== "";
    } else if (inputType === "file") {
      return !!file && !fileError;
    }
    return false;
  };

  /*
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log({ title, inputType, numOfQuestions, numOfChoices, file, textInput });
  };
  */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        inputType,
        textInput,
        numOfQuestions,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Generated Questions:", data.questions);
    } else {
      console.error("Error generating quiz:", data.error);
    }
  };

  return (
    <div className="w-1/2">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-[#57463E]">Generate Quiz</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[#57463E]">
            Quiz Title: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#57463E] rounded-md p-2 w-full text-[#57463E]"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <button
            type="button"
            onClick={() => {
              setInputType("text");
              setFileError("");
            }}
            className={`flex-1 py-2 rounded-l-md ${
              inputType === "text"
                ? "bg-[#7A5B4A] text-white border border-[#7A5B4A]"
                : "bg-white text-[#57463E] border border-[#7A5B4A] "
            }`}
          >
            Paste Your Notes
          </button>
          <button
            type="button"
            onClick={() => {
              setInputType("file");
              setFileError("");
            }}
            className={`flex-1 py-2 rounded-r-md ${
              inputType === "file"
                ? "bg-[#7A5B4A] text-white border border-[#7A5B4A]"
                : "bg-white text-[#57463E] border border-[#7A5B4A]"
            }`}
          >
            Upload PDF Notes
          </button>
        </div>

        {inputType === "text" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[#57463E]">
              Enter Text (max 3000 characters): <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="border border-[#57463E] rounded-md p-2 w-full text-[#57463E]"
              required
              maxLength={3000}
            ></textarea>
            <div className="text-sm text-gray-500 mt-1">{textInput.length}/3000 characters</div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[#57463E]">
              Upload PDF (max 1 page): <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="border border-[#57463E] rounded-md p-2 w-full"
              required
            />
            {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[#57463E]">Number of Questions:</label>
          <select
            value={numOfQuestions}
            onChange={(e) => setNumOfQuestions(Number(e.target.value))}
            className="border border-[#57463E] rounded-md p-2 w-full text-[#57463E]"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-[#57463E]">Number of Choices:</label>
          <select
            value={numOfChoices}
            onChange={(e) => setNumOfChoices(Number(e.target.value))}
            className="border border-[#57463E] rounded-md p-2 w-full text-[#57463E]"
          >
            {[3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`mx-auto block bg-[#57463E] font-semibold text-white rounded-md py-2 px-6 
   ${!isFormValid() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#241d1a]"}`}
          disabled={!isFormValid()}
        >
          Generate
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
