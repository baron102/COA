# Django model project
Django model project
## Installation

- Clone this repository and install dependencies

    ```commandline
    git clone https://github.com/iotfan90/django_models.git
    pip install -r requirements.txt
    cd django_models/frontend
    npm install      
  ```
- Create DB
    ```commandline
    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser
    ```  

- Run

    ```commandline
    python manage.py runserver
    cd frontend
    npm start
    ```    