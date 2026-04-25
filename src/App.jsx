import { useEffect, useState } from "react";

/* =====================================================
   SNAPLEARN - EMERGENCY MICRO LEARNING APP
   Multilingual version: English, Hindi, Tamil, Telugu,
   Malayalam, Kannada, Bengali, Marathi, Gujarati,
   Punjabi, Urdu
===================================================== */

const LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Urdu",
];

const EMERGENCY_NUMBERS = {
  ambulance: "108",
  fire: "101",
  sos: "112",
};

const SNAP_BOT_SUGGESTIONS = [
  "snake bite",
  "heavy bleeding",
  "hand fracture",
  "head injury",
  "clothes on fire",
  "baby choking",
  "dog bite",
  "bee sting",
];


/* =====================================================
   ONLINE TRANSLATION LANGUAGE CODES
   Used only for step instructions and voice guidance.
   UI labels are already translated in UI_TEXT.
===================================================== */
const TRANSLATE_LANGUAGE_CODES = {
  English: "en",
  Hindi: "hi",
  Tamil: "ta",
  Telugu: "te",
  Malayalam: "ml",
  Kannada: "kn",
  Bengali: "bn",
  Marathi: "mr",
  Gujarati: "gu",
  Punjabi: "pa",
  Urdu: "ur",
};

const VOICE_LANGUAGE_CODES = {
  English: "en-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Malayalam: "ml-IN",
  Kannada: "kn-IN",
  Bengali: "bn-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Punjabi: "pa-IN",
  Urdu: "ur-IN",
};


/* =====================================================
   UI TRANSLATIONS
   Note: Emergency data uses simple text translation below.
===================================================== */

