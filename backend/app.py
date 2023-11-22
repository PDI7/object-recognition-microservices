from flask import Flask, request, jsonify


from torchvision.io import read_image
from torchvision.models import resnet50, ResNet50_Weights, MobileNet_V3_Large_Weights, mobilenet_v3_large
from torchvision.io.image import read_image
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2, FasterRCNN_ResNet50_FPN_V2_Weights
from torchvision.utils import draw_bounding_boxes
from torchvision.transforms.functional import to_pil_image
import json
import numpy as np


app = Flask(__name__)


countries = [
    {"id": 1, "name": "Thailand", "capital": "Bangkok", "area": 513120},
    {"id": 2, "name": "Australia", "capital": "Canberra", "area": 7617930},
    {"id": 3, "name": "Egypt", "capital": "Cairo", "area": 1010408},
]


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


def _find_next_id():
    return max(country["id"] for country in countries) + 1


@app.get("/countries")
def get_countries():
    return jsonify(countries)


@app.post("/countries")
def add_country():
    if request.is_json:
        country = request.get_json()
        country["id"] = _find_next_id()
        countries.append(country)
        return country, 201
    return {"error": "Request must be JSON"}, 415


@app.get("/detect-objects")
def detect_objects():
    img = read_image("static/living.jpg")

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
    im.show()
    return jsonify({"labels": labels}) #, "img": json.dumps(np.array(im).tolist())


@app.get("/segmentation")
def segmentation():
    img = read_image("static/living.jpg") # "test/assets/encode_jpeg/grace_hopper_517x606.jpg")

    # Step 1: Initialize model with the best available weights
    # weights = ResNet50_Weights.DEFAULT
    # model = resnet50(weights=weights)
    weights = MobileNet_V3_Large_Weights.DEFAULT
    model = mobilenet_v3_large(weights=weights)
    model.eval()

    # Step 2: Initialize the inference transforms
    preprocess = weights.transforms()

    # Step 3: Apply inference preprocessing transforms
    batch = preprocess(img).unsqueeze(0)

    # Step 4: Use the model and print the predicted category
    prediction = model(batch).squeeze(0).softmax(0)
    class_id = prediction.argmax().item()
    score = prediction[class_id].item()
    category_name = weights.meta["categories"][class_id]
    print(f"{category_name}: {100 * score:.1f}%")
    return jsonify(weights.meta["categories"][class_id])


if __name__ == '__main__':
    app.run()
