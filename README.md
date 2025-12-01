# 🛡️ SpamGuard-360
> **The Next-Generation AI Threat Detection Ecosystem**

![Build Status](https://img.shields.io/badge/Build-Stable-brightgreen?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)
![Stack](https://img.shields.io/badge/FullStack-Flask%20%2B%20React-orange?style=for-the-badge)
![AI Model](https://img.shields.io/badge/Model-SVM%20%2B%20TFIDF-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

---

## 🚨 The Problem
In the digital age, phishing and spam are no longer just annoyances—they are security threats. Traditional filters rely on "Blacklists" of keywords that hackers easily bypass. **SpamGuard-360** was built to solve this by using **Context-Aware Artificial Intelligence**.

## 💡 The Solution
**SpamGuard-360** is a hybrid threat detection system that uses **Natural Language Processing (NLP)** and **Support Vector Machines (SVM)** to analyze the *semantics* of a message, not just the keywords. It provides real-time protection across two fronts:
1.  **Web Command Center:** For detailed analysis and manual scanning.
2.  **WhatsApp Bot:** For on-the-go protection on your mobile device.

---

## ✨ Key Features (Why this is Unique)

### 🧠 **Granular Confidence Engine**
Unlike basic tools that say "Yes/No", SpamGuard-360 calculates a **Probability Score** (e.g., *"98.5% Confidence"*).
* **Green Shield:** Verified Safe (0-40% Risk)
* **Red Alert:** High-Risk Threat (>60% Risk)

### 📱 **WhatsApp Integration (Live Bot)**
Seamlessly integrated with the Twilio API. Users can forward suspicious texts to the bot and receive an instant AI analysis in **<1.5 seconds**.

### ⚡ **Advanced NLP Pipeline**
* **TF-IDF Vectorization:** Weighs rare words (like "Urgent", "Winner") higher than common words.
* **SVM Classification:** Uses a linear kernel to draw a precise mathematical line between "Spam" and "Ham".

### 🎨 **Modern "Lovable" UI**
A futuristic, responsive, dark-mode dashboard built with **React & Tailwind CSS** principles for a professional cybersecurity aesthetic.

---

## 🛠️ System Architecture

```mermaid
graph LR
    User[👤 User] -->|WhatsApp / Web| API[Flask API Server]
    API -->|Raw Text| Pre[Preprocessing Tokenizer]
    Pre -->|Cleaned Data| TF[TF-IDF Vectorizer]
    TF -->|Numeric Vectors| SVM[SVM Classifier]
    SVM -->|Probability Score| API
    API -->|Confidence & Alert| User

🧰 Tech StackComponentTechnologyRoleBackendPython, FlaskREST API & Webhook ControllerFrontendHTML5, Tailwind CSS, JSInteractive User InterfaceAI EngineScikit-Learn, PandasModel Training & PredictionIntegrationTwilio APIWhatsApp GatewayTunnelingNgrokSecure Localhost Exposure🚀 Installation & Setup GuidePrerequisitesPython 3.8 or higher installed.A free Twilio Account (for WhatsApp features).Step 1: Clone the RepositoryBashgit clone [https://github.com/your-username/spamguard-360.git](https://github.com/your-username/spamguard-360.git)
cd spamguard-360
Step 2: Install DependenciesBashpip install -r requirements.txt
Step 3: Train the "Brain"Before running the app, generate the AI model (professional_model.pkl).Bashpython train_model.py
Step 4: Run the ApplicationBashpython app.py
The Web Dashboard is now live at http://127.0.0.1:5000📲 How to Connect WhatsApp (Optional)To enable the mobile bot features:Start Ngrok: Open a terminal and run ngrok http 5000.Copy URL: Copy the forwarding URL (e.g., https://a1b2.ngrok-free.app).Configure Twilio:Go to Twilio Console > Messaging > Sandbox Settings.Paste the URL into "When a message comes in".Append /whatsapp to the end (e.g., ...app/whatsapp).Test: Send a message to your Sandbox number!
