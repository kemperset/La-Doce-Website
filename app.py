from flask import Flask, render_template

app = Flask(__name__)

# Mock product data
products = [
    {
        "id": 1,
        "name": "Apex Neon Runners",
        "price": "$189.99",
        "image": "product_1.png",
        "description": "Engineered for speed with responsive neon cushioning."
    },
    {
        "id": 2,
        "name": "Vanguard Horizon Watch",
        "price": "$299.00",
        "image": "product_2.png",
        "description": "Next-gen biometric tracking with holographic HUD."
    },
    # Using product_1 for dummy since user asked to stop image generation
    {
        "id": 3,
        "name": "Elite Tech Fleece",
        "price": "$125.00",
        "image": "product_1.png", 
        "description": "Ultra-breathable micro-fiber for peak performance."
    }
]

@app.route('/')
def home():
    return render_template('index.html', products=products)

if __name__ == '__main__':
    app.run(debug=True)
