from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import torch
import torch.nn as nn
import numpy as np
import cv2
from torchvision import models, transforms
from PIL import Image
import os

from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity
)

# ======================================================
# Flask App
# ======================================================
app = Flask(__name__)
CORS(app)

# ======================================================
# JWT CONFIG (MATCH NODE BACKEND SECRET)
# ======================================================
app.config["JWT_SECRET_KEY"] = "supersecretkey123"  # SAME as .env
jwt = JWTManager(app)

# ======================================================
# CONFIG
# ======================================================
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    "/Users/shrunkhallokhande/Diabetic-Retinopathy-Models/ensemble methods/Densenet121_Best_model.pth"
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
NUM_CLASSES = 5

CLASS_LABELS = {
    0: "No_DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative_DR"
}

# ======================================================
# TRANSFORM
# ======================================================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ======================================================
# FIX RELU FOR GRADCAM
# ======================================================
def disable_inplace_relu(module):
    for child in module.children():
        if isinstance(child, nn.ReLU):
            child.inplace = False
        else:
            disable_inplace_relu(child)

# ======================================================
# LOAD MODEL
# ======================================================
def load_model():
    model = models.densenet121(weights=None)

    model.classifier = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(model.classifier.in_features, NUM_CLASSES)
    )

    state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(state_dict)

    disable_inplace_relu(model)

    model.to(DEVICE)
    model.eval()
    return model

model = load_model()

# ======================================================
# GRAD-CAM
# ======================================================
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.activations = None
        self.gradients = None

        self.target_layer.register_forward_hook(self.forward_hook)

    def forward_hook(self, module, inp, out):
        self.activations = out
        out.register_hook(self.save_gradient)

    def save_gradient(self, grad):
        self.gradients = grad

    def generate(self, x):
        self.model.zero_grad()

        logits = self.model(x)
        class_idx = torch.argmax(logits, dim=1).item()

        score = logits[0, class_idx]
        score.backward()

        weights = self.gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * self.activations).sum(dim=1).squeeze()

        cam = cam.detach().cpu().numpy()
        cam = np.maximum(cam, 0)
        cam = cam / (cam.max() + 1e-8)

        confidence = torch.softmax(logits, dim=1)[0, class_idx].item()

        return cam, class_idx, confidence

# ======================================================
# API ROUTE
# ======================================================
@app.route("/api/ai/predict", methods=["POST"])
# @jwt_required()
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"success": False, "error": "Image required"}), 400

        file = request.files["image"]
        img = Image.open(file.stream).convert("RGB")
        img_np = np.array(img)

        img_tensor = transform(img).unsqueeze(0).to(DEVICE)

        gradcam = GradCAM(model, model.features.denseblock4)

        cam, class_idx, confidence = gradcam.generate(img_tensor)

        cam_resized = cv2.resize(cam, (img_np.shape[1], img_np.shape[0]))

        heatmap = cv2.applyColorMap(
            np.uint8(255 * cam_resized),
            cv2.COLORMAP_JET
        )

        overlay = cv2.addWeighted(img_np, 0.6, heatmap, 0.4, 0)

        _, buffer = cv2.imencode(".png", overlay)
        heatmap_base64 = base64.b64encode(buffer).decode("utf-8")

        return jsonify({
            "success": True,
            "prediction": {
                "label": CLASS_LABELS[class_idx],
                "confidence": round(confidence, 4)
            },
            "explainability": {
                "gradcam_base64": heatmap_base64
            }
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ======================================================
# RUN
# ======================================================
if __name__ == "__main__":
    print(f"Running on {DEVICE}")
    app.run(host="0.0.0.0", port=5002)