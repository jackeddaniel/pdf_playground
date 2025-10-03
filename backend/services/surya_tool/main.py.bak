from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from io import BytesIO
import json, zipfile, copy, os
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from PIL import Image, ImageDraw
from pdf2image import convert_from_bytes
from surya.foundation import FoundationPredictor
from surya.layout import LayoutPredictor
from surya.settings import settings
import logging

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://pdf-frontend.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn.error")

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

# Initialize Marker
converter = PdfConverter(artifact_dict=create_model_dict())

# Initialize Surya
layout_predictor = LayoutPredictor(FoundationPredictor(checkpoint=settings.LAYOUT_MODEL_CHECKPOINT))


# Dependency to limit file size
async def file_size_limit(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    file.file.seek(0)
    return file


def draw_layout_boxes_surya(image: Image.Image, layout_pred) -> Image.Image:
    """
    Draw Surya layout polygons on an image using layout_pred.bboxes.
    """
    draw_image = copy.deepcopy(image)
    draw = ImageDraw.Draw(draw_image)

    for bbox_obj in layout_pred.bboxes:
        polygon = bbox_obj.polygon
        label = f"{bbox_obj.label}-{getattr(bbox_obj, 'position', '')}"

        try:
            # Flatten polygon coordinates to ints
            coords = [int(coord) for point in polygon for coord in point]
            draw.polygon(coords, outline="red")
            draw.text((int(polygon[0][0]), int(polygon[0][1]) - 10), label, fill="red")
        except Exception as e:
            logger.warning(f"Skipping invalid polygon {polygon}: {e}")
            continue

    return draw_image


def layout_to_dict(layout_pred):
    """
    Convert Surya LayoutResult to JSON-serializable dict
    """
    layout_dict = {
        "page_number": getattr(layout_pred, "page_number", None),
        "bboxes": []
    }

    for bbox_obj in layout_pred.bboxes:
        try:
            layout_dict["bboxes"].append({
                "polygon": [[float(x), float(y)] for x, y in bbox_obj.polygon],
                "label": bbox_obj.label,
                "position": getattr(bbox_obj, "position", None),
                "bbox": [float(coord) for coord in bbox_obj.bbox] if hasattr(bbox_obj, "bbox") else None
            })
        except Exception as e:
            logger.warning(f"Skipping invalid bbox {bbox_obj}: {e}")
            continue

    return layout_dict


@app.post("/convert")
async def convert_pdf(
    file: UploadFile = Depends(file_size_limit),
    output: str = Query("markdown", enum=["markdown", "json"])
):
    logger.info(f"Received file: {file.filename}, output type: {output}")

    try:
        pdf_bytes = await file.read()
        # Step 1: Marker conversion
        rendered = converter(BytesIO(pdf_bytes))
        logger.info(f"Marker conversion successful: {file.filename}")
    except Exception as e:
        logger.exception(f"Marker conversion failed for file: {file.filename}")
        raise HTTPException(status_code=500, detail=f"Marker conversion failed: {str(e)}")

    try:
        # Convert PDF pages to images
        images = convert_from_bytes(pdf_bytes)

        if output == "json":
            layout_predictions = [layout_predictor([img])[0] for img in images]
            all_layout = [layout_to_dict(pred) for pred in layout_predictions]

            return JSONResponse(content={
                "marker_metadata": rendered.metadata,
                "surya_layout": all_layout
            })

        elif output == "markdown":
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, "w") as zipf:
                # Markdown
                zipf.writestr("converted.md", rendered.markdown)
                # Marker metadata
                zipf.writestr("metadata.json", json.dumps(rendered.metadata, indent=2))

                all_layout = []

                for page_num, img in enumerate(images, start=1):
                    preds = layout_predictor([img])[0]
                    all_layout.append(layout_to_dict(preds))

                    # Draw boxes
                    boxed_img = draw_layout_boxes_surya(img, preds)
                    buffer = BytesIO()
                    boxed_img.save(buffer, format="PNG")
                    buffer.seek(0)
                    zipf.writestr(f"page_{page_num}.png", buffer.read())

                # Layout JSON
                zipf.writestr("layout.json", json.dumps(all_layout, indent=2))

            zip_buffer.seek(0)
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": 'attachment; filename="converted.zip"'}
            )

    except Exception as e:
        logger.exception(f"Output generation failed for file: {file.filename}")
        raise HTTPException(status_code=500, detail=f"Output generation failed: {str(e)}")

