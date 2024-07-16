# 3d-backgammon

Please follow these instructions to install and run this project locally.

## **System**

_If you are on Linux then follow these instructions to install redis, otherwise please use Google to install and run it on localhost with port 6379._ <br />
Install redis `sudo apt install redis` <br />
Enable it by running `sudo systemctl enable --now redis`

## **Backend**
Export the following environment variables for Django to work:\
Make a random key for SECRET_KEY also create an aws s3 bucket and paste info below.
```
export DEBUG=1
export SECRET_KEY=
export DJANGO_SETTINGS_MODULE=backend.settings
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_STORAGE_BUCKET_NAME=
export REDIS_URL=
export PGDATABASE=
export PGUSER=
export PGPASSWORD=
export PGHOST=
export PGPORT=
```
Make a Python Virtual Environment inside the backend folder (Usually by doing `python -m venv venv`). <br />
Do `pip install -r requirements.txt` inside the same folder. <br />
Then run migrations `python manage.py migrate`<br />
Finally start the server `python manage.py runserver`

## **Frontend**
Open a second terminal and change directories to frontend.\
Make a file named `.env`, and put the following inside (make a random key for NEXTAUTH_SECRET)
```
NEXTAUTH_SECRET=<random-key>
NEXT_PUBLIC_HTTP_SERVER=http://localhost:8000
NEXT_PUBLIC_WS_SERVER=http://localhost:8000
```
Then do `npm install` followed by `npm run start`

Enjoy :)
