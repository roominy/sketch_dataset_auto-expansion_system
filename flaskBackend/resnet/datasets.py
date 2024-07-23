import torch
from PIL import Image
from torch.utils.data import Dataset
from torchvision.transforms import transforms
import base64
from io import BytesIO
import numpy as np

def invert_colors(img):
    return Image.fromarray(255 - np.array(img))

global_transform = transforms.Compose([
    transforms.Resize((180, 180)),
    transforms.Grayscale(),
    transforms.Lambda(invert_colors),  # Use the top-level function instead of a lambda
    transforms.ToTensor()
])

class SketchDataset(Dataset):

    def __init__(self, sketch_base64_ecodeings, sketch_ids,  global_mean, global_std):
        self.sketch_base64_ecodeings = sketch_base64_ecodeings
        self.sketch_ids = sketch_ids
        self.global_transform = global_transform
        self.global_mean = global_mean
        self.global_std = global_std

        # Normalize should be applied separately on tensor
        self.normalize = transforms.Normalize(mean=[global_mean], std=[global_std])

    def __len__(self):
        return len(self.sketch_base64_ecodeings)

    def create_transformed_image(self, image):
        canvas_size = (1, 224, 224)
        canvas = torch.full(canvas_size, 0.0)

        h, w = image.shape[-2], image.shape[-1]

        center_y, center_x = (canvas_size[1] - h) // 2, (canvas_size[2] - w) // 2
        canvas[:, center_y:center_y + h, center_x:center_x + w] = image

        # Normalize the canvas tensor
        canvas = self.normalize(canvas)

        return canvas

    def __getitem__(self, idx):
        base64_str = self.sketch_base64_ecodeings[idx]
        ids = self.sketch_ids[idx]
        image_data = base64.b64decode(base64_str)
        bytes_io = BytesIO(image_data)
        image = Image.open(bytes_io)
        image = self.global_transform(image)
        transformed_image = self.create_transformed_image(image)
        return transformed_image, ids