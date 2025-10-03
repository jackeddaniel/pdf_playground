
import modal
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import json
import zipfile

# Create Modal app
app = modal.App("marker_tool_service")

# Define the image with all dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi[standard]",
        "python-multipart",
        "marker-pdf",
        "pymupdf",
        "Pillow",
    )
)

# Max upload size 20 MB
MAX_FILE_SIZE = 20 * 1024 * 1024

@app.function(
    image=image,
    gpu="T4",  # Free tier GPU - can also use "any" for CPU-only
    timeout=600,  # 10 minutes timeout
    memory=4096,  # 4GB memory
    allow_concurrent_inputs=10,
)
@modal.asgi_app()
def fastapi_app():
    from marker.converters.pdf import PdfConverter
    from marker.models import create_model_dict
    from PIL import Image, ImageDraw
    import pymupdf
    import logging
    
    web_app = FastAPI()
    
    # CORS to enable cross origin communication
    web_app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://pdf-frontend.vercel.app", "*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    logger = logging.getLogger("uvicorn.error")
    
    # Initialize Marker PDF converter (done once per container)
    converter = PdfConverter(artifact_dict=create_model_dict())
    
    @web_app.post("/convert")
    async def convert_pdf(
        file: UploadFile = File(...),
        output: str = Query("markdown", enum=["markdown", "json"])
    ):
        logger.info(f"Received file: {file.filename}, output type: {output}")
        
        # Check file size
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large (max 20MB)")
        
        # Step 1: Convert PDF using Marker
        try:
            rendered = converter(BytesIO(content))
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
                    
                    # Add page images with table of contents polygons
                    doc = pymupdf.open(stream=content, filetype="pdf")
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
                    
                    doc.close()
                
                zip_buffer.seek(0)
                return StreamingResponse(
                    zip_buffer,
                    media_type="application/zip",
                    headers={"Content-Disposition": 'attachment; filename="converted.zip"'}
                )
        except Exception as e:
            logger.exception(f"Output generation failed for file: {file.filename}")
            raise HTTPException(status_code=500, detail=f"Output generation failed: {str(e)}")
    
    @web_app.get("/health")
    async def health_check():
        return {"status": "healthy"}
    
    return web_app
