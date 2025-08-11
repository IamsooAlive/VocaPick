📦 VocaPick – Real-Time Voice-Powered Warehouse Management
VocaPick is a real-time, hands-free warehouse picking and packing system designed to make warehouse operations faster, smarter, and more collaborative.
It replaces manual scanning and list-checking with voice commands, supports Japanese and English, and allows supervisors to monitor progress in real time via a dashboard—without interrupting workflow.

🚀 Features
Secure Login System – Separate login for workers and supervisors.

Voice-Enabled Picking & Packing – Powered by Java and AWS Transcribe.

Multi-Language Support – Works seamlessly in Japanese and English.

Real-Time Inventory Updates – No delays, updates happen instantly.

Supervisor Dashboard – Live task tracking without interfering with work.

Hands-Free Operation – Focus on the task, not the tech.

🛠 Tech Stack
Backend: Java

Speech Recognition: AWS Transcribe

Cloud Hosting & Storage: AWS (S3, Lambda, DynamoDB / RDS)

Frontend: HTML, CSS, JavaScript (for dashboard & login)

Authentication: AWS Cognito or Spring Security

Real-Time Updates: WebSockets / AWS API Gateway

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
🔄 How It Works (Real-Time Flow)
Login – Workers & supervisors log in securely.

Voice Command – Worker says the picking/packing instruction.

Speech Recognition – AWS Transcribe converts speech to text.

Processing – Java backend interprets the instruction and updates inventory.

Database Update – Changes are saved instantly in the cloud.

Supervisor Dashboard – Managers see live task progress without interrupting workers.

🎥 Live Demo
🔗 Watch Live Demo Here
https://voca-pick.netlify.app/

📦 Installation & Setup
bash
Copy
Edit
# Clone the repository
git clone https://github.com/yourusername/vocapick.git
cd vocapick

# Backend setup
cd backend
mvn install
mvn spring-boot:run

# Frontend setup
cd frontend
npm install
npm start
📜 License
This project is licensed under the MIT License.




