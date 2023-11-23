import base64
from io import BytesIO

import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from torchvision.io.image import ImageReadMode, decode_image
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2, FasterRCNN_ResNet50_FPN_V2_Weights
from torchvision.transforms.functional import to_pil_image
from torchvision.utils import draw_bounding_boxes

app = Flask(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

client = MongoClient("mongo:27017")


@app.route('/health')
def health():
    return jsonify({"status": "up"})


@app.route('/health/db')
def todo():
    try:
        client.admin.command('ismaster')
    except:
        return jsonify({"db": "Server not available"})
    return jsonify({"db": "up"})


@app.post("/detect-objects")
def detect_objects():
    request_image = request.get_json()['img'].split(',')
    raw_image_bytes = base64.b64decode(request_image[1])
    raw_image_tensor = torch.frombuffer(raw_image_bytes, dtype=torch.uint8)
    img = decode_image(raw_image_tensor, mode=ImageReadMode.RGB)

    # Step 1: Initialize model with the best available weights
    weights = FasterRCNN_ResNet50_FPN_V2_Weights.DEFAULT
    model = fasterrcnn_resnet50_fpn_v2(weights=weights, box_score_thresh=0.9)
    model.eval()

    # Step 2: Initialize the inference transforms
    preprocess = weights.transforms()

    # Step 3: Apply inference preprocessing transforms
    batch = [preprocess(img)]

    # Step 4: Use the model and visualize the prediction
    prediction = model(batch)[0]
    combinedLabels = []
    labels = []
    for i in range(len(prediction["labels"])):
        name = weights.meta["categories"][prediction["labels"][i]]
        score = prediction["scores"][i].item()
        labels.append({"name": name, "score": score})
        combinedLabels.append(name.capitalize() + ": " + f"{100 * score:.1f}%")

    box = draw_bounding_boxes(img, boxes=prediction["boxes"],
                              labels=combinedLabels,
                              colors="red",
                              width=4, font_size=30)
    im = to_pil_image(box.detach())

    buffered = BytesIO()
    im.save(buffered, format="PNG")
    img_str_new = base64.b64encode(buffered.getvalue())
    img_base64_new = bytes("data:image/png;base64,", encoding='utf-8') + img_str_new
    img_base64_str_new = img_base64_new.decode("utf-8")

    return jsonify({"labels": labels, "img": img_base64_str_new})


if __name__ == '__main__':
    app.run()