const UI_TEXT = {
  "PANIC MODE ACTIVE": {
    English: "PANIC MODE ACTIVE",
    Hindi: "पैनिक मोड सक्रिय",
    Tamil: "பானிக் மோடு செயல்பாட்டில் உள்ளது",
    Telugu: "పానిక్ మోడ్ ప్రారంభమైంది",
    Malayalam: "പാനിക് മോഡ് സജീവമാണ്",
    Kannada: "ಪ್ಯಾನಿಕ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    Bengali: "প্যানিক মোড সক্রিয়",
    Marathi: "पॅनिक मोड सक्रिय आहे",
    Gujarati: "પેનિક મોડ સક્રિય છે",
    Punjabi: "ਪੈਨਿਕ ਮੋਡ ਚਾਲੂ ਹੈ",
    Urdu: "پینک موڈ فعال ہے",
  },
  "Stay calm. Use emergency numbers or share your location.": {
    English: "Stay calm. Use emergency numbers or share your location.",
    Hindi: "शांत रहें। आपातकालीन नंबर का उपयोग करें या अपना स्थान साझा करें।",
    Tamil: "அமைதியாக இருங்கள். அவசர எண்களை பயன்படுத்தவும் அல்லது உங்கள் இருப்பிடத்தை பகிரவும்.",
    Telugu: "శాంతంగా ఉండండి. అత్యవసర నంబర్లను ఉపయోగించండి లేదా మీ స్థానాన్ని పంచుకోండి.",
    Malayalam: "ശാന്തമായി ഇരിക്കുക. അടിയന്തര നമ്പറുകൾ ഉപയോഗിക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ ലൊക്കേഷൻ പങ്കിടുക.",
    Kannada: "ಶಾಂತವಾಗಿರಿ. ತುರ್ತು ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಿ ಅಥವಾ ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.",
    Bengali: "শান্ত থাকুন। জরুরি নম্বর ব্যবহার করুন বা আপনার অবস্থান শেয়ার করুন।",
    Marathi: "शांत राहा. आपत्कालीन नंबर वापरा किंवा तुमचे स्थान शेअर करा.",
    Gujarati: "શાંત રહો. ઈમરજન્સી નંબર વાપરો અથવા તમારું સ્થાન શેર કરો.",
    Punjabi: "ਸ਼ਾਂਤ ਰਹੋ। ਐਮਰਜੈਂਸੀ ਨੰਬਰ ਵਰਤੋ ਜਾਂ ਆਪਣੀ ਲੋਕੇਸ਼ਨ ਸਾਂਝੀ ਕਰੋ।",
    Urdu: "پرسکون رہیں۔ ایمرجنسی نمبرز استعمال کریں یا اپنی لوکیشن شیئر کریں۔",
  },
  "Ambulance 108": {
    English: "Ambulance 108", Hindi: "एम्बुलेंस 108", Tamil: "ஆம்புலன்ஸ் 108", Telugu: "అంబులెన్స్ 108", Malayalam: "ആംബുലൻസ് 108", Kannada: "ಆಂಬುಲೆನ್ಸ್ 108", Bengali: "অ্যাম্বুলেন্স 108", Marathi: "अॅम्ब्युलन्स 108", Gujarati: "એમ્બ્યુલન્સ 108", Punjabi: "ਐਂਬੂਲੈਂਸ 108", Urdu: "ایمبولینس 108",
  },
  "Fire 101": {
    English: "Fire 101", Hindi: "फायर 101", Tamil: "தீயணைப்பு 101", Telugu: "ఫైర్ 101", Malayalam: "ഫയർ 101", Kannada: "ಫೈರ್ 101", Bengali: "ফায়ার 101", Marathi: "फायर 101", Gujarati: "ફાયર 101", Punjabi: "ਫਾਇਰ 101", Urdu: "فائر 101",
  },
  "SOS 112": {
    English: "SOS 112", Hindi: "एसओएस 112", Tamil: "SOS 112", Telugu: "SOS 112", Malayalam: "SOS 112", Kannada: "SOS 112", Bengali: "SOS 112", Marathi: "SOS 112", Gujarati: "SOS 112", Punjabi: "SOS 112", Urdu: "SOS 112",
  },
  "Get My Location": {
    English: "Get My Location", Hindi: "मेरा स्थान प्राप्त करें", Tamil: "என் இருப்பிடத்தை பெறவும்", Telugu: "నా స్థానాన్ని పొందండి", Malayalam: "എന്റെ ലൊക്കേഷൻ നേടുക", Kannada: "ನನ್ನ ಸ್ಥಳ ಪಡೆಯಿರಿ", Bengali: "আমার অবস্থান নিন", Marathi: "माझे स्थान मिळवा", Gujarati: "મારું સ્થાન મેળવો", Punjabi: "ਮੇਰੀ ਲੋਕੇਸ਼ਨ ਲਵੋ", Urdu: "میری لوکیشن حاصل کریں",
  },
  "Share Location": {
    English: "Share Location", Hindi: "स्थान साझा करें", Tamil: "இருப்பிடத்தை பகிரவும்", Telugu: "స్థానాన్ని పంచుకోండి", Malayalam: "ലൊക്കേഷൻ പങ്കിടുക", Kannada: "ಸ್ಥಳ ಹಂಚಿಕೊಳ್ಳಿ", Bengali: "অবস্থান শেয়ার করুন", Marathi: "स्थान शेअर करा", Gujarati: "સ્થાન શેર કરો", Punjabi: "ਲੋਕੇਸ਼ਨ ਸਾਂਝੀ ਕਰੋ", Urdu: "لوکیشن شیئر کریں",
  },
  "Exit Panic Mode": {
    English: "Exit Panic Mode", Hindi: "पैनिक मोड बंद करें", Tamil: "பானிக் மோடு நிறுத்து", Telugu: "పానిక్ మోడ్ నుండి బయటకు రండి", Malayalam: "പാനിക് മോഡ് അവസാനിപ്പിക്കുക", Kannada: "ಪ್ಯಾನಿಕ್ ಮೋಡ್ ನಿಲ್ಲಿಸಿ", Bengali: "প্যানিক মোড বন্ধ করুন", Marathi: "पॅनिक मोड बंद करा", Gujarati: "પેનિક મોડ બંધ કરો", Punjabi: "ਪੈਨਿਕ ਮੋਡ ਬੰਦ ਕਰੋ", Urdu: "پینک موڈ بند کریں",
  },
  "Panic": {
    English: "Panic", Hindi: "पैनिक", Tamil: "பானிக்", Telugu: "పానిక్", Malayalam: "പാനിക്", Kannada: "ಪ್ಯಾನಿಕ್", Bengali: "প্যানিক", Marathi: "पॅनिक", Gujarati: "પેનિક", Punjabi: "ਪੈਨਿਕ", Urdu: "پینک",
  },
  "SnapLearn": {
    English: "SnapLearn", Hindi: "SnapLearn", Tamil: "SnapLearn", Telugu: "SnapLearn", Malayalam: "SnapLearn", Kannada: "SnapLearn", Bengali: "SnapLearn", Marathi: "SnapLearn", Gujarati: "SnapLearn", Punjabi: "SnapLearn", Urdu: "SnapLearn",
  },
  "Instant emergency guidance for India when every second matters.": {
    English: "Instant emergency guidance for India when every second matters.",
    Hindi: "भारत के लिए तुरंत आपातकालीन मार्गदर्शन, जब हर सेकंड मायने रखता है।",
    Tamil: "ஒவ்வொரு விநாடியும் முக்கியமான போது இந்தியாவிற்கான உடனடி அவசர வழிகாட்டுதல்.",
    Telugu: "ప్రతి సెకను ముఖ్యమైనప్పుడు భారతదేశానికి తక్షణ అత్యవసర మార్గదర్శకం.",
    Malayalam: "ഓരോ സെക്കൻഡും പ്രധാനമായപ്പോൾ ഇന്ത്യയ്ക്കുള്ള തൽക്ഷണ അടിയന്തര മാർഗനിർദേശം.",
    Kannada: "ಪ್ರತಿ ಕ್ಷಣವೂ ಮುಖ್ಯವಾಗಿರುವಾಗ ಭಾರತದಿಗಾಗಿ ತಕ್ಷಣದ ತುರ್ತು ಮಾರ್ಗದರ್ಶನ.",
    Bengali: "প্রতিটি সেকেন্ড গুরুত্বপূর্ণ হলে ভারতের জন্য তাৎক্ষণিক জরুরি নির্দেশনা।",
    Marathi: "प्रत्येक सेकंद महत्त्वाचा असताना भारतासाठी त्वरित आपत्कालीन मार्गदर्शन.",
    Gujarati: "દરેક સેકન્ડ મહત્વપૂર્ણ હોય ત્યારે ભારત માટે તાત્કાલિક ઈમરજન્સી માર્ગદર્શન.",
    Punjabi: "ਜਦੋਂ ਹਰ ਸੈਕਿੰਡ ਮਹੱਤਵਪੂਰਣ ਹੁੰਦਾ ਹੈ, ਭਾਰਤ ਲਈ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮਾਰਗਦਰਸ਼ਨ।",
    Urdu: "جب ہر سیکنڈ اہم ہو، بھارت کے لیے فوری ایمرجنسی رہنمائی۔",
  },
  "Search CPR, hand injury, snake bite, flood...": {
    English: "Search CPR, hand injury, snake bite, flood...",
    Hindi: "सीपीआर, हाथ की चोट, सांप काटना, बाढ़ खोजें...",
    Tamil: "CPR, கை காயம், பாம்பு கடி, வெள்ளம் தேடவும்...",
    Telugu: "CPR, చేతి గాయం, పాము కాటు, వరద వెతకండి...",
    Malayalam: "CPR, കൈ പരിക്ക്, പാമ്പുകടി, വെള്ളപ്പൊക്കം തിരയുക...",
    Kannada: "CPR, ಕೈ ಗಾಯ, ಹಾವು ಕಚ್ಚು, ಪ್ರವಾಹ ಹುಡುಕಿ...",
    Bengali: "CPR, হাতের আঘাত, সাপের কামড়, বন্যা খুঁজুন...",
    Marathi: "CPR, हाताची दुखापत, साप चावा, पूर शोधा...",
    Gujarati: "CPR, હાથની ઈજા, સાપનો દંશ, પૂર શોધો...",
    Punjabi: "CPR, ਹੱਥ ਦੀ ਚੋਟ, ਸੱਪ ਦਾ ਡੱਸਣਾ, ਹੜ੍ਹ ਖੋਜੋ...",
    Urdu: "CPR، ہاتھ کی چوٹ، سانپ کا کاٹنا، سیلاب تلاش کریں...",
  },
  "Emergency Types": {
    English: "Emergency Types", Hindi: "आपातकालीन प्रकार", Tamil: "அவசர வகைகள்", Telugu: "అత్యవసర రకాలు", Malayalam: "അടിയന്തര തരം", Kannada: "ತುರ್ತು ವಿಧಗಳು", Bengali: "জরুরি ধরন", Marathi: "आपत्कालीन प्रकार", Gujarati: "ઈમરજન્સી પ્રકારો", Punjabi: "ਐਮਰਜੈਂਸੀ ਕਿਸਮਾਂ", Urdu: "ایمرجنسی اقسام",
  },
  "Problem Cases": {
    English: "Problem Cases", Hindi: "समस्या मामले", Tamil: "பிரச்சனை நிலைகள்", Telugu: "సమస్య కేసులు", Malayalam: "പ്രശ്ന കേസുകൾ", Kannada: "ಸಮಸ್ಯೆ ಪ್ರಕರಣಗಳು", Bengali: "সমস্যার ধরন", Marathi: "समस्या प्रकार", Gujarati: "સમસ્યા કેસ", Punjabi: "ਸਮੱਸਿਆ ਕੇਸ", Urdu: "مسئلہ کیسز",
  },
  "Action Steps": {
    English: "Action Steps", Hindi: "कार्य चरण", Tamil: "செயல் படிகள்", Telugu: "చర్య దశలు", Malayalam: "പ്രവർത്തന ഘട്ടങ്ങൾ", Kannada: "ಕ್ರಮ ಹಂತಗಳು", Bengali: "কর্মধাপ", Marathi: "कृती पावले", Gujarati: "કાર્ય પગલાં", Punjabi: "ਕਾਰਵਾਈ ਕਦਮ", Urdu: "عملی اقدامات",
  },
  "Tap to view problems": {
    English: "Tap to view problems", Hindi: "समस्याएं देखने के लिए टैप करें", Tamil: "பிரச்சனைகளை காண தட்டவும்", Telugu: "సమస్యలు చూడటానికి ట్యాప్ చేయండి", Malayalam: "പ്രശ്നങ്ങൾ കാണാൻ ടാപ്പ് ചെയ്യുക", Kannada: "ಸಮಸ್ಯೆಗಳನ್ನು ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ", Bengali: "সমস্যা দেখতে ট্যাপ করুন", Marathi: "समस्या पाहण्यासाठी टॅप करा", Gujarati: "સમસ્યાઓ જોવા માટે ટેપ કરો", Punjabi: "ਸਮੱਸਿਆਵਾਂ ਵੇਖਣ ਲਈ ਟੈਪ ਕਰੋ", Urdu: "مسائل دیکھنے کے لیے ٹیپ کریں",
  },
  "No emergency found. Try another keyword.": {
    English: "No emergency found. Try another keyword.", Hindi: "कोई आपातकाल नहीं मिला। दूसरा शब्द आज़माएं।", Tamil: "அவசரம் எதுவும் கிடைக்கவில்லை. வேறு சொல்லை முயற்சிக்கவும்.", Telugu: "అత్యవసరం కనబడలేదు. మరో పదాన్ని ప్రయత్నించండి.", Malayalam: "അടിയന്തരാവസ്ഥ കണ്ടെത്തിയില്ല. മറ്റൊരു വാക്ക് ശ്രമിക്കുക.", Kannada: "ತುರ್ತು ವಿಷಯ ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಪದ ಪ್ರಯತ್ನಿಸಿ.", Bengali: "কোনো জরুরি বিষয় পাওয়া যায়নি। অন্য শব্দ চেষ্টা করুন।", Marathi: "कोणतीही आपत्कालीन माहिती सापडली नाही. दुसरा शब्द वापरा.", Gujarati: "કોઈ ઈમરજન્સી મળી નથી. બીજો શબ્દ અજમાવો.", Punjabi: "ਕੋਈ ਐਮਰਜੈਂਸੀ ਨਹੀਂ ਮਿਲੀ। ਹੋਰ ਸ਼ਬਦ ਅਜ਼ਮਾਓ।", Urdu: "کوئی ایمرجنسی نہیں ملی۔ دوسرا لفظ آزمائیں۔",
  },
  "Matched": {
    English: "Matched", Hindi: "मिलान", Tamil: "பொருந்தியது", Telugu: "సరిపోయింది", Malayalam: "പൊരുത്തപ്പെട്ടു", Kannada: "ಹೊಂದಿಕೆಯಾಗಿದೆ", Bengali: "মিলেছে", Marathi: "जुळले", Gujarati: "મેળ ખાતું", Punjabi: "ਮਿਲਿਆ", Urdu: "مماثل",
  },
  "What is the problem?": {
    English: "What is the problem?", Hindi: "समस्या क्या है?", Tamil: "பிரச்சனை என்ன?", Telugu: "సమస్య ఏమిటి?", Malayalam: "പ്രശ്നം എന്താണ്?", Kannada: "ಸಮಸ್ಯೆ ಏನು?", Bengali: "সমস্যা কী?", Marathi: "समस्या काय आहे?", Gujarati: "સમस्या શું છે?", Punjabi: "ਸਮੱਸਿਆ ਕੀ ਹੈ?", Urdu: "مسئلہ کیا ہے؟",
  },
  "Tap to see visual steps": {
    English: "Tap to see visual steps", Hindi: "दृश्य चरण देखने के लिए टैप करें", Tamil: "காட்சி படிகளை காண தட்டவும்", Telugu: "దృశ్య దశలు చూడటానికి ట్యాప్ చేయండి", Malayalam: "ദൃശ്യ ഘട്ടങ്ങൾ കാണാൻ ടാപ്പ് ചെയ്യുക", Kannada: "ದೃಶ್ಯ ಹಂತಗಳನ್ನು ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ", Bengali: "ভিজ্যুয়াল ধাপ দেখতে ট্যাপ করুন", Marathi: "दृश्य पावले पाहण्यासाठी टॅप करा", Gujarati: "દૃશ્ય પગલાં જોવા ટેપ કરો", Punjabi: "ਦ੍ਰਿਸ਼ਟੀ ਕਦਮ ਵੇਖਣ ਲਈ ਟੈਪ ਕਰੋ", Urdu: "تصویری مراحل دیکھنے کے لیے ٹیپ کریں",
  },
  "Follow these visual steps immediately": {
    English: "Follow these visual steps immediately", Hindi: "इन दृश्य चरणों का तुरंत पालन करें", Tamil: "இந்த காட்சி படிகளை உடனே பின்பற்றவும்", Telugu: "ఈ దృశ్య దశలను వెంటనే అనుసరించండి", Malayalam: "ഈ ദൃശ്യ ഘട്ടങ്ങൾ ഉടൻ പിന്തുടരുക", Kannada: "ಈ ದೃಶ್ಯ ಹಂತಗಳನ್ನು ತಕ್ಷಣ ಅನುಸರಿಸಿ", Bengali: "এই ভিজ্যুয়াল ধাপগুলো এখনই অনুসরণ করুন", Marathi: "ही दृश्य पावले त्वरित पाळा", Gujarati: "આ દૃશ્ય પગલાં તરત અનુસરો", Punjabi: "ਇਹ ਦ੍ਰਿਸ਼ਟੀ ਕਦਮ ਤੁਰੰਤ ਅਪਣਾਓ", Urdu: "ان تصویری مراحل پر فوراً عمل کریں",
  },
  "Step": {
    English: "Step", Hindi: "चरण", Tamil: "படி", Telugu: "దశ", Malayalam: "ഘട്ടം", Kannada: "ಹಂತ", Bengali: "ধাপ", Marathi: "पाऊल", Gujarati: "પગલું", Punjabi: "ਕਦਮ", Urdu: "مرحلہ",
  },
  "Start Voice Guidance": {
    English: "Start Voice Guidance", Hindi: "वॉइस गाइडेंस शुरू करें", Tamil: "குரல் வழிகாட்டலை தொடங்கவும்", Telugu: "వాయిస్ గైడెన్స్ ప్రారంభించండి", Malayalam: "വോയ്സ് മാർഗനിർദേശം ആരംഭിക്കുക", Kannada: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಆರಂಭಿಸಿ", Bengali: "ভয়েস নির্দেশনা শুরু করুন", Marathi: "व्हॉइस मार्गदर्शन सुरू करा", Gujarati: "વોઇસ માર્ગદર્શન શરૂ કરો", Punjabi: "ਵਾਇਸ ਗਾਈਡੈਂਸ ਸ਼ੁਰੂ ਕਰੋ", Urdu: "آواز رہنمائی شروع کریں",
  },
  "This app gives quick guidance only. Always contact emergency services.": {
    English: "This app gives quick guidance only. Always contact emergency services.",
    Hindi: "यह ऐप केवल त्वरित मार्गदर्शन देता है। हमेशा आपातकालीन सेवाओं से संपर्क करें।",
    Tamil: "இந்த செயலி விரைவான வழிகாட்டுதலை மட்டும் தருகிறது. எப்போதும் அவசர சேவைகளை தொடர்பு கொள்ளுங்கள்.",
    Telugu: "ఈ యాప్ త్వరిత మార్గదర్శకాన్ని మాత్రమే ఇస్తుంది. ఎల్లప్పుడూ అత్యవసర సేవలను సంప్రదించండి.",
    Malayalam: "ഈ ആപ്പ് വേഗത്തിലുള്ള മാർഗനിർദേശം മാത്രം നൽകുന്നു. എപ്പോഴും അടിയന്തര സേവനങ്ങളെ ബന്ധപ്പെടുക.",
    Kannada: "ಈ ಆಪ್ ತ್ವರಿತ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಯಾವಾಗಲೂ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    Bengali: "এই অ্যাপ শুধু দ্রুত নির্দেশনা দেয়। সবসময় জরুরি পরিষেবার সঙ্গে যোগাযোগ করুন।",
    Marathi: "हे अॅप फक्त त्वरित मार्गदर्शन देते. नेहमी आपत्कालीन सेवांशी संपर्क साधा.",
    Gujarati: "આ એપ માત્ર ઝડપી માર્ગદર્શન આપે છે. હંમેશા ઈમરજન્સી સેવાઓનો સંપર્ક કરો.",
    Punjabi: "ਇਹ ਐਪ ਸਿਰਫ਼ ਤੁਰੰਤ ਮਾਰਗਦਰਸ਼ਨ ਦਿੰਦੀ ਹੈ। ਹਮੇਸ਼ਾ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    Urdu: "یہ ایپ صرف فوری رہنمائی دیتی ہے۔ ہمیشہ ایمرجنسی سروسز سے رابطہ کریں۔",
  },
  "Back": {
    English: "Back", Hindi: "वापस", Tamil: "பின்செல்", Telugu: "వెనక్కి", Malayalam: "തിരികെ", Kannada: "ಹಿಂದೆ", Bengali: "ফিরে যান", Marathi: "मागे", Gujarati: "પાછળ", Punjabi: "ਵਾਪਸ", Urdu: "واپس",
  },
  "Open location in Google Maps": {
    English: "Open location in Google Maps", Hindi: "Google Maps में स्थान खोलें", Tamil: "Google Maps-ல் இருப்பிடத்தைத் திறக்கவும்", Telugu: "Google Mapsలో స్థానాన్ని తెరవండి", Malayalam: "Google Maps-ൽ ലൊക്കേഷൻ തുറക്കുക", Kannada: "Google Maps ನಲ್ಲಿ ಸ್ಥಳ ತೆರೆಯಿರಿ", Bengali: "Google Maps-এ অবস্থান খুলুন", Marathi: "Google Maps मध्ये स्थान उघडा", Gujarati: "Google Maps માં સ્થાન ખોલો", Punjabi: "Google Maps ਵਿੱਚ ਲੋਕੇਸ਼ਨ ਖੋਲ੍ਹੋ", Urdu: "Google Maps میں لوکیشن کھولیں",
  },
  "Getting your location...": {
    English: "Getting your location...", Hindi: "आपका स्थान प्राप्त किया जा रहा है...", Tamil: "உங்கள் இருப்பிடம் பெறப்படுகிறது...", Telugu: "మీ స్థానాన్ని పొందుతోంది...", Malayalam: "നിങ്ങളുടെ ലൊക്കേഷൻ ലഭ്യമാക്കുന്നു...", Kannada: "ನಿಮ್ಮ ಸ್ಥಳ ಪಡೆಯಲಾಗುತ್ತಿದೆ...", Bengali: "আপনার অবস্থান নেওয়া হচ্ছে...", Marathi: "तुमचे स्थान मिळत आहे...", Gujarati: "તમારું સ્થાન મેળવી રહ્યા છીએ...", Punjabi: "ਤੁਹਾਡੀ ਲੋਕੇਸ਼ਨ ਲਈ ਜਾ ਰਹੀ ਹੈ...", Urdu: "آپ کی لوکیشن حاصل کی جا رہی ہے...",
  },
  "Please get location first.": {
    English: "Please get location first.", Hindi: "कृपया पहले स्थान प्राप्त करें।", Tamil: "முதலில் இருப்பிடத்தை பெறவும்.", Telugu: "దయచేసి ముందుగా స్థానాన్ని పొందండి.", Malayalam: "ദയവായി ആദ്യം ലൊക്കേഷൻ നേടുക.", Kannada: "ದಯವಿಟ್ಟು ಮೊದಲು ಸ್ಥಳ ಪಡೆಯಿರಿ.", Bengali: "অনুগ্রহ করে আগে অবস্থান নিন।", Marathi: "कृपया आधी स्थान मिळवा.", Gujarati: "કૃપા કરીને પહેલાં સ્થાન મેળવો.", Punjabi: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਲੋਕੇਸ਼ਨ ਲਵੋ.", Urdu: "براہ کرم پہلے لوکیشن حاصل کریں۔",
  },
};

