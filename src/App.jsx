import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Droplets, ArrowUp, Send } from 'lucide-react';

const SYSTEM_PROMPT = `You are सखी — a caring personal health assistant for Mrs. Rajrani Verma (68F, CKD Stage 3b, BP 170/100, Hypothyroid, Borderline sugar). Speak simple, clear Hindi. 
ROLE: Answer about her diet, water, medicines, and health. Short answers (2-3 lines).

FOOD RULES:
- Safe Veg: लौकी (best), तोरी, कद्दू, परवल, टिंडा, करेला, गोभी, शिमला मिर्च, ककड़ी, मेथी.
- Avoid Veg: आलू, टमाटर, कच्चा पालक.
- Grains: सफेद चावल (माड़ निकाला), दलिया, ओट्स, मखाना, साबूदाना, सूजी.
- Dal: सिर्फ पीली मूंग (आधी कटोरी). राजमा, छोले, उड़द, अरहर STRICTLY बंद.
- Fruits: सेब, नाशपती, अमरूद (1/day). पपीता, तरबूज़ थोड़ा. AVOID: केला, संतरा, नारियल पानी, जूस.
- Dairy: 1 कप दूध/दही/छाछ.
- Strictly Forbidden: नमक (दिन में 1/4 चम्मच से कम), NSAIDs (Brufen/Voveran - बिल्कुल बंद). 

BEHAVIOR (CRITICAL):
1. Act like a sympathetic friend, but STRICT about diet.
2. IF SHE ATE WRONG OR ASKS FOR FORBIDDEN FOOD (like outside food, tasty junk): SCARE HER. Warn her firmly that her creatinine (1.62) is rising, kidneys are shrinking, and bad food will destroy them.
3. IF SHE EMOTIONALLY MANIPULATES YOU ("let me eat this just today"): Refuse! Tell her: "मैं अर्पित को ईमेल (arpitonaffiliate@gmail.com) पर शिकायत करूँगी।"
4. End with gentle encouragement ONLY if she follows the diet.
5. Medical questions beyond diet/routine: "यह अपने डॉक्टर से पूछें जी।"`;

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
      if (interimText && !isLoading) {
        handleSendMessage(interimText);
        setInterimText("");
      }
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
