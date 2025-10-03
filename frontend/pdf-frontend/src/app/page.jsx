"use client";
import { useState } from "react";
import JSZip from "jszip";
import { Upload, FileText, Code, Download, Sparkles, X, Image } from "lucide-react";

export default function Home() {
    const [file, setFile] = useState(null);
    const [outputType, setOutputType] = useState("markdown");
    const [service, setService] = useState("pymupdf");
    const [images, setImages] = useState([]);
    const [markdown, setMarkdown] = useState("");
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const ENDPOINTS = {
        pymupdf: "https://siddhant-ugarkar--marker-tool-service-fastapi-app.modal.run/convert",
        surya: "https://siddhant-ugarkar--surya-tool-service-fastapi-app.modal.run/convert"
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    //Handles dragging and dropping the files from user's system
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${ENDPOINTS[service]}?output=${outputType}`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

            if (outputType === "json") {
                const data = await res.json();
                setMetadata(data);
                setImages([]);
                setMarkdown("");
            } else if (outputType === "markdown") {
                const blob = await res.blob();
                const zip = await JSZip.loadAsync(blob);

                const imgs = [];
                let mdText = "";
                let metaObj = null;

                await Promise.all(
                    Object.keys(zip.files).map(async (filename) => {
                        const file = zip.files[filename];
                        if (filename.endsWith(".png")) {
                            const base64 = await file.async("base64");
                            imgs.push(`data:image/png;base64,${base64}`);
                        } else if (filename.endsWith(".md")) {
                            mdText = await file.async("string");
                        } else if (filename.endsWith(".json")) {
                            const text = await file.async("string");
                            metaObj = JSON.parse(text);
                        }
                    })
                );

                setImages(imgs);
                setMarkdown(mdText);
                setMetadata(metaObj);
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadMarkdown = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metadata.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Left Panel */}
            <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col shadow-lg">
                {/* Header */}
                <div className="p-8 border-b border-slate-200/60">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            PDF Converter
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 ml-13">
                        Transform your PDFs instantly
                    </p>
                </div>

                {/* Upload Area */}
                <div className="flex-1 p-8 overflow-auto">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
                            }`}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-slate-700 mb-1">
                                Drop your PDF here
                            </p>
                            <p className="text-xs text-slate-500">
                                or click to browse
                            </p>
                        </div>
                    </div>

                    {file && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="w-8 h-8 rounded-lg hover:bg-white/80 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Output Type Selector */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Output Format
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setOutputType("markdown")}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${outputType === "markdown"
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                <FileText className={`w-5 h-5 mx-auto mb-2 ${outputType === "markdown" ? "text-blue-600" : "text-slate-400"
                                    }`} />
                                <p className={`text-xs font-medium ${outputType === "markdown" ? "text-blue-700" : "text-slate-600"
                                    }`}>Markdown</p>
                            </button>
                            <button
                                onClick={() => setOutputType("json")}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${outputType === "json"
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                <Code className={`w-5 h-5 mx-auto mb-2 ${outputType === "json" ? "text-blue-600" : "text-slate-400"
                                    }`} />
                                <p className={`text-xs font-medium ${outputType === "json" ? "text-blue-700" : "text-slate-600"
                                    }`}>JSON</p>
                            </button>
                        </div>
                    </div>

                    {/* Service Selector */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Select Model
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setService("pymupdf")}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${service === "pymupdf"
                                    ? "border-green-500 bg-green-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                <p className={`text-sm font-medium ${service === "pymupdf" ? "text-green-700" : "text-slate-600"
                                    }`}>PyMuPDF</p>
                            </button>
                            <button
                                onClick={() => setService("surya")}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${service === "surya"
                                    ? "border-purple-500 bg-purple-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                <p className={`text-sm font-medium ${service === "surya" ? "text-purple-700" : "text-slate-600"
                                    }`}>Surya</p>
                            </button>
                        </div>
                    </div>

                    {/* Convert Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || isLoading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Converting...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Convert PDF
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Panel - Results */}
            <div className="flex-1 flex flex-col">
                {!markdown && !metadata ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
                                <FileText className="w-12 h-12 text-slate-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-700 mb-2">
                                No results yet
                            </h2>
                            <p className="text-sm text-slate-500">
                                Upload and convert a PDF to see results here
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto p-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Header with download button */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {outputType === "markdown" ? "Markdown Output" : "JSON Metadata"}
                                </h2>
                                <button
                                    onClick={outputType === "markdown" ? downloadMarkdown : downloadJSON}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>

                            {/* Content */}
                            {outputType === "markdown" && markdown && (
                                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">
                                        {markdown}
                                    </pre>
                                </div>
                            )}

                            {outputType === "json" && metadata && (
                                <div className="bg-slate-900 rounded-xl p-6 shadow-lg overflow-x-auto">
                                    <pre className="text-sm text-green-400 font-mono">
                                        {JSON.stringify(metadata, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* Images */}
                            {images.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Image className="w-5 h-5" />
                                        Extracted Images ({images.length})
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                                                <img src={img} alt={`Extracted ${idx + 1}`} className="w-full rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
