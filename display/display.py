from PIL import Image
from inky import InkyWHAT
from urllib.request import urlopen
import io
import os

i = InkyWHAT("red")
i.set_border(i.WHITE)

fd = urlopen(os.environ['DISPLAY_URL'])
f = io.BytesIO(fd.read())
img = Image.open(f)
i.set_image(img)
i.show()