# 3d-backgammon

Please follow these instructions to install and run this project locally.

## **System**

_If you are on Linux then follow these instructions to install redis, otherwise please use Google to install and run it on localhost with port 6379._ <br />
Install redis `sudo apt install redis` <br />
Enable it by running `sudo service redis-server start`

## **Backend**

Make a Python Virtual Environment inside the backend folder (Usually by doing `python -m venv venv`). <br />
Do `pip install -r requirements.txt` inside the same folder. <br />
Then run migrations `python manage.py migrate`<br />
Finally start the server `python manage.py runserver`

## **Frontend**

Open a second terminal and change directories to frontend. <br />
Then do `npm install` followed by `npm run start`

Enjoy :)
