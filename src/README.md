Endpoints
=========

POST /lecture/create
  Multipart form data, upload file with name 'audio' and of type 3GP
  This will return a lecture resource that contains an ID, you must use this ID to upload notes

POST /lecture/add_photo/{id}
  Multipart form data, upload file with name 'photo' and type JPEG
  Another key with name timeStamp and value of milliseconds since audio start

Viewing endpoints
-----------------

/lecture
  view all lectures in the database
  click on any of them to see in depth

Current Galvanize IP: 10.63.149.163