/* =====================================================
   EMERGENCY DATA
   English source is kept. Display translations are generated
   by translateEmergencyText() for selected language.
===================================================== */

const EMERGENCIES = [
  {
    name: "CPR Emergency",
    icon: "❤️",
    problems: [
      {
        title: "Person Not Breathing",
        keywords: "breathing breath unconscious no breathing",
        steps: [
          { image: "👂", text: "Check breathing by looking at the chest and listening near the mouth." },
          { image: "📞", text: "Call ambulance immediately. In India, dial 108 or 112." },
          { image: "🛌", text: "Place the person flat on their back on a firm surface." },
          { image: "🤲❤️", text: "Place both hands in the center of the chest." },
          { image: "⬇️⬆️", text: "Push hard and fast until medical help arrives." },
        ],
      },
      {
        title: "No Pulse",
        keywords: "pulse heartbeat heart attack cardiac arrest",
        steps: [
          { image: "✋", text: "Check response by tapping the person and calling loudly." },
          { image: "📞🚑", text: "Call ambulance immediately. In India, dial 108." },
          { image: "🤲", text: "Keep your hands in the center of the chest." },
          { image: "⚡", text: "Start fast chest compressions without delay." },
          { image: "👨‍⚕️", text: "Continue until the person responds or help arrives." },
        ],
      },
    ],
  },
  {
    name: "Fire Emergency",
    icon: "🔥",
    problems: [
      {
        title: "Room Fire",
        keywords: "fire room house building kitchen flame smoke",
        steps: [
          { image: "📢", text: "Alert everyone nearby immediately." },
          { image: "🚪", text: "Leave the room quickly and safely." },
          { image: "🚪✋", text: "Close the door behind you if it is safe." },
          { image: "🪜", text: "Use stairs only. Do not use elevators." },
          { image: "📞🚒", text: "Call fire emergency services. In India, dial 101 or 112." },
        ],
      },
      {
        title: "Clothes on Fire",
        keywords: "cloth fire clothes burning dress fire burn",
        steps: [
          { image: "🧍‍♂️🔥", text: "Stop moving immediately. Running spreads the fire." },
          { image: "⬇️", text: "Drop down to the ground carefully." },
          { image: "🔄", text: "Roll on the ground to put out the flames." },
          { image: "🧥", text: "Cover with a thick cloth or blanket if available." },
          { image: "🚑", text: "Call ambulance 108 and treat burns carefully." },
        ],
      },
      {
        title: "Smoke Inhalation",
        keywords: "smoke breathing suffocation inhalation gas",
        steps: [
          { image: "💨", text: "Move away from smoke immediately." },
          { image: "😷", text: "Cover nose and mouth with cloth." },
          { image: "⬇️", text: "Stay low near the ground because smoke rises." },
          { image: "🌬️", text: "Move to fresh air as fast as possible." },
          { image: "📞🚑", text: "Call 108 if breathing is difficult." },
        ],
      },
    ],
  },
  {
    name: "Road Accident",
    icon: "🚑",
    problems: [
      {
        title: "Head Injury",
        keywords: "head injury head wound brain helmet accident bleeding head",
        steps: [
          { image: "🚧", text: "First make sure the accident area is safe." },
          { image: "🧠", text: "Do not move the injured person unnecessarily." },
          { image: "🧍‍♂️", text: "Keep the head and neck still." },
          { image: "📞🚑", text: "Call ambulance immediately. In India, dial 108 or 112." },
          { image: "👀", text: "Watch breathing and stay with the person." },
        ],
      },
      {
        title: "Hand / Leg Fracture",
        keywords: "hand injury leg injury fracture bone broken arm pain swelling",
        steps: [
          { image: "🦴", text: "Do not try to straighten the injured bone." },
          { image: "✋", text: "Keep the injured part still." },
          { image: "🧣", text: "Support it using cloth or soft material." },
          { image: "🧊", text: "Apply cold pack if available." },
          { image: "🏥", text: "Take the person to medical help or call 108." },
        ],
      },
      {
        title: "Heavy Bleeding",
        keywords: "bleeding blood cut wound heavy blood injury",
        steps: [
          { image: "🩸", text: "Press the wound using a clean cloth." },
          { image: "✋", text: "Keep pressure continuously." },
          { image: "⬆️", text: "Raise the injured part if possible." },
          { image: "🚫", text: "Do not remove the cloth if blood soaks through." },
          { image: "📞🚑", text: "Call ambulance 108 immediately." },
        ],
      },
    ],
  },
  {
    name: "Choking",
    icon: "⚠️",
    problems: [
      {
        title: "Adult Choking",
        keywords: "adult choking food stuck throat breathing problem",
        steps: [
          { image: "🗣️", text: "Ask if the person can breathe or speak." },
          { image: "🤧", text: "Encourage coughing if they can cough." },
          { image: "🧍‍♂️⬅️", text: "Stand behind the person." },
          { image: "🤲", text: "Give abdominal thrusts carefully." },
          { image: "📞🚑", text: "Call 108 if breathing does not improve." },
        ],
      },
      {
        title: "Baby Choking",
        keywords: "baby choking infant newborn food stuck",
        steps: [
          { image: "📞🚑", text: "Call ambulance 108 immediately." },
          { image: "👶⬇️", text: "Place baby face down on your forearm." },
          { image: "✋", text: "Give gentle back blows." },
          { image: "👶↩️", text: "Turn baby carefully and give chest thrusts." },
          { image: "🔁", text: "Repeat until the object comes out or help arrives." },
        ],
      },
    ],
  },
  {
    name: "Disaster / Catastrophic Failure",
    icon: "🌪️",
    problems: [
      {
        title: "Earthquake",
        keywords: "earthquake shaking building damage disaster",
        steps: [
          { image: "⬇️", text: "Drop down to the ground immediately." },
          { image: "🛡️", text: "Take cover under a strong table or near an inside wall." },
          { image: "🤲", text: "Hold your head and neck with your hands." },
          { image: "🚫🛗", text: "Do not use elevators during or after shaking." },
          { image: "📞", text: "After reaching safety, call 112 for emergency support." },
        ],
      },
      {
        title: "Flood",
        keywords: "flood water rain trapped drowning disaster",
        steps: [
          { image: "⬆️🏠", text: "Move to higher ground immediately." },
          { image: "🚫🌊", text: "Do not walk or drive through flood water." },
          { image: "🔌", text: "Switch off electricity only if it is safe and dry." },
          { image: "🎒", text: "Carry phone, water, medicines, and important documents." },
          { image: "📞🚨", text: "Call 112 if trapped or in danger." },
        ],
      },
      {
        title: "Building Collapse",
        keywords: "building collapse house collapse wall fall trapped debris",
        steps: [
          { image: "🏚️", text: "Move away from the damaged structure if possible." },
          { image: "😷", text: "Cover nose and mouth to avoid dust inhalation." },
          { image: "🔦", text: "Use phone light or sound to signal rescuers." },
          { image: "🚫🔥", text: "Do not light matches because gas leakage may be present." },
          { image: "📞🚨", text: "Call 112 for emergency rescue." },
        ],
      },
    ],
  },
  {
    name: "Animal & Insect Injuries",
    icon: "🐍",
    problems: [
      {
        title: "Snake Bite",
        keywords: "snake bite poison venom cobra viper",
        steps: [
          { image: "🧘", text: "Keep the person calm and still." },
          { image: "💍", text: "Remove rings, bangles, or tight items near the bite area." },
          { image: "🚫🔪", text: "Do not cut, suck, massage, or apply ice on the bite." },
          { image: "🦵", text: "Keep the bitten limb still and below heart level if possible." },
          { image: "📞🏥", text: "Go to hospital immediately or call ambulance 108." },
        ],
      },
      {
        title: "Dog Bite",
        keywords: "dog bite rabies animal bite wound",
        steps: [
          { image: "🚿", text: "Wash the wound under running water with soap for several minutes." },
          { image: "🧼", text: "Clean gently. Do not scrub harshly." },
          { image: "🩹", text: "Cover with clean cloth or sterile bandage." },
          { image: "🏥", text: "Visit hospital quickly for rabies and tetanus advice." },
          { image: "🐕", text: "If safe, note the dog details for the doctor." },
        ],
      },
      {
        title: "Bee / Wasp Sting",
        keywords: "bee sting wasp sting insect swelling allergy",
        steps: [
          { image: "🚶", text: "Move away from the insect area." },
          { image: "🪪", text: "If a stinger is visible, scrape it out gently with a card-like object." },
          { image: "🧊", text: "Apply cold pack to reduce swelling." },
          { image: "👀", text: "Watch for breathing difficulty, face swelling, or dizziness." },
          { image: "📞🚑", text: "Call 108 immediately if allergic symptoms appear." },
        ],
      },
    ],
  },
];

