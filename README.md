
# 📦 VocaPick – Hands-Free Voice-Activated Picking for Smarter Warehouses

**VocaPick** is a **hands-free warehouse management module** designed to speed up picking & packing operations using **voice commands**.
Built with **Java (Spring Boot)**, **Oracle Database**, and **AWS Transcribe** for speech-to-text recognition, it supports both **Japanese** and **English**, enabling real-time inventory updates and improved efficiency in warehouse operations.

---

## 🚀 Features

* 🎙 **Voice Command Integration** – Workers can receive and confirm picking instructions using only their voice.
* 🌐 **Multi-Language Support** – Japanese 🇯🇵 & English 🇬🇧 speech recognition.
* 📊 **Real-Time Inventory Updates** – Automatic updates in Oracle DB when an order is picked or packed.
* 🖥 **Supervisor Dashboard** – Web interface for live monitoring of orders and worker progress.
* 🔐 **Secure Role-Based Access** – Separate permissions for workers, supervisors, and admins.
* ☁ **Cloud-Ready** – Designed for AWS deployment and scalable across multiple warehouses.

---

## 🛠 Tech Stack

* **Backend:** Java (Spring Boot)
* **Database:** Oracle Database
* **Speech-to-Text:** AWS Transcribe API
* **Frontend:** HTML, CSS, JavaScript
* **Hosting:** AWS EC2 / Elastic Beanstalk
* **Version Control:** Git + GitHub

---

## 📂 Project Structure

```
VocaPick/
│── backend/                # Spring Boot backend  
│   ├── controllers/  
│   ├── services/  
│   ├── repositories/  
│   ├── models/  
│── frontend/               # Simple HTML/CSS/JS dashboard  
│── database/               # Oracle DB scripts  
│── docs/                   # Documentation & diagrams  
│── README.md               # Project documentation  
```

---

## ⚙️ Setup Instructions

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/your-username/VocaPick.git
cd VocaPick
```

### **2️⃣ Backend Setup**

* Install Java 17+ and Maven
* Configure **application.properties** with Oracle DB credentials

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
aws.transcribe.accessKey=YOUR_AWS_ACCESS_KEY
aws.transcribe.secretKey=YOUR_AWS_SECRET_KEY
```

* Run the backend:

```bash
mvn spring-boot:run
```

### **3️⃣ Frontend Setup**

* Open `frontend/index.html` in your browser for the dashboard view.

---

## 🎯 How It Works

1. **Worker says:** “Pick 3 of SKU 1021 from Aisle 4.”
2. **AWS Transcribe** converts the speech to text.
3. **Spring Boot Backend** parses the command and validates SKU from Oracle DB.
4. **Database updates** the order status in real-time.
5. **Supervisor Dashboard** reflects the updated progress instantly.

---

## 📹 Live Demo

🎥 **Watch VocaPick in action:** https://vocapick.netlify.app/

---

## 🧠 Future Enhancements

* 📷 **Image Recognition** for visual item verification.
* 🤝 **Integration with IoT sensors** for pallet/forklift tracking.
* 📈 **AI-based demand forecasting** to optimize stock levels.

---

If you want, I can also **design a minimal but professional VocaPick logo** so the README looks visually appealing and branded. That would help your application feel more like a *real product pitch*.

