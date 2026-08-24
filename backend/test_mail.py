import os
import resend
from dotenv import load_dotenv

# .env file se environment variables (jaise API keys) load karta hai
load_dotenv()

# - Resend API key setup (.env se uthayega, agar nahi mili toh default key use karega)
resend.api_key = os.getenv("RESEND_API_KEY", "re_diHMH3iB_7oKqvoY6jkmoEAtbjbuD1hkn")

try:
    # Direct test email bhejne ki request
    r = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": "rimberiostore80@gmail.com",
        "subject": "Rimberio Direct Test Mail",
        "html": "<p>Congrats! Direct Resend API is working perfectly.</p>"
    })
    print("SUCCESS: Resend Response:", r)
except Exception as e:
    # Agar email bhejne mein koi error aaye toh yahan print ho jayega
    print("ERROR FAILED TO SEND:", str(e))