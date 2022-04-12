import sys
import cv2   #include opencv library functions in python
from PIL import Image
#Create an object to hold reference to camera video capturing
vidcap = cv2.VideoCapture(0)

#check if connection with camera is successfully

videoCaptureObject = cv2.VideoCapture(0)

while(True):
    ret,frame = videoCaptureObject.read()
    
    cv2.imshow('Input', frame)
    
    c = cv2.waitKey(1)
    if c==97:
        cv2.imwrite("F:\\facial-recognition\\public\\images\\imgi\\" + sys.argv[1] + ".jpg",frame)
       # unknown_image = face_recognition.load_image_file("C:\\Users\\mayan\\Desktop\\pytho\\temp_img\\" + sys.argv[1] + ".jpg")
        break
# print error if the connection with camera is unsuccessful
