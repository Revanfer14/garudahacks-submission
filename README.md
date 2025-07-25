# Nusakatha 🇮🇩
## Listen to the Archipelago's Whispers. A digital library of Indonesian fairy tales, made accessible for everyone.

Welcome to Nusakhata, a heartfelt project dedicated to preserving and sharing the rich tapestry of Indonesian folklore. Our mission is to connect people with the archipelago's cultural heritage through stories, language, and shared experiences, embodying the spirit of "Bhinneka Tunggal Ika" (Unity in Diversity).

## About The Project
Nusakhata was born from a desire to keep the magic of Indonesian fairy tales alive in the digital age. These stories, passed down through generations, are more than just entertainment; they are vessels of culture, wisdom, and local identity. In a rapidly globalizing world, platforms like Nusakhata serve as a digital sanctuary for these invaluable cultural treasures.

This project was developed for GarudaHacks, with the theme: Create something that helps people connect through culture, language, or shared experiences.

We believe that stories are a powerful bridge. They connect us to our past, to our diverse cultures, and to each other. Nusakhata aims to be that bridge.

## Inclusivity at Our Core
In the true spirit of "Bhinneka Tunggal Ika," diversity and unity are at the heart of Nusakhata. A key feature of our platform is Text-to-Speech (TTS) functionality. This isn't just an add-on; it's a commitment to accessibility. By enabling users to listen to the stories, we ensure that the magic of Indonesian folklore is accessible to everyone, including individuals with visual disabilities. Everyone deserves a seat at the fireside to hear these tales.

## How to run
So, you'll need Azure Text-to-Speech API Key and Azure Text-to-Speech Region in your .env file (make it in backend folder)

Don't forget to install all dependencies needed!

Here's what you need to do:
```
cd backend
pip install flask flask_cors azure-cognitiveservice-speech
python app.py
```

and then, open a new terminal, do:
```
cd frontend
npm install
npm run dev
```
Sometimes, there will be some wild dependencies so you'll need to install it manually, but don't worry, it's easy :)
