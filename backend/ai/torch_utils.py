import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from django.conf import settings

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(3 , 32)
        self.fc2 = nn.Linear(32, 64)
        self.fc3 = nn.Linear(64, 6 )
    
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return F.log_softmax(x, dim=1)


def normalize(x: float, y: float, z: float):
    # normalizing
    x = (x + np.pi) / (2 * np.pi)
    y = (y + np.pi) / (2 * np.pi)
    z = (z + np.pi) / (2 * np.pi)

    x_y_z = np.array([x, y, z])
    return x_y_z


def get_prediction(x: float, y: float, z: float) -> float:
    # Transforming the x, y, z to a tensor
    tensor = torch.Tensor(normalize(x, y, z)).view(-1, 3)

    out = settings.NET(tensor)
    out = torch.exp(out)
    out = int(torch.argmax(out)) + 1
    
    return out