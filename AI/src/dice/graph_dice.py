#############################################
# This will plot all dice positions, in 3D. #
#############################################

import json
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import style
import matplotlib.patches as mpatches

class Data():
    dir_ = "dice_training_data.json"
    training_data = []

    def load_data(self):
        f = open(self.dir_)
        file = json.load(f)
        for i in file:
            input, output = i['input'], i['output']
            x, y, z = input['x'], input['y'], input['z']

            # normalizing
            # x, y, z = (x + np.pi) / 2 * np.pi

            x_y_z = np.array([x, y, z])
            one_hot = np.eye(6)[output[0]-1]

            self.training_data.append([ x_y_z, one_hot ])

        print(self.training_data)


def plot():
    style.use('ggplot')

    fig = plt.figure()
    ax1 = fig.add_subplot(111, projection='3d')
    ax1.set_xlabel('x axis')
    ax1.set_ylabel('y axis')
    ax1.set_zlabel('z axis')

    f = open("dice_training_data.json")
    file = json.load(f)

    colors = { 1: "red", 2: "green", 3: "blue", 4: "pink", 5: "orange", 6: "black", 0: "cyan" }

    for i in file:
        input, output = i['input'], i['output']
        x, y, z = input['x'], input['y'], input['z']

        x = (x + np.pi) / (2 * np.pi)
        y = (y + np.pi) / (2 * np.pi)
        z = (z + np.pi) / (2 * np.pi)
        
        ax1.plot(x, y, z, c=colors[output[0]], marker='o')

    handles = []
    for label, color in colors.items():
        legend = mpatches.Patch(color=color, label=label)
        handles.append(legend)

    plt.legend(handles=handles)
    plt.show()
    f.close()

data = Data()
plot()