/* =====================================================
   SIMPLE DATA TRANSLATION TABLE
   This keeps the full app translatable without changing JSX.
===================================================== */

const DATA_TRANSLATIONS = {
  Hindi: {
    "CPR Emergency": "सीपीआर आपातकाल", "Person Not Breathing": "व्यक्ति सांस नहीं ले रहा", "No Pulse": "नाड़ी नहीं है", "Fire Emergency": "आग आपातकाल", "Room Fire": "कमरे में आग", "Clothes on Fire": "कपड़ों में आग", "Smoke Inhalation": "धुआं अंदर जाना", "Road Accident": "सड़क दुर्घटना", "Head Injury": "सिर की चोट", "Hand / Leg Fracture": "हाथ / पैर की हड्डी टूटना", "Heavy Bleeding": "भारी रक्तस्राव", "Choking": "गला घुटना", "Adult Choking": "वयस्क में गला अटकना", "Baby Choking": "बच्चे में गला अटकना", "Disaster / Catastrophic Failure": "आपदा / बड़ी विफलता", "Earthquake": "भूकंप", "Flood": "बाढ़", "Building Collapse": "इमारत गिरना", "Animal & Insect Injuries": "जानवर और कीट चोटें", "Snake Bite": "सांप का काटना", "Dog Bite": "कुत्ते का काटना", "Bee / Wasp Sting": "मधुमक्खी / ततैया का डंक",
  },
  Tamil: {
    "CPR Emergency": "சிபிஆர் அவசரம்", "Person Not Breathing": "நபர் சுவாசிக்கவில்லை", "No Pulse": "நாடி இல்லை", "Fire Emergency": "தீ அவசரம்", "Room Fire": "அறை தீ", "Clothes on Fire": "உடையில் தீ", "Smoke Inhalation": "புகை சுவாசித்தல்", "Road Accident": "சாலை விபத்து", "Head Injury": "தலை காயம்", "Hand / Leg Fracture": "கை / கால் முறிவு", "Heavy Bleeding": "அதிக இரத்தப்போக்கு", "Choking": "மூச்சுத்திணறல்", "Adult Choking": "பெரியவர் மூச்சுத்திணறல்", "Baby Choking": "குழந்தை மூச்சுத்திணறல்", "Disaster / Catastrophic Failure": "பேரிடர் / மிகப்பெரிய விபத்து", "Earthquake": "நிலநடுக்கம்", "Flood": "வெள்ளம்", "Building Collapse": "கட்டிடம் இடிதல்", "Animal & Insect Injuries": "விலங்கு மற்றும் பூச்சி காயங்கள்", "Snake Bite": "பாம்பு கடி", "Dog Bite": "நாய் கடி", "Bee / Wasp Sting": "தேனீ / குளவி கடி",
  },
  Telugu: {
    "CPR Emergency": "సీపీఆర్ అత్యవసరం", "Person Not Breathing": "వ్యక్తి శ్వాస తీసుకోవడం లేదు", "No Pulse": "నాడి లేదు", "Fire Emergency": "అగ్ని ప్రమాదం", "Room Fire": "గదిలో మంట", "Clothes on Fire": "బట్టలకు మంట", "Smoke Inhalation": "పొగ పీల్చడం", "Road Accident": "రోడ్డు ప్రమాదం", "Head Injury": "తల గాయం", "Hand / Leg Fracture": "చేతి / కాలు విరగడం", "Heavy Bleeding": "తీవ్ర రక్తస్రావం", "Choking": "గొంతులో ఇరుక్కోవడం", "Adult Choking": "పెద్దవారి చోకింగ్", "Baby Choking": "శిశువు చోకింగ్", "Disaster / Catastrophic Failure": "విపత్తు / ఘోర ప్రమాదం", "Earthquake": "భూకంపం", "Flood": "వరద", "Building Collapse": "భవనం కూలడం", "Animal & Insect Injuries": "జంతు మరియు పురుగు గాయాలు", "Snake Bite": "పాము కాటు", "Dog Bite": "కుక్క కాటు", "Bee / Wasp Sting": "తేనెటీగ / వాస్ప్ కాటు",
  },
  Malayalam: {
    "CPR Emergency": "സിപിആർ അടിയന്തരാവസ്ഥ", "Person Not Breathing": "വ്യക്തി ശ്വസിക്കുന്നില്ല", "No Pulse": "നാഡി ഇല്ല", "Fire Emergency": "തീ അടിയന്തരാവസ്ഥ", "Room Fire": "മുറിയിൽ തീ", "Clothes on Fire": "വസ്ത്രത്തിൽ തീ", "Smoke Inhalation": "പുക ശ്വസിക്കൽ", "Road Accident": "റോഡ് അപകടം", "Head Injury": "തലക്ക് പരിക്ക്", "Hand / Leg Fracture": "കൈ / കാലിന്റെ പൊട്ടൽ", "Heavy Bleeding": "കഠിന രക്തസ്രാവം", "Choking": "ശ്വാസം മുട്ടൽ", "Adult Choking": "മുതിർന്നവരിൽ ശ്വാസം മുട്ടൽ", "Baby Choking": "കുഞ്ഞിൽ ശ്വാസം മുട്ടൽ", "Disaster / Catastrophic Failure": "ദുരന്തം / വലിയ അപകടം", "Earthquake": "ഭൂകമ്പം", "Flood": "വെള്ളപ്പൊക്കം", "Building Collapse": "കെട്ടിടം ഇടിഞ്ഞുവീഴൽ", "Animal & Insect Injuries": "മൃഗ / കീട പരിക്കുകൾ", "Snake Bite": "പാമ്പുകടി", "Dog Bite": "നായ കടിച്ചത്", "Bee / Wasp Sting": "തേനീച്ച / വാസ്പ് കുത്ത്",
  },
  Kannada: {
    "CPR Emergency": "ಸಿಪಿಆರ್ ತುರ್ತು", "Person Not Breathing": "ವ್ಯಕ್ತಿ ಉಸಿರಾಡುತ್ತಿಲ್ಲ", "No Pulse": "ನಾಡಿ ಇಲ್ಲ", "Fire Emergency": "ಬೆಂಕಿ ತುರ್ತು", "Room Fire": "ಕೊಠಡಿಯಲ್ಲಿ ಬೆಂಕಿ", "Clothes on Fire": "ಬಟ್ಟೆಗೆ ಬೆಂಕಿ", "Smoke Inhalation": "ಹೊಗೆ ಉಸಿರಾಟ", "Road Accident": "ರಸ್ತೆ ಅಪಘಾತ", "Head Injury": "ತಲೆ ಗಾಯ", "Hand / Leg Fracture": "ಕೈ / ಕಾಲು ಮುರಿತ", "Heavy Bleeding": "ತೀವ್ರ ರಕ್ತಸ್ರಾವ", "Choking": "ಉಸಿರುಗಟ್ಟಿಕೆ", "Adult Choking": "ವಯಸ್ಕರಲ್ಲಿ ಉಸಿರುಗಟ್ಟಿಕೆ", "Baby Choking": "ಮಗು ಉಸಿರುಗಟ್ಟಿಕೆ", "Disaster / Catastrophic Failure": "ವಿಪತ್ತು / ದೊಡ್ಡ ಅಪಘಾತ", "Earthquake": "ಭೂಕಂಪ", "Flood": "ಪ್ರವಾಹ", "Building Collapse": "ಕಟ್ಟಡ ಕುಸಿತ", "Animal & Insect Injuries": "ಪ್ರಾಣಿ ಮತ್ತು ಕೀಟ ಗಾಯಗಳು", "Snake Bite": "ಹಾವು ಕಚ್ಚು", "Dog Bite": "ನಾಯಿ ಕಚ್ಚು", "Bee / Wasp Sting": "ಜೇನುನೊಣ / ವಾಸ್ಪ್ ಕಚ್ಚು",
  },
  Bengali: {
    "CPR Emergency": "সিপিআর জরুরি", "Person Not Breathing": "ব্যক্তি শ্বাস নিচ্ছে না", "No Pulse": "নাড়ি নেই", "Fire Emergency": "আগুন জরুরি", "Room Fire": "ঘরে আগুন", "Clothes on Fire": "কাপড়ে আগুন", "Smoke Inhalation": "ধোঁয়া শ্বাস নেওয়া", "Road Accident": "সড়ক দুর্ঘটনা", "Head Injury": "মাথায় আঘাত", "Hand / Leg Fracture": "হাত / পা ভাঙা", "Heavy Bleeding": "অতিরিক্ত রক্তপাত", "Choking": "গলায় আটকে যাওয়া", "Adult Choking": "প্রাপ্তবয়স্কের চোকিং", "Baby Choking": "শিশুর চোকিং", "Disaster / Catastrophic Failure": "দুর্যোগ / বড় বিপর্যয়", "Earthquake": "ভূমিকম্প", "Flood": "বন্যা", "Building Collapse": "ভবন ধস", "Animal & Insect Injuries": "প্রাণী ও পোকামাকড়ের আঘাত", "Snake Bite": "সাপের কামড়", "Dog Bite": "কুকুরের কামড়", "Bee / Wasp Sting": "মৌমাছি / বোলতার হুল",
  },
  Marathi: {
    "CPR Emergency": "सीपीआर आपत्कालीन", "Person Not Breathing": "व्यक्ती श्वास घेत नाही", "No Pulse": "नाडी नाही", "Fire Emergency": "आग आपत्कालीन", "Room Fire": "खोलीत आग", "Clothes on Fire": "कपड्यांना आग", "Smoke Inhalation": "धूर श्वासात जाणे", "Road Accident": "रस्ता अपघात", "Head Injury": "डोक्याला दुखापत", "Hand / Leg Fracture": "हात / पाय फ्रॅक्चर", "Heavy Bleeding": "जास्त रक्तस्राव", "Choking": "घसा अडकणे", "Adult Choking": "प्रौढ व्यक्तीचा श्वास अडकणे", "Baby Choking": "बाळाचा श्वास अडकणे", "Disaster / Catastrophic Failure": "आपत्ती / मोठी दुर्घटना", "Earthquake": "भूकंप", "Flood": "पूर", "Building Collapse": "इमारत कोसळणे", "Animal & Insect Injuries": "प्राणी व कीटक दुखापती", "Snake Bite": "साप चावा", "Dog Bite": "कुत्रा चावा", "Bee / Wasp Sting": "मधमाशी / गांधीलमाशी चावा",
  },
  Gujarati: {
    "CPR Emergency": "CPR ઈમરજન્સી", "Person Not Breathing": "વ્યક્તિ શ્વાસ નથી લેતો", "No Pulse": "નાડી નથી", "Fire Emergency": "આગ ઈમરજન્સી", "Room Fire": "રૂમમાં આગ", "Clothes on Fire": "કપડાંમાં આગ", "Smoke Inhalation": "ધુમાડો શ્વાસમાં જવો", "Road Accident": "રોડ અકસ્માત", "Head Injury": "માથાની ઈજા", "Hand / Leg Fracture": "હાથ / પગનું ફ્રેક્ચર", "Heavy Bleeding": "વધારે રક્તસ્રાવ", "Choking": "ગળામાં અટકવું", "Adult Choking": "મોટા વ્યક્તિમાં ચોકિંગ", "Baby Choking": "બાળકમાં ચોકિંગ", "Disaster / Catastrophic Failure": "આપત્તિ / મોટી દુર્ઘટના", "Earthquake": "ભૂકંપ", "Flood": "પૂર", "Building Collapse": "ઇમારત ધરાશાયી", "Animal & Insect Injuries": "પ્રાણી અને જીવાતની ઈજા", "Snake Bite": "સાપનો દંશ", "Dog Bite": "કૂતરાનો દંશ", "Bee / Wasp Sting": "મધમાખી / વાસ્પનો ડંખ",
  },
  Punjabi: {
    "CPR Emergency": "CPR ਐਮਰਜੈਂਸੀ", "Person Not Breathing": "ਵਿਅਕਤੀ ਸਾਹ ਨਹੀਂ ਲੈ ਰਿਹਾ", "No Pulse": "ਨਬਜ਼ ਨਹੀਂ", "Fire Emergency": "ਅੱਗ ਐਮਰਜੈਂਸੀ", "Room Fire": "ਕਮਰੇ ਵਿੱਚ ਅੱਗ", "Clothes on Fire": "ਕੱਪੜਿਆਂ ਨੂੰ ਅੱਗ", "Smoke Inhalation": "ਧੂੰਆਂ ਅੰਦਰ ਜਾਣਾ", "Road Accident": "ਸੜਕ ਹਾਦਸਾ", "Head Injury": "ਸਿਰ ਦੀ ਚੋਟ", "Hand / Leg Fracture": "ਹੱਥ / ਪੈਰ ਫ੍ਰੈਕਚਰ", "Heavy Bleeding": "ਜ਼ਿਆਦਾ ਖੂਨ ਵਹਿਣਾ", "Choking": "ਗਲਾ ਰੁਕਣਾ", "Adult Choking": "ਵੱਡੇ ਵਿਅਕਤੀ ਦਾ ਗਲਾ ਰੁਕਣਾ", "Baby Choking": "ਬੱਚੇ ਦਾ ਗਲਾ ਰੁਕਣਾ", "Disaster / Catastrophic Failure": "ਆਫ਼ਤ / ਵੱਡਾ ਹਾਦਸਾ", "Earthquake": "ਭੂਚਾਲ", "Flood": "ਹੜ੍ਹ", "Building Collapse": "ਇਮਾਰਤ ਡਿੱਗਣਾ", "Animal & Insect Injuries": "ਜਾਨਵਰ ਅਤੇ ਕੀੜਿਆਂ ਦੀਆਂ ਚੋਟਾਂ", "Snake Bite": "ਸੱਪ ਦਾ ਡੱਸਣਾ", "Dog Bite": "ਕੁੱਤੇ ਦਾ ਕੱਟਣਾ", "Bee / Wasp Sting": "ਮੱਖੀ / ਭੂੰਡ ਦਾ ਡੰਗ",
  },
  Urdu: {
    "CPR Emergency": "سی پی آر ایمرجنسی", "Person Not Breathing": "شخص سانس نہیں لے رہا", "No Pulse": "نبض نہیں", "Fire Emergency": "آگ کی ایمرجنسی", "Room Fire": "کمرے میں آگ", "Clothes on Fire": "کپڑوں میں آگ", "Smoke Inhalation": "دھواں سانس میں جانا", "Road Accident": "سڑک حادثہ", "Head Injury": "سر کی چوٹ", "Hand / Leg Fracture": "ہاتھ / ٹانگ فریکچر", "Heavy Bleeding": "زیادہ خون بہنا", "Choking": "گلا بند ہونا", "Adult Choking": "بالغ کا گلا بند ہونا", "Baby Choking": "بچے کا گلا بند ہونا", "Disaster / Catastrophic Failure": "آفت / بڑا حادثہ", "Earthquake": "زلزلہ", "Flood": "سیلاب", "Building Collapse": "عمارت گرنا", "Animal & Insect Injuries": "جانور اور کیڑے کی چوٹیں", "Snake Bite": "سانپ کا کاٹنا", "Dog Bite": "کتے کا کاٹنا", "Bee / Wasp Sting": "مکھی / بھڑ کا ڈنک",
  },
};

