# Todo Web App 
This is a simple Todo web application built to practice full-stack development using **TypeScript, HTML, and CSS** for the frontend and **Python** for the backend. The frontend interacts with the backend using **Axios** for API requests.

## 🚀 Features
- Add, edit, and delete todos  
- Store and retrieve todos from a backend  
- Responsive UI with a clean design  
- Axios integration for API communication 

## 🛠 Technologies Used

### Frontend:
- TypeScript  
- HTML  
- CSS  
- Axios (for HTTP requests)  

### Backend:
- Python  
- FastAPI
- Database used (JSON)  

## ⚙️ Setup Instructions

### Backend

1. **Clone the repository:**
   ```sh
   git clone https://github.com/prernarohra/Todo-WebApp.git
   ```
2. **Set up a virtual environment**:
   ```sh
   python -m venv venv
   source venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Run the backend:**
   ```sh
   uvicorn endpoints:app --reload
   ```
### Frontend

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm start
   ```
## API Endpoints

### Method Endpoint Description
- **GET todos**: Fetch all todos
- **POST todos**: Add a new todo
- **PUT todos/id**: Update a todo
- **DELETE todos/id**: Delete a todo

## 📸 Screenshot
![image](https://github.com/user-attachments/assets/f915aba6-3522-475f-88ba-1ba9a48d9ddc)

## 🚀 Future Improvements

- User authentication
- Persistent storage using a database
- Dark mode UI

## 🤝 Contributing

Feel free to fork this repository and submit pull requests with improvements.
