from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "🎙️ Audio Summarizer 起動中！"

if __name__ == "__main__":
    app.run(debug=True)