const STEP_TRANSLATIONS = {
  Hindi: {
    "Check breathing by looking at the chest and listening near the mouth.": "छाती को देखकर और मुंह के पास सुनकर सांस जांचें।",
    "Call ambulance immediately. In India, dial 108 or 112.": "तुरंत एम्बुलेंस बुलाएं। भारत में 108 या 112 डायल करें।",
    "Place the person flat on their back on a firm surface.": "व्यक्ति को सख्त सतह पर पीठ के बल सीधा लिटाएं।",
    "Place both hands in the center of the chest.": "दोनों हाथ छाती के बीच में रखें।",
    "Push hard and fast until medical help arrives.": "मेडिकल मदद आने तक जोर से और तेजी से दबाएं।",
  },
  Tamil: {
    "Check breathing by looking at the chest and listening near the mouth.": "மார்பை பார்த்து, வாயருகே கேட்டு சுவாசத்தை சரிபார்க்கவும்.",
    "Call ambulance immediately. In India, dial 108 or 112.": "உடனே ஆம்புலன்ஸை அழைக்கவும். இந்தியாவில் 108 அல்லது 112 அழைக்கவும்.",
    "Place the person flat on their back on a firm surface.": "நபரை உறுதியான தரையில் முதுகில் நேராக படுக்க வைக்கவும்.",
    "Place both hands in the center of the chest.": "இரு கைகளையும் மார்பின் நடுவில் வைக்கவும்.",
    "Push hard and fast until medical help arrives.": "மருத்துவ உதவி வரும் வரை வலுவாகவும் வேகமாகவும் அழுத்தவும்.",
  },
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [search, setSearch] = useState("");
  const [panicMode, setPanicMode] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [language, setLanguage] = useState("English");
  const [translationCache, setTranslationCache] = useState({});
  const [botOpen, setBotOpen] = useState(false);
  const [botInput, setBotInput] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [manualLocation, setManualLocation] = useState(() => localStorage.getItem("snaplearnManualLocation") || "");
  const [emergencyProfile, setEmergencyProfile] = useState(() => {
    const savedProfile = localStorage.getItem("snaplearnEmergencyProfile");

    if (savedProfile) {
      try {
        return JSON.parse(savedProfile) || {
          name: "",
          emergencyContactName: "",
          emergencyContactNumber: "",
          bloodGroup: "",
          medicalNotes: "",
        };
      } catch {
        return {
          name: "",
          emergencyContactName: "",
          emergencyContactNumber: "",
          bloodGroup: "",
          medicalNotes: "",
        };
      }
    }

    return {
      name: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      bloodGroup: "",
      medicalNotes: "",
    };
  });

  function ui(key) {
    return UI_TEXT[key]?.[language] || UI_TEXT[key]?.English || key;
  }

  function getCacheKey(text, lang = language) {
    return `${lang}::${text}`;
  }

  useEffect(() => {
    localStorage.setItem("snaplearnEmergencyProfile", JSON.stringify(emergencyProfile));
  }, [emergencyProfile]);

  useEffect(() => {
    localStorage.setItem("snaplearnManualLocation", manualLocation);
  }, [manualLocation]);

  function updateProfile(field, value) {
    setEmergencyProfile((previousProfile) => ({
      ...previousProfile,
      [field]: value,
    }));
  }

  function buildEmergencyMessage() {
    const profileLines = [];

    if (emergencyProfile.name) profileLines.push(`Name: ${emergencyProfile.name}`);
    if (emergencyProfile.emergencyContactName) profileLines.push(`Emergency Contact: ${emergencyProfile.emergencyContactName}`);
    if (emergencyProfile.emergencyContactNumber) profileLines.push(`Contact Number: ${emergencyProfile.emergencyContactNumber}`);
    if (emergencyProfile.bloodGroup) profileLines.push(`Blood Group: ${emergencyProfile.bloodGroup}`);
    if (emergencyProfile.medicalNotes) profileLines.push(`Medical Notes: ${emergencyProfile.medicalNotes}`);

    const locationLine = locationText?.includes("google.com/maps")
      ? `Live Location: ${locationText}`
      : manualLocation
        ? `Saved Location: ${manualLocation}`
        : "Location: Not available";

    return `Emergency! I need help.\n${profileLines.join("\n")}\n${locationLine}`;
  }

  function shareEmergencyCard() {
    const message = buildEmergencyMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  }

  function callSavedContact() {
    if (!emergencyProfile.emergencyContactNumber) {
      alert("Please add emergency contact number in settings first.");
      setSettingsOpen(true);
      return;
    }

    callNumber(emergencyProfile.emergencyContactNumber);
  }

  function useSavedLocation() {
    if (!manualLocation.trim()) {
      setLocationError("Please save your address/location in Emergency ID settings first.");
      setSettingsOpen(true);
      return;
    }

    setLocationText(`Saved location: ${manualLocation}`);
    setLocationError("");
  }

  async function translateOnline(text, targetLanguage = language) {
    if (targetLanguage === "English") return text;

    const staticTranslation =
      STEP_TRANSLATIONS[targetLanguage]?.[text] || DATA_TRANSLATIONS[targetLanguage]?.[text];

    if (staticTranslation) return staticTranslation;

    const cacheKey = getCacheKey(text, targetLanguage);
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    try {
      const targetCode = TRANSLATE_LANGUAGE_CODES[targetLanguage];
      if (!targetCode) return text;

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetCode}`
      );
      const data = await response.json();
      const translatedText = data?.responseData?.translatedText || text;

      setTranslationCache((previousCache) => ({
        ...previousCache,
        [cacheKey]: translatedText,
      }));

      return translatedText;
    } catch (error) {
      return text;
    }
  }

  function dataText(text) {
    if (language === "English") return text;

    const staticTranslation =
      STEP_TRANSLATIONS[language]?.[text] || DATA_TRANSLATIONS[language]?.[text];

    if (staticTranslation) return staticTranslation;

    const cacheKey = getCacheKey(text);
    return translationCache[cacheKey] || text;
  }

  useEffect(() => {
    if (language === "English" || !selectedProblem) return;

    selectedProblem.steps.forEach((step) => {
      translateOnline(step.text, language);
    });
  }, [language, selectedProblem]);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  function callNumber(number) {
    window.location.href = `tel:${number}`;
  }

  function goBack() {
    if (selectedProblem) setSelectedProblem(null);
    else setSelectedEmergency(null);
  }

  function getLocation() {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location is not supported on this device. Use saved manual location instead.");
      useSavedLocation();
      return;
    }

    setLocationText(ui("Getting your location..."));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocationText(`https://www.google.com/maps?q=${lat},${lon}`);
        setLocationError("");
      },
      (error) => {
        if (error.code === 1) {
          setLocationError("Location permission denied. Open browser site settings and allow Location, or use your saved manual location.");
        } else if (error.code === 2) {
          setLocationError("Location unavailable. Check GPS/mobile data or use saved manual location.");
        } else {
          setLocationError("Location request timed out. Try again or use saved manual location.");
        }

        if (manualLocation.trim()) {
          setLocationText(`Saved location: ${manualLocation}`);
        } else {
          setLocationText("");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  }

  function shareLocation() {
    const message = buildEmergencyMessage();

    if (!locationText && !manualLocation.trim()) {
      alert("Please get live location or save a manual location first.");
      setSettingsOpen(true);
      return;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  }

  async function speakSteps() {
    if (!selectedProblem) return;

    const translatedSteps = await Promise.all(
      selectedProblem.steps.map((step) => translateOnline(step.text, language))
    );

    const message = translatedSteps.join(". ");
    const voice = new SpeechSynthesisUtterance(message);
    voice.lang = VOICE_LANGUAGE_CODES[language] || "en-IN";

    speechSynthesis.cancel();
    speechSynthesis.speak(voice);
  }

  const searchKeyword = search.toLowerCase().trim();

  function problemMatches(problem, keyword) {
    const stepText = problem.steps.map((step) => step.text).join(" ");
    const searchableText = `${problem.title} ${problem.keywords} ${stepText}`.toLowerCase();
    return searchableText.includes(keyword);
  }

  function emergencyMatches(emergency, keyword) {
    return (
      emergency.name.toLowerCase().includes(keyword) ||
      emergency.problems.some((problem) => problemMatches(problem, keyword))
    );
  }

  const filteredEmergencies = EMERGENCIES.filter((emergency) => {
    if (searchKeyword === "") return true;
    return emergencyMatches(emergency, searchKeyword);
  });

  function getMatchedProblems(emergency) {
    if (searchKeyword === "") return [];
    return emergency.problems.filter((problem) => problemMatches(problem, searchKeyword));
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function openGuidance(emergency, problem, message = "") {
    if (!emergency || !problem) return;
    setSelectedEmergency(emergency);
    setSelectedProblem(problem);
    setBotOpen(false);
    if (message) setBotMessage(message);
  }

  function getProblemByTitle(title) {
    const normalizedTitle = normalizeText(title);

    for (let emergency of EMERGENCIES) {
      for (let problem of emergency.problems) {
        if (normalizeText(problem.title) === normalizedTitle) {
          return { emergency, problem };
        }
      }
    }

    return null;
  }

  function smartMatchGuidance(aiData) {
    const aiText = normalizeText(`
      ${aiData?.emergency || ""}
      ${aiData?.problem || ""}
      ${aiData?.reason || ""}
      ${aiData?.description || ""}
      ${aiData?.keywords || ""}
    `);

    // Strong safety overrides first
    const emergencyRules = [
      {
        words: ["snake", "snakebite", "snake bite", "cobra", "viper", "venom", "fang", "fangs", "puncture", "two red", "bite mark"],
        problem: "Snake Bite",
      },
      {
        words: ["dog", "rabies", "dog bite"],
        problem: "Dog Bite",
      },
      {
        words: ["bee", "wasp", "sting", "insect sting"],
        problem: "Bee / Wasp Sting",
      },
      {
        words: ["bleeding", "blood", "wound", "cut", "gash", "deep wound", "open wound"],
        problem: "Heavy Bleeding",
      },
      {
        words: ["fracture", "broken", "broken bone", "broken arm", "broken leg", "swelling bone", "bent hand", "bent leg"],
        problem: "Hand / Leg Fracture",
      },
      {
        words: ["head injury", "head wound", "helmet", "brain"],
        problem: "Head Injury",
      },
      {
        words: ["fire", "flame", "burning room", "room fire"],
        problem: "Room Fire",
      },
      {
        words: ["clothes fire", "cloth fire", "dress fire", "clothes burning"],
        problem: "Clothes on Fire",
      },
      {
        words: ["smoke", "suffocation", "gas"],
        problem: "Smoke Inhalation",
      },
      {
        words: ["choking", "throat", "food stuck"],
        problem: "Adult Choking",
      },
      {
        words: ["baby choking", "infant choking"],
        problem: "Baby Choking",
      },
      {
        words: ["earthquake"],
        problem: "Earthquake",
      },
      {
        words: ["flood", "flood water"],
        problem: "Flood",
      },
      {
        words: ["building collapse", "collapsed building", "debris"],
        problem: "Building Collapse",
      },
    ];

    for (let rule of emergencyRules) {
      if (rule.words.some((word) => aiText.includes(word))) {
        return getProblemByTitle(rule.problem);
      }
    }

    // Exact AI problem title match
    const exact = getProblemByTitle(aiData?.problem);
    if (exact) return exact;

    // Safer fuzzy match against problem title + keywords only
    for (let emergency of EMERGENCIES) {
      for (let problem of emergency.problems) {
        const problemText = normalizeText(`${problem.title} ${problem.keywords}`);
        if (problemText && aiText && (aiText.includes(problemText) || problemText.includes(aiText))) {
          return { emergency, problem };
        }
      }
    }

    return null;
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setAiResult(null);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function analyzeImage() {
    if (!imageFile) {
      setBotMessage("Please upload or capture an image first.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = reader.result.split(",")[1];

        setLoadingAI(true);
        setBotMessage("Analyzing image... Please wait 5–15 seconds.");

        const response = await fetch("/api/analyze-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: imageFile.type || "image/jpeg",
          }),
        });

        const data = await response.json();
        console.log("AI RESULT:", data);

        setLoadingAI(false);
        setAiResult(data);

        if (!response.ok) {
          setBotMessage(data?.error || "AI image analysis failed. Try typing the problem instead.");
          return;
        }

        const match = smartMatchGuidance(data);

        if (match) {
          openGuidance(
            match.emergency,
            match.problem,
            `Photo matched: ${match.problem.title}`
          );
          return;
        }

        setBotMessage(
          "AI could not safely match guidance. Please type the problem in SnapBot, like snake bite, bleeding, fire, or fracture."
        );
      } catch (error) {
        setLoadingAI(false);
        setBotMessage("Image analysis failed. Please try again.");
      }
    };

    reader.readAsDataURL(imageFile);
  }

  const totalEmergencyTypes = EMERGENCIES.length;
  const totalProblems = EMERGENCIES.reduce((total, emergency) => total + emergency.problems.length, 0);
  const totalSteps = EMERGENCIES.reduce((total, emergency) => {
    return total + emergency.problems.reduce((problemTotal, problem) => problemTotal + problem.steps.length, 0);
  }, 0);
  function askSnapBot(inputValue = botInput) {
    const userText = normalizeText(inputValue);

    if (userText === "") {
      setBotMessage("⚠️ Please type your emergency problem. Example: snake bite, bleeding, fire, choking.");
      return;
    }

    setBotMessage("🔍 Finding the best guidance...");

    const quickRules = [
      { words: ["snake", "snakebite", "cobra", "viper", "venom", "fang"], problem: "Snake Bite" },
      { words: ["dog", "rabies"], problem: "Dog Bite" },
      { words: ["bee", "wasp", "sting", "insect"], problem: "Bee / Wasp Sting" },
      { words: ["blood", "bleeding", "wound", "cut", "gash"], problem: "Heavy Bleeding" },
      { words: ["fracture", "broken", "bone", "bent hand", "bent leg"], problem: "Hand / Leg Fracture" },
      { words: ["head", "helmet", "brain"], problem: "Head Injury" },
      { words: ["cloth fire", "clothes fire", "dress fire", "burning clothes"], problem: "Clothes on Fire" },
      { words: ["fire", "flame", "kitchen fire", "room fire"], problem: "Room Fire" },
      { words: ["smoke", "gas", "suffocation"], problem: "Smoke Inhalation" },
      { words: ["baby choking", "infant choking"], problem: "Baby Choking" },
      { words: ["choking", "throat", "food stuck"], problem: "Adult Choking" },
      { words: ["earthquake"], problem: "Earthquake" },
      { words: ["flood", "water"], problem: "Flood" },
      { words: ["collapse", "debris", "building fall"], problem: "Building Collapse" },
      { words: ["not breathing", "no breathing", "unconscious"], problem: "Person Not Breathing" },
      { words: ["no pulse", "heartbeat", "cardiac"], problem: "No Pulse" },
    ];

    for (let rule of quickRules) {
      if (rule.words.some((word) => userText.includes(normalizeText(word)))) {
        const match = getProblemByTitle(rule.problem);
        if (match) {
          openGuidance(match.emergency, match.problem, `✅ Quick match: ${match.problem.title}`);
          setBotInput("");
          return;
        }
      }
    }

    const fakeAiData = {
      emergency: userText,
      problem: userText,
      reason: userText,
      description: userText,
      keywords: userText,
    };

    const smartMatch = smartMatchGuidance(fakeAiData);

    if (smartMatch) {
      openGuidance(
        smartMatch.emergency,
        smartMatch.problem,
        `✅ Found guidance for: ${smartMatch.problem.title}`
      );
      setBotInput("");
      return;
    }

    let bestMatch = null;
    let bestScore = 0;

    for (let emergency of EMERGENCIES) {
      for (let problem of emergency.problems) {
        const searchText = normalizeText(`
          ${emergency.name}
          ${problem.title}
          ${problem.keywords}
          ${problem.steps.map((step) => step.text).join(" ")}
        `);

        const userWords = userText.split(" ").filter((word) => word.length > 2);
        const score = userWords.filter((word) => searchText.includes(word)).length;

        if (score > bestScore) {
          bestScore = score;
          bestMatch = { emergency, problem };
        }
      }
    }

    if (bestMatch && bestScore >= 1) {
      openGuidance(
        bestMatch.emergency,
        bestMatch.problem,
        `✅ Closest guidance: ${bestMatch.problem.title}`
      );
      setBotInput("");
    } else {
      setBotMessage("❌ I could not clearly understand. Try simple words like: snake bite, bleeding, fracture, fire, choking, dog bite.");
    }
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="topActionButtons">
        <button className="settingsFab" onClick={() => setSettingsOpen(true)}>
          ⚙️ Emergency ID
        </button>

        <button className="snapBotButton" onClick={() => setBotOpen(true)}>
          🤖 SnapBot
        </button>
      </div>

      {settingsOpen && (
        <div className="modalOverlay">
          <div className="settingsPanel">
            <div className="settingsHeader">
              <div>
                <span className="tinyLabel">Emergency Settings</span>
                <h2>🛡️ Emergency ID Card</h2>
              </div>
              <button onClick={() => setSettingsOpen(false)}>×</button>
            </div>

            <p className="settingsNote">
              Save important details once. During panic mode you can quickly share your emergency contact, medical note and saved location.
            </p>

            <div className="settingsGrid">
              <label>Your Name<input value={emergencyProfile.name} onChange={(e) => updateProfile("name", e.target.value)} placeholder="Example: Abdul Jameel" /></label>
              <label>Emergency Contact Name<input value={emergencyProfile.emergencyContactName} onChange={(e) => updateProfile("emergencyContactName", e.target.value)} placeholder="Example: Father / Friend" /></label>
              <label>Emergency Contact Number<input value={emergencyProfile.emergencyContactNumber} onChange={(e) => updateProfile("emergencyContactNumber", e.target.value)} placeholder="Example: 9876543210" /></label>
              <label>Blood Group<input value={emergencyProfile.bloodGroup} onChange={(e) => updateProfile("bloodGroup", e.target.value)} placeholder="Example: B+" /></label>
              <label className="fullWidth">Saved Address / Common Location<textarea value={manualLocation} onChange={(e) => setManualLocation(e.target.value)} placeholder="Example: Rajalakshmi Engineering College, Chennai" /></label>
              <label className="fullWidth">Medical Notes<textarea value={emergencyProfile.medicalNotes} onChange={(e) => updateProfile("medicalNotes", e.target.value)} placeholder="Example: No known allergies / diabetic / asthma" /></label>
            </div>

            <div className="emergencyCardPreview">
              <h3>🚑 Quick Emergency Card</h3>
              <p><b>Name:</b> {emergencyProfile.name || "Not added"}</p>
              <p><b>Contact:</b> {emergencyProfile.emergencyContactName || "Not added"} {emergencyProfile.emergencyContactNumber ? `(${emergencyProfile.emergencyContactNumber})` : ""}</p>
              <p><b>Blood:</b> {emergencyProfile.bloodGroup || "Not added"}</p>
              <p><b>Location:</b> {manualLocation || "Not added"}</p>
            </div>

            <div className="settingsActions">
              <button onClick={callSavedContact}>📞 Call Contact</button>
              <button onClick={shareEmergencyCard}>📤 Share Emergency Card</button>
              <button onClick={() => setSettingsOpen(false)}>✅ Done</button>
            </div>

            <p className="settingsWarning">Note: A normal web app cannot bypass your phone password from the lock screen. For demo, this Emergency ID works inside the app/APK. Real lock-screen access needs native Android lock-screen/notification permissions.</p>
          </div>
        </div>
      )}

      {botOpen && (
        <div className="snapBotBox">
          <div className="snapBotHeader"><div><span className="tinyLabel">AI emergency assistant</span><h3>🤖 SnapBot</h3></div><button onClick={() => setBotOpen(false)}>×</button></div>
          <p className="snapBotText">Type the situation or upload a photo. SnapBot will open the closest safe guidance.</p>
          <input type="text" placeholder="Example: snake bite, blood from hand, baby choking" value={botInput} onChange={(e) => setBotInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") askSnapBot(); }} />
          <div className="suggestionChips">
            {SNAP_BOT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setBotInput(suggestion);
                  askSnapBot(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <label className="photoUploadLabel">📸 Upload / Capture Emergency Photo<input type="file" accept="image/*" capture="environment" onChange={handleImageChange} /></label>
          {imagePreview && <img className="snapBotPreview" src={imagePreview} alt="Emergency preview" />}
          <div className="snapBotActions"><button className="snapBotAsk" onClick={() => askSnapBot()}>Find Guidance</button><button className="snapBotAnalyze" onClick={analyzeImage} disabled={loadingAI}>{loadingAI ? "Analyzing..." : "Analyze Photo with AI"}</button></div>
          {loadingAI && <div className="botLoader"><span></span> Checking image safely...</div>}
          {aiResult && (<div className="aiResultCard"><strong>AI Result:</strong> {aiResult.problem || "Unclear"} ({aiResult.confidence || "low"}){aiResult.reason && <p>{aiResult.reason}</p>}</div>)}
          {botMessage && <p className="snapBotMessage">{botMessage}</p>}
          <p className="snapBotHint">Tip: If photo result is unclear, type simple words like “snake bite”, “bleeding”, “fracture”, “fire”.</p>
        </div>
      )}
      <div className={panicMode ? "panicBar showPanic" : "panicBar"}>
        <h2>🚨 {ui("PANIC MODE ACTIVE")}</h2>
        <p>{ui("Stay calm. Use emergency numbers or share your location.")}</p>

        <div className="panicActions">
          <button onClick={() => callNumber(EMERGENCY_NUMBERS.ambulance)}>🚑 {ui("Ambulance 108")}</button>
          <button onClick={() => callNumber(EMERGENCY_NUMBERS.fire)}>🔥 {ui("Fire 101")}</button>
          <button onClick={() => callNumber(EMERGENCY_NUMBERS.sos)}>🆘 {ui("SOS 112")}</button>
        </div>

        <div className="emergencyProfileStrip"><span>👤 {emergencyProfile.name || "Add your name in Emergency ID"}</span><span>🩸 {emergencyProfile.bloodGroup || "Blood group not added"}</span><span>☎️ {emergencyProfile.emergencyContactNumber || "Emergency contact not added"}</span></div>
        <div className="locationBox">
          <button onClick={getLocation}>📍 {ui("Get My Location")}</button>
          <button onClick={useSavedLocation}>🏠 Use Saved Location</button>
          <button onClick={shareLocation}>📤 {ui("Share Location")}</button>
          <button onClick={shareEmergencyCard}>🪪 Share ID Card</button>
          {locationText && (<p>{locationText.includes("google.com/maps") ? (<a href={locationText} target="_blank" rel="noreferrer">{ui("Open location in Google Maps")}</a>) : (locationText)}</p>)}
          {locationError && <p className="locationError">{locationError}</p>}
        </div>

        <button className="exitPanicBtn" onClick={() => setPanicMode(false)}>{ui("Exit Panic Mode")}</button>
      </div>

      <div className="floatingSOS">
        {!panicMode && (
          <button className="panicBtn" onClick={() => setPanicMode(true)}>🚨 {ui("Panic")}</button>
        )}

        {panicMode && (
          <>
            <button onClick={() => callNumber(EMERGENCY_NUMBERS.ambulance)}>🚑 108</button>
            <button onClick={() => callNumber(EMERGENCY_NUMBERS.fire)}>🔥 101</button>
            <button onClick={() => callNumber(EMERGENCY_NUMBERS.sos)}>🆘 112</button>
          </>
        )}
      </div>

      {!selectedEmergency && (
        <>
          <div className="hero">
            <div className="languageBox">
              🌐
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((lang, index) => (
                  <option key={index} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button className="themeToggle" onClick={toggleTheme}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <div className="heroBadge">⚡ AI + Offline Emergency Guidance</div>
            <h1>{ui("SnapLearn")}</h1>
            <p>{ui("Instant emergency guidance for India when every second matters.")}</p>

            <div className="heroQuickActions"><button onClick={() => setBotOpen(true)}>🤖 Ask SnapBot</button><button onClick={() => setPanicMode(true)}>🚨 Panic Mode</button><button onClick={() => setSettingsOpen(true)}>⚙️ Emergency ID</button></div>

            <div className="searchBox">
              <input
                type="text"
                placeholder={ui("Search CPR, hand injury, snake bite, flood...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="statsBox">
            <div className="statItem"><h3>{totalEmergencyTypes}+</h3><p>{ui("Emergency Types")}</p></div>
            <div className="statItem"><h3>{totalProblems}+</h3><p>{ui("Problem Cases")}</p></div>
            <div className="statItem"><h3>{totalSteps}+</h3><p>{ui("Action Steps")}</p></div>
          </div>

          <div className="cards">
            {filteredEmergencies.map((emergency, index) => {
              const matchedProblems = getMatchedProblems(emergency);
              return (
                <div className="card" key={index} onClick={() => setSelectedEmergency(emergency)}>
                  <div className="icon">{emergency.icon}</div>
                  <h2>{dataText(emergency.name)}</h2>
                  <p>{ui("Tap to view problems")}</p>

                  {searchKeyword !== "" && matchedProblems.length > 0 && (
                    <div className="matchBox">
                      <strong>{ui("Matched")}:</strong>
                      {matchedProblems.map((problem, problemIndex) => (
                        <span key={problemIndex}>{dataText(problem.title)}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredEmergencies.length === 0 && <p className="note">{ui("No emergency found. Try another keyword.")}</p>}
        </>
      )}

      {selectedEmergency && !selectedProblem && (
        <div className="details">
          <button className="back" onClick={goBack}>← {ui("Back")}</button>
          <h1>{selectedEmergency.icon} {dataText(selectedEmergency.name)}</h1>
          <p className="subtitle">{ui("What is the problem?")}</p>

          <div className="cards">
            {selectedEmergency.problems.map((problem, index) => (
              <div className="card" key={index} onClick={() => setSelectedProblem(problem)}>
                <h2>{dataText(problem.title)}</h2>
                <p>{ui("Tap to see visual steps")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedEmergency && selectedProblem && (
        <div className={panicMode ? "details panicDetails" : "details"}>
          <button className="back" onClick={goBack}>← {ui("Back")}</button>
          <h1>{dataText(selectedProblem.title)}</h1>
          <p className="subtitle">{ui("Follow these visual steps immediately")}</p>

          <div className="steps">
            {selectedProblem.steps.map((step, index) => (
              <div className="visualStep" key={index}>
                <div className="cartoon">{step.image}</div>
                <div className="stepText">
                  <span>{ui("Step")} {index + 1}</span>
                  <p>{dataText(step.text)}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="voice" onClick={speakSteps}>🔊 {ui("Start Voice Guidance")}</button>
          <p className="note">{ui("This app gives quick guidance only. Always contact emergency services.")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
