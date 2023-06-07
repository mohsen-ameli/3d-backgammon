import os
from pathlib import Path
from datetime import timedelta


'''
    General
'''
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = str(os.environ.get("DEBUG")) == "1"

ALLOWED_HOSTS = [
    "backend.3dbackgammon.com",
    "www.backend.3dbackgammon.com",
    "localhost",
    "127.0.0.1",
]

INTERNAL_IPS = ('127.0.0.1')

INSTALLED_APPS = [
    # 3rd party
    'daphne',
    'rest_framework',
    'corsheaders',
    'storages',

    # apps
    'game',
    'users',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


'''
    Channels
'''
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)] if DEBUG else [os.environ.get("REDIS_URL")],
        },
    },
}

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application'

'''
    Database
'''
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

if DEBUG:
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.sqlite3',
           'NAME': BASE_DIR / 'db.sqlite3',
       }
   }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": os.environ.get("PGDATABASE"),
            "USER": os.environ.get("PGUSER"),
            "PASSWORD": os.environ.get("PGPASSWORD"),
            "HOST": os.environ.get("PGHOST"),
            "PORT": os.environ.get("PGPORT"),
        }
    }

'''
    Password validation
'''
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'users.CustomUser'

'''
    REST Framework
'''
REST_FRAMEWORK = {
    # 'DEFAULT_PERMISSION_CLASSES': ("rest_framework.permissions.IsAuthenticated",),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

'''
    Simple JWT
'''
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

'''
    Internationalization
'''
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

'''
    Static & Media
'''
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

'''
    AWS S3 Storage
'''
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_S3_REGION_NAME = 'us-east-1'
AWS_S3_SIGNATURE_VERSION = 's3v4'

'''
    HTTPS settings
'''
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 2592000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True

'''
    CORS
'''
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://192.168.0.173:3000',
    'https://backend.3dbackgammon.com',
    'https://www.3dbackgammon.com',
    'https://3dbackgammon.com'
]

CSRF_TRUSTED_ORIGINS = [
    'https://www.3dbackgammon.com',
    'https://3dbackgammon.com',
    'https://backend.3dbackgammon.com',
]

CORS_ALLOW_CREDENTIALS = True

'''
    Other
'''
USER_TURN_DURATION = 70 # User turn duration (Synced with frontend in Data.ts)

'''
    Neural Networks
'''
# NET = Net()
# NET.load_state_dict(torch.load("static/dice_ai.pth"))
# NET.eval()
