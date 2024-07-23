import torch
import torch.nn as nn
from torchvision import models, transforms

class ResNet18WithDropout(nn.Module):
    def __init__(self, dropout_rate=0.5, pretrained=False):
        super(ResNet18WithDropout, self).__init__()
        if pretrained:
            self.resnet = models.resnet18(weights='DEFAULT')
        else:
            self.resnet = models.resnet18()
        self.resnet.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.resnet.fc = nn.Linear(self.resnet.fc.in_features, 240)  # 240 categories in TU-Berlin
        self.dropout = nn.Dropout(p=dropout_rate)

    def forward(self, x):
        x = self.resnet.conv1(x)
        x = self.resnet.bn1(x)
        x = self.resnet.relu(x)
        x = self.resnet.maxpool(x)

        x = self.resnet.layer1(x)
        x = self.resnet.layer2(x)
        x = self.resnet.layer3(x)
        x = self.resnet.layer4(x)

        x = self.resnet.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.dropout(x)
        features = x
        x = self.resnet.fc(x)
        return features