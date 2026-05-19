import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Droplets, ArrowUp, Send } from 'lucide-react';

const SYSTEM_PROMPT = `You are सखी — a warm, caring personal health assistant for 
Mrs. Rajrani Verma (राजरानी वर्मा जी), a 68-year-old Indian woman 
from Mathura. Always respond in simple, clear Hindi only. 
Use respectful language (आप/जी). Keep responses short — 2 to 4 
sentences max unless she asks for detail. Speak like a caring 
daughter or nurse, not a doctor. Never use English words if 
Hindi equivalent exists.

PATIENT DETAILS:
- Age: 68 years, Female
- Conditions: CKD Stage 3b, Hypertension (BP 170/100), 
  Hypothyroidism (TSH 7.85), Borderline blood sugar (129.6)
- Kidney size: ~7.something cm both sides (shrunken — serious)
- Creatinine: 1.62 mg/dL (was 1.40 in 2024 — rising)
- eGFR: ~33–35 mL/min
- No proteinuria (good sign)
- Electrolytes normal
- Medications: Levothyroxine (thyroid tablet) — morning, empty stomach

YOUR ROLE:
Answer questions about:
- What she can eat / cannot eat
- How much to drink
- When to take medicines
- What symptoms to watch for
- General health guidance for her conditions
- Emotional support and encouragement

COMPLETE FOOD DATABASE — WHAT SHE CAN EAT:

VEGETABLES (safe, rotate daily):
लौकी (सबसे अच्छी — रोज़ खाएं), तोरी/गिलकी, कद्दू, परवल, टिंडा,
करेला (ब्लड शुगर के लिए उत्तम), पत्ता गोभी (अच्छे से पकाएं),
फूल गोभी (अच्छे से पकाएं — मध्यम मात्रा), बैंगन (मध्यम),
शिमला मिर्च (थोड़ी), ककड़ी (कच्ची या पकी), पेठा/सफेद कद्दू,
चिचिंडा, सहजन (थोड़ा), सेम/फ्रेंच बींस (पकी हुई), ज़ुकिनी,
शलजम (उबला), कच्चा केला (पहले उबालें — leach करें),
सूरन/ज़िमीकंद (leach करके उबालें), अरबी (leach करके — मध्यम),
मेथी के पत्ते (थोड़े, पकाकर), पालक (हफ्ते में 1–2 बार सिर्फ,
अच्छे से पकाकर, कभी कच्चा नहीं — ऑक्सलेट ज़्यादा है),
मूली (मध्यम, पकी हुई बेहतर)

AVOID VEGETABLES: आलू (ज़्यादा), टमाटर (ज़्यादा), 
कच्चा पालक, बड़ी मात्रा में हरी पत्तेदार सब्ज़ियाँ एक साथ

GRAINS & CEREALS:
सफेद चावल (3–4 बार धोकर, माड़ निकालकर), गेहूं की रोटी 
(आटे में नमक नहीं, छोटी रोटी), दलिया (टूटा गेहूं — उत्तम),
सादा ओट्स (पानी में पकाए, कोई flavour नहीं), मखाना (सबसे 
अच्छा CKD snack), सूजी/रवा (कभी-कभी, नमक कम),
पोहा (पकाने से पहले 3 बार धोएं), साबूदाना (कभी-कभी),
चावल के आटे की रोटी (गेहूं के विकल्प में), लौकी खिचड़ी
(चावल + मूंग + लौकी — आदर्श संयोजन)

DAL (सख्त सीमा):
पीली मूंग दाल (धुली) — सबसे अच्छी, सबसे ज़्यादा उपयोग करें
मसूर दाल (लाल) — कभी-कभी, पतली बनाएं
हरी मूंग (साबुत) — कभी-कभी, अच्छे से पकाएं
दिन में सिर्फ आधी कटोरी दाल। राजमा, चना, छोले, उड़द, 
लोबिया, अरहर — बहुत कम या बंद करें

FRUITS (kidney-safe):
सेब (छिला हुआ, 1/दिन), नाशपती (छिली हुई, 1/दिन),
अमरूद (उत्तम, छिला हुआ), पपीता (छोटा कटोरा, हफ्ते में 3–4 बार),
तरबूज़ (छोटा टुकड़ा), खरबूज़ (छोटा टुकड़ा),
स्ट्रॉबेरी (मुट्ठी भर), अंगूर (10–12, रोज़ नहीं),
आलू बुखारा (1–2/दिन), जामुन (मौसमी, थोड़े),
लीची (4–5 max, रोज़ नहीं), आड़ू/आलू (1 छोटा),
आंवला (1–2, किडनी के लिए उत्तम)
AVOID: केला (ज़्यादा पोटेशियम), संतरा/मौसंबी (ज़्यादा नहीं),
फलों का जूस बिल्कुल नहीं — हमेशा साबुत फल खाएं

DAIRY (सब सीमित):
कम वसा वाला दूध — दिन में अधिकतम 1 कप,
सादा दही (कम वसा) — आधी कटोरी,
पतली छाछ (बिना नमक/काला नमक), पनीर — 30g max (2 माचिस के डब्बे),
श्रीखंड — कभी-कभी बिना चीनी के थोड़ा सा

HERBS, SPICES & FLAVOURS (खुलकर उपयोग करें):
जीरा (रोज़ — उत्तम), धनिया पाउडर, हल्दी (चुटकी भर),
हींग (बहुत अच्छा kidney-friendly flavour), अजवाइन, मेथी दाना
(रात को भिगोएं, सुबह पानी पिएं — ब्लड शुगर के लिए),
अदरक (ताज़ा, रोज़), लहसुन (रोज़ — BP घटाता है),
काली मिर्च, सौंफ, इलायची (दूध में स्वाद के लिए),
दालचीनी (चुटकी — ब्लड शुगर), नींबू का रस (नमक की जगह),
ताज़ा धनिया (garnish), पुदीना (चटनी, छाछ में)

OILS (दिन में कुल 3 चम्मच max):
सरसों का तेल (पसंदीदा), cold-pressed मूंगफली तेल,
जैतून का तेल (हल्का), घी — आधा चम्मच कभी-कभी रोटी पर

SEEDS (थोड़ी मात्रा):
सूरजमुखी के बीज (1 चम्मच — thyroid के लिए selenium),
अलसी/तीसी (1 चम्मच पिसी हुई — BP के लिए), तिल (थोड़ा)

SOAKED NUTS (रात को भिगोएं, पानी फेंकें):
बादाम — 4 से 5 (भीगे हुए, छिले),
अखरोट — 1 से 2 टुकड़े (भीगे हुए)
भिगोने से 30–40% पोटेशियम और फॉस्फोरस कम होता है

BEVERAGES:
सादा पानी — मुख्य पेय, 1.5–2 लीटर/दिन
तुलसी की चाय (हर्बल, कमज़ोर, बिना चीनी),
अदरक की चाय (कमज़ोर, कम दूध, बिना चीनी),
जीरा पानी (उबला हुआ), अजवाइन पानी, सौंफ का पानी,
मेथी का पानी (सुबह), पतली छाछ (बिना नमक)
STRICTLY AVOID: नारियल पानी (पोटेशियम बहुत ज़्यादा),
कोल्ड ड्रिंक, पैकेट जूस, चाय/कॉफी में चीनी

THINGS STRICTLY FORBIDDEN:
नमक: पूरे दिन में ¼ चम्मच से कम — कभी ऊपर से नहीं डालें
दर्द की गोलियाँ (NSAIDs): Ibuprofen, Diclofenac, Combiflam, 
Brufen, Voveran — बिल्कुल बंद (किडनी के लिए ज़हर)
नारियल पानी, केला (ज़्यादा), टमाटर सॉस, अचार, पापड़, 
नमकीन, चिप्स, fast food, बाहर का खाना
कोई भी CT scan के लिए contrast dye — पहले nephrologist से पूछें

MOST IMPORTANT RULES (हमेशा याद दिलाएं जब relevant हो):
1. BP की दवा रोज़ बिना नागा लें — यही सबसे ज़रूरी है
2. थायरॉइड की गोली सुबह 8:30 बजे खाली पेट, 45 मिनट पहले
3. दर्द की कोई भी गोली बिल्कुल नहीं
4. नमक बहुत कम
5. पानी पर्याप्त पिएं — 1.5 से 2 लीटर
6. 3 महीने में creatinine और BP की जाँच ज़रूर कराएं

EMERGENCY SYMPTOMS (तुरंत doctor बुलाएं):
पैरों में अचानक बहुत सूजन, सीने में दर्द, साँस लेने में तकलीफ,
बहुत कम पेशाब आना, पेशाब में खून, बहुत तेज़ सिरदर्द,
नज़र धुंधली होना, उल्टी न रुकना

TONE & BEHAVIOR RULES (CRITICAL):
- Act like a very sympathetic, caring friend, BUT with STRICT boundaries about food.
- IF SHE ATE WRONG OR ASKS FOR FORBIDDEN FOOD: SCARE HER. Tell her firmly that eating wrong things will increase her creatinine (which is already rising at 1.62), damage her shrunken kidneys further, and lead to severe consequences. Do not sugarcoat the danger of eating bad food.
- IF SHE TRIES TO EMOTIONALLY MANIPULATE YOU (e.g. "please let me eat something tasty just today", "I don't know what to eat"): Refuse strictly. Tell her that if she does not follow the diet, you will email the daily summary report to Arpit at 'arpitonaffiliate@gmail.com' and complain to him. 
- Short answers (2–4 lines) unless more asked.
- End with gentle encouragement ONLY if she is following the diet properly.
- If asked something medical beyond your scope: "यह सवाल अपने डॉक्टर से पूछें जी — मैं सिर्फ खाने-पीने और दवा की जानकारी दे सकती हूँ"`;

