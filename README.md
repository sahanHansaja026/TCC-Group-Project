---

# DRCER — Parking App

Drcer is a full-stack smart parking application built with a **FastAPI backend** and a **React Native (Expo) mobile client**. Drivers can search for parking locations, view available slots, reserve a space, and manage their bookings.

This README explains how to set up and run the project locally.

---

## Project Structure

```
/ (repo root)
├─ backend/        # FastAPI backend
├─ mobile/         # React Native (Expo) mobile app
└─ README.md
```

---

# Features

* Search parking lots by location
* View available slots (with polygon map areas)
* Reserve a parking slot
* Driver profile & vehicle management
* Add billing information (credit cards)
* View and manage reservations
* Google Maps integration
* Push notifications (if configured)

---

# Requirements

### Software Needed

* **VS Code** (recommended editor)
* **Android Studio** (for Android emulator)
* **Python 3.11+**
* **Node.js 18+ / npm**
* **Expo CLI** (or use `npx expo`)

---

# Backend Setup — FastAPI

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows:**

```bash
venv\Scripts\activate
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run FastAPI server

```bash
uvicorn main:app --reload
```

The API will be available at:

```
http://localhost:8000
```

Swagger docs:

```
http://localhost:8000/docs
```

---

# Mobile Setup — React Native (Expo)

### 1. Navigate to mobile folder

```bash
cd mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Expo

```bash
npx expo start
```

Expo Metro Bundler will open in your browser.

Press:

* **a** → run on Android emulator
* **w** → run on web
* Scan QR → run on physical device

---

# Environment Variables

Add environment variables inside each project.

---

## `backend/.env`

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/parkingdb
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:19000
GOOGLE_MAPS_API_KEY=your_google_key
```

---

## `mobile/.env`

Example:

```env
API_BASE_URL=http://10.0.2.2:8000   # For Android Emulator
GOOGLE_MAPS_API_KEY=your_google_key
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
```

### IP Notes:

* **Android Emulator:** `10.0.2.2`
* **iOS Simulator (Mac):** `http://localhost:8000`
* **Physical device:** use your laptop LAN IP → `http://192.168.x.x:8000`

---

# Running on Android Emulator

1. Open **Android Studio**
2. Run any emulator from AVD Manager
3. In Expo → press **a**
4. Confirm API URL = `10.0.2.2:8000`

---

# Testing

* Use Swagger: `http://localhost:8000/docs`
* Test mobile UI using Expo on emulator/device
* Use Postman to test backend endpoints

---

# Common Commands

### Backend

| Command                           | Description               |
| --------------------------------- | ------------------------- |
| `uvicorn main:app --reload`       | Start FastAPI dev server  |
| `pip install -r requirements.txt` | Install dependencies      |
| `pytest`                          | Run tests (if configured) |

### Mobile

| Command          | Description          |
| ---------------- | -------------------- |
| `npx expo start` | Run Expo             |
| `npm install`    | Install dependencies |
| `expo doctor`    | Fix issues           |

---

# Troubleshooting

### Mobile cannot connect to backend


### Expo stuck / cache issue

Run:

```bash
npx expo start -c
```

### Backend cannot start

Check:

* Python version
* DB running (Postgres/MySQL)
* `.env` values

---

# Contributing

1. Fork repo
2. Create branch:

   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes
4. Open Pull Request

---

# License

MIT License (or your project's license).

---

# Contact

For issues or improvements, open a GitHub Issue or contact the maintainer.

---

