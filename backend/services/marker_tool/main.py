from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from io import BytesIO
import json, zipfile
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from PIL import Image, ImageDraw
import pymupdf  
import logging

app = FastAPI()


# CORS to enable cross origin communication with my next.js frontend
app.add_middleware( 
    CORSMiddleware, 
    allow_origins=["https://pdf-frontend.vercel.app", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn.error")

# Max upload size 20 MB
MAX_FILE_SIZE = 20 * 1024 * 1024

# Initialize Marker PDF converter
converter = PdfConverter(artifact_dict=create_model_dict())


# Dependency to limit file size
async def file_size_limit(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    file.file.seek(0)
    return file


@app.post("/convert")
async def convert_pdf(
    file: UploadFile = Depends(file_size_limit),
    output: str = Query("markdown", enum=["markdown", "json"])
):
    logger.info(f"Received file: {file.filename}, output type: {output}")

    # Step 1: Read PDF and convert using Marker
    try:
        pdf_bytes = await file.read()
        rendered = converter(BytesIO(pdf_bytes))
        logger.info(f"PDF conversion successful: {file.filename}")
    except Exception as e:
        logger.exception(f"PDF conversion failed for file: {file.filename}")
        raise HTTPException(status_code=500, detail=f"PDF conversion failed: {str(e)}")

    # Step 2: Return JSON or ZIP depending on output type
    try:
        if output == "json":
            # Return only the detected metadata
            return JSONResponse(content=rendered.metadata)

        elif output == "markdown":
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, "w") as zipf:
                # Markdown file
                zipf.writestr("converted.md", rendered.markdown)

                # Metadata JSON
                zipf.writestr("metadata.json", json.dumps(rendered.metadata, indent=2))

                # Optional: add page images with table of contents polygons
                doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
                for page_num, page in enumerate(doc):
                    zoom = 2
                    mat = pymupdf.Matrix(zoom, zoom)
                    pix = page.get_pixmap(matrix=mat)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    draw = ImageDraw.Draw(img)

                    for item in rendered.metadata.get("table_of_contents", []):
                        if item.get("page_id") == page_num and "polygon" in item:
                            coords = [(x * zoom, y * zoom) for x, y in item["polygon"]]
                            draw.line(coords + [coords[0]], fill="red", width=3)

                    buffer = BytesIO()
                    img.save(buffer, format="PNG")
                    buffer.seek(0)
                    zipf.writestr(f"page_{page_num+1}.png", buffer.read())

            zip_buffer.seek(0)
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": 'attachment; filename="converted.zip"'}
            )

    except Exception as e:
        logger.exception(f"Output generation failed for file: {file.filename}")
        raise HTTPException(status_code=500, detail=f"Output generation failed: {str(e)}")