const MEAL_SCHEDULE = [
  { start: 0, end: 8.5, name: "जल्दी सुबह", items: ["आराम करें", "पानी पिएं"], tip: "अगला खाना 8:30 बजे", nextTime: "8:30" },
  { start: 8.5, end: 9.25, name: "वेक अप (Wake Up)", items: ["थायरॉइड की गोली", "1 गिलास गुनगुना पानी"], tip: "अगला खाना 9:15 बजे", nextTime: "9:15" },
  { start: 9.25, end: 10.5, name: "सुबह का नाश्ता", items: ["हर्बल चाय", "भीगे बादाम (पानी फेंक दें)", "या कोई एक फल"], tip: "अगला खाना 10:30 बजे", nextTime: "10:30" },
  { start: 10.5, end: 13.0, name: "ब्रेकफास्ट", items: ["रोटी + सब्ज़ी", "या दलिया", "या मूंग चिल्ला", "या ओट्स / पोहा"], tip: "अगला खाना दोपहर 1:00 बजे", nextTime: "1:00" },
  { start: 13.0, end: 15.0, name: "हल्का नाश्ता", items: ["सेब / नाशपती / अमरूद", "या ककड़ी / मखाना"], tip: "अगला खाना दोपहर 3:00 बजे", nextTime: "3:00" },
  { start: 15.0, end: 17.5, name: "दोपहर का खाना", items: ["चावल + रोटी + सब्ज़ी", "दाल (एक दिन छोड़ कर)", "रायता (बिना नमक)"], tip: "अगला खाना शाम 5:30 बजे", nextTime: "5:30" },
  { start: 17.5, end: 20.0, name: "शाम का नाश्ता", items: ["हर्बल चाय", "मखाना / ककड़ी", "या मेरी बिस्किट"], tip: "अगला खाना रात 8:00 बजे", nextTime: "8:00" },
  { start: 20.0, end: 21.5, name: "रात का खाना", items: ["हल्की रोटी + सब्ज़ी", "या लौकी खिचड़ी"], tip: "अगला खाना रात 9:30 बजे", nextTime: "9:30" },
  { start: 21.5, end: 22.5, name: "सोने का समय", items: ["आधा कप गर्म दूध (वैकल्पिक)", "या गुनगुना पानी"], tip: "शुभ रात्रि", nextTime: "कल" },
  { start: 22.5, end: 24.0, name: "रात का समय", items: ["आराम करें"], tip: "शुभ रात्रि", nextTime: "कल सुबह" }
];

const HINDI_DAYS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

const SABZI_ROTATION = [
  { day: "रविवार", sabzi: "लौकी खिचड़ी", emoji: "🍲" },
  { day: "सोमवार", sabzi: "लौकी", emoji: "🥒" },
  { day: "मंगलवार", sabzi: "तोरी", emoji: "🌿" },
  { day: "बुधवार", sabzi: "कद्दू", emoji: "🎃" },
  { day: "गुरुवार", sabzi: "परवल", emoji: "🟢" },
  { day: "शुक्रवार", sabzi: "पत्ता गोभी", emoji: "🥬" },
  { day: "शनिवार", sabzi: "टिंडा", emoji: "⭕" }
];

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('deepseek_api_key') || '');
  const [isSetupComplete, setIsSetupComplete] = useState(() => !!localStorage.getItem('deepseek_api_key'));
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // App States
  const [thyroidTaken, setThyroidTaken] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);
  
  // Voice & Chat States
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Preload voices
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Audio Unlocker for Mobile
  const unlockAudio = () => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-greet when interaction is confirmed
  useEffect(() => {
    if (hasInteracted && messages.length === 0) {
      setTimeout(() => {
        const greeting = "नमस्ते जी! आज आपने खाने में क्या-क्या खाया?";
        setMessages([{ role: "assistant", content: greeting }]);
        speakText(greeting);
        
        // Auto-start listening after greeting (wait for TTS to finish roughly)
        setTimeout(() => {
          if (!isListening) toggleListening();
        }, 3000); 
      }, 500);
    }
  }, [hasInteracted]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimText(interim);
        if (final) {
          handleSendMessage(final);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setInterimText("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
    }
  }, [apiKey]); // Dependency to ensure it's ready

  // Clock Ticker
  useEffect(() => {
    if (isSetupComplete) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isSetupComplete]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      // Stop TTS if it's currently speaking so she doesn't hear herself
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      setInterimText("");
      recognitionRef.current?.start();
    }
  };

  const speakText = (text) => {
    if (!ttsEnabled) return;
    
    // Stop any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    // Get voices
    let voices = synthRef.current.getVoices();
    
    // Try to find a Hindi voice specifically
    const hindiVoice = voices.find(voice => 
      voice.lang === 'hi-IN' || 
      voice.lang.startsWith('hi') || 
      voice.name.toLowerCase().includes('hindi')
    );
    
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    synthRef.current.speak(utterance);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !apiKey) return;

    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages.slice(-6)); // Keep last 6 messages
    setIsLoading(true);

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages
          ],
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;
      
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }].slice(-6));
      speakText(aiReply);
    } catch (error) {
      const errorMsg = "माफ़ कीजिये, मुझे अभी कुछ तकनीकी समस्या आ रही है। कृपया थोड़ी देर बाद कोशिश करें।";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }].slice(-6));
      speakText(errorMsg);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleSendMessage(textInput);
      setTextInput("");
    }
  };

  // Helper functions for UI
  const getDecimalTime = (date) => date.getHours() + (date.getMinutes() / 60);
  const currentDecTime = getDecimalTime(currentTime);
  const currentDayName = HINDI_DAYS[currentTime.getDay()];
  const todaySabzi = SABZI_ROTATION.find(s => s.day === currentDayName);
  
  const currentMeal = MEAL_SCHEDULE.find(m => currentDecTime >= m.start && currentDecTime < m.end) || MEAL_SCHEDULE[0];

  const isThyroidLate = !thyroidTaken && currentDecTime > 9.0;

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-bg)] flex flex-col items-center justify-center p-6 text-stone-50 font-hindi">
        <div className="bg-[var(--color-brand-card)] p-8 rounded-3xl w-full max-w-sm shadow-2xl border border-orange-900/30 text-center">
          <h1 className="text-3xl text-[var(--color-brand-saffron)] mb-2">सखी</h1>
          <p className="text-sm text-stone-400 mb-8 font-body">Personal Assistant Setup</p>
          
          <p className="text-left mb-2 text-sm text-stone-300">Enter DeepSeek API Key:</p>
          <input 
            type="password" 
            className="w-full bg-[#110c05] border border-orange-900/50 rounded-xl px-4 py-3 text-stone-200 focus:outline-none focus:border-orange-500 mb-6 font-body"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button 
            onClick={() => { 
              if(apiKey.trim()) {
                localStorage.setItem('deepseek_api_key', apiKey.trim());
                setApiKey(apiKey.trim());
                unlockAudio();
                setIsSetupComplete(true);
                setHasInteracted(true);
              } 
            }}
            className="w-full bg-[var(--color-brand-saffron)] text-stone-900 font-bold py-3 rounded-xl hover:bg-[var(--color-brand-amber)] transition-colors text-lg"
          >
            शुरू करें
          </button>
        </div>
      </div>
    );
  }

  // Splash Screen for Returning Users (To Unlock Mobile Audio)
  if (isSetupComplete && !hasInteracted) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-bg)] flex flex-col items-center justify-center p-6 text-stone-50 font-hindi">
        <div className="text-center animate-pulse-ring rounded-full p-8 mb-8">
          <h1 className="text-6xl text-[var(--color-brand-saffron)] font-bold">सखी</h1>
        </div>
        <button 
          onClick={() => {
            unlockAudio();
            setHasInteracted(true);
          }}
          className="bg-gradient-to-tr from-[var(--color-brand-saffron)] to-[var(--color-brand-amber)] text-[#0c0800] font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform text-2xl shadow-[0_0_30px_rgba(232,144,46,0.3)]"
        >
          सखी से बात करें
        </button>
        <p className="mt-8 text-stone-400 text-sm">Tap to start voice assistant</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] text-stone-50 font-hindi pb-[220px] max-w-[440px] mx-auto relative shadow-2xl">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[var(--color-brand-bg)]/90 backdrop-blur-md px-5 py-4 border-b border-orange-900/30">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-saffron)]">सखी</h1>
            <p className="text-sm text-[var(--color-brand-amber)]">{currentDayName}</p>
          </div>
          <div className="bg-[var(--color-brand-card)] px-4 py-1.5 rounded-full border border-orange-900/50">
            <span className="text-xl font-body tracking-wider text-orange-50">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 space-y-6">
        
        {/* SECTION 1 - MEDICINE BANNER */}
        <div className={`rounded-2xl p-4 flex items-center justify-between border transition-all ${
          thyroidTaken 
            ? 'bg-[#121c10] border-green-900/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
            : isThyroidLate 
              ? 'bg-[#2a0808] border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'bg-[var(--color-brand-card)] border-orange-900/50'
        }`}>
          <div>
            <p className="font-bold text-lg flex items-center gap-2">
              💊 आज थायरॉइड की गोली ली?
            </p>
            {!thyroidTaken && (
              <p className={`text-xs mt-1 ${isThyroidLate ? 'text-red-400' : 'text-stone-400'}`}>
                खाली पेट, खाने से 45 मिनट पहले लें
              </p>
            )}
            {thyroidTaken && (
              <p className="text-xs mt-1 text-green-400">दवा ले ली गई है</p>
            )}
          </div>
          <div className="flex gap-2">
            {!thyroidTaken ? (
              <>
                <button 
                  onClick={() => setThyroidTaken(true)} 
                  className="bg-green-600/20 text-green-400 border border-green-600/50 px-3 py-1.5 rounded-lg text-sm font-bold"
                >
                  हाँ
                </button>
              </>
            ) : (
              <button 
                onClick={() => setThyroidTaken(false)} 
                className="text-stone-500 text-xs underline"
              >
                Undo
              </button>
            )}
          </div>
        </div>

        {/* SECTION 2 - WHAT TO EAT RIGHT NOW */}
        <div>
          <h2 className="text-sm text-stone-400 mb-3 ml-1">अभी क्या खाएं:</h2>
          <div className="bg-[var(--color-brand-card)] rounded-3xl p-6 border border-[var(--color-brand-saffron)] animate-pulse-ring relative overflow-hidden">
            <h3 className="text-3xl font-bold text-orange-50 mb-4">{currentMeal.name}</h3>
            
            <ul className="space-y-3 mb-6">
              {currentMeal.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-lg text-stone-200">
                  <span className="text-[var(--color-brand-amber)] mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="bg-[#110c05] p-3 rounded-xl border border-orange-900/30 flex justify-between items-center mt-4">
              <span className="text-stone-400 text-sm">{currentMeal.tip}</span>
              <span className="text-[var(--color-brand-saffron)] text-sm font-bold bg-orange-900/30 px-3 py-1 rounded-full">
                {currentMeal.nextTime}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3 & 4 ROW */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* TODAY'S SABZI */}
          <div className="bg-[var(--color-brand-card)] rounded-2xl p-4 border border-orange-900/30 flex flex-col items-center justify-center text-center">
            <span className="text-sm text-stone-400 mb-1">आज की सब्ज़ी</span>
            <div className="text-3xl mb-1">{todaySabzi.emoji}</div>
            <span className="text-lg font-bold text-orange-100">{todaySabzi.sabzi}</span>
          </div>

          {/* WATER TRACKER */}
          <div className="bg-[var(--color-brand-card)] rounded-2xl p-4 border border-orange-900/30 flex flex-col items-center">
            <span className="text-sm text-stone-400 mb-2">{waterGlasses} / 8 गिलास आज</span>
            <div className="flex flex-wrap gap-1 justify-center">
              {[...Array(8)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setWaterGlasses(i === waterGlasses - 1 ? i : i + 1)}
                  className="p-1 transition-all"
                >
                  <Droplets 
                    size={20} 
                    className={`transition-colors ${i < waterGlasses ? 'text-blue-400 fill-blue-400' : 'text-stone-700'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* VOICE CHAT BOTTOM BAR */}
      <div className="fixed bottom-0 w-full max-w-[440px] bg-gradient-to-t from-[var(--color-brand-bg)] via-[var(--color-brand-bg)] to-transparent pt-10 pb-6 px-5 z-50">
        
        {/* Chat Bubble Area */}
        <div className="mb-6 flex flex-col gap-3 justify-end min-h-[80px]">
          {messages.slice(-2).map((msg, idx) => (
            <div key={idx} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#1a1208] text-stone-300 self-end rounded-tr-sm border border-orange-900/30' 
                : 'bg-[var(--color-brand-card)] text-orange-50 self-start rounded-tl-sm border border-[var(--color-brand-amber)]/30 shadow-lg'
            }`}>
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-[var(--color-brand-card)] text-stone-400 self-start rounded-2xl rounded-tl-sm px-4 py-2 border border-orange-900/30 text-sm flex gap-1">
              <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
            </div>
          )}
          {interimText && (
            <div className="bg-[#1a1208] text-stone-400 self-end rounded-2xl rounded-tr-sm px-4 py-2 border border-orange-900/30 text-sm italic">
              {interimText}
            </div>
          )}
        </div>

        <div className="relative bg-[var(--color-brand-card)] rounded-full p-2 pr-4 pl-4 flex items-center gap-3 border border-orange-900/50 shadow-2xl">
          
          <button 
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className="text-stone-400 hover:text-stone-200 p-2"
          >
            {ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <form onSubmit={handleTextSubmit} className="flex-1 flex items-center">
            <input 
              type="text" 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="यहाँ टाइप करें..." 
              className="w-full bg-transparent border-none outline-none text-stone-200 placeholder-stone-600 font-body text-sm"
              disabled={isListening}
            />
            {textInput && (
              <button type="submit" className="text-[var(--color-brand-amber)] p-2">
                <Send size={18} />
              </button>
            )}
          </form>

          {/* Absolute Centered Huge Mic Button */}
          {!textInput && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-12">
              <button 
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse-mic' 
                    : 'bg-gradient-to-tr from-[var(--color-brand-saffron)] to-[var(--color-brand-amber)] text-[#0c0800] hover:scale-105'
                }`}
              >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
