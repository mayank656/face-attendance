import cv2
import os
from PIL import Image
import face_recognition

# cv2.namedWindow("output", cv2.WINDOW_NORMAL)        # Create window with freedom of dimensions
# im = cv2.imread("./public/images/bill1.jpg")                        # Read image
# imS = cv2.resize(im, (960, 540))                    # Resize image

# videoCaptureObject = cv2.VideoCapture(0)
# result = True
# while(result):
    # ret,frame = videoCaptureObject.read()
    
    # cv2.imwrite("C:\\Users\\mayan\\Desktop\\pytho\\temp_img\\NewPicture.jpg",frame)
    # unknown_image = face_recognition.load_image_file("./public/images/bill1.jpg")
    # face_locations = face_recognition.face_locations(unknown_image)
    # if(len(face_locations)==0):
    #     result=True
    #     print("Stand properly")
    #    # os.remove("C:\\Users\\mayan\\Desktop\\pytho\\temp_img\\NewPicture.jpg")
    # else:
        
    #     result = False
    

# videoCaptureObject.release()
# cv2.destroyAllWindows()
mayank_image = face_recognition.load_image_file("./public/images/bill2.jpg")
unknown_image = face_recognition.load_image_file("./public/images/bill1.jpg")

try:
    mayank_face_encoding = face_recognition.face_encodings(mayank_image)[0]
    unknown_face_encoding = face_recognition.face_encodings(unknown_image)[0]

    #now if no faces were found in the unknwon image, then it throws an error, 
    # and prints an alert text for the same.
except IndexError:
    print("No faces detected, Aborting...")
    quit()
known_faces = [
    mayank_face_encoding,  
]

results = face_recognition.compare_faces(known_faces, unknown_face_encoding)
#image = face_recognition.load_image_file("C:\\Users\\mayan\\Desktop\\pytho\\temp_img\\NewPicture.jpg")
print("Is the unknown face present in database ?{}".format(results[0]))