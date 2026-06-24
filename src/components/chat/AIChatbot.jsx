// src/components/chat/AIChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { MessageSquare, X, Send, Bot, User, Calculator } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateQuote } from '../../utils/quoteCalculator';
import { BUSINESS_DETAILS } from '../../utils/constants';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! Welcome to Adithya Event Management. I am your event assistant. How can I help you customize your celebration today? Ask me about: \n\n• Wedding decorations stages\n• Catering menus & plate pricing\n• Local office coordinates in Vuyyuru\n• Instant budget quote estimations',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Local NLP Rules parsing engine
  const parseBotResponse = (userInput) => {
    const text = userInput.toLowerCase();
    
    // Check contact query
    if (text.includes('contact') || text.includes('phone') || text.includes('number') || text.includes('cell') || text.includes('whatsapp')) {
      return `You can contact Adithya Event Management directly at *+91 93932 17676*. You can also reach us on Instagram @adithya_event_management.`;
    }

    // Check location query
    if (text.includes('location') || text.includes('where') || text.includes('address') || text.includes('office')) {
      return `Our main office is located in *Vuyyuru, Krishna District, Andhra Pradesh* (Near Main Road). We support events across Vuyyuru, Vijayawada, and Krishna district.`;
    }

    // Check catering menu query
    if (text.includes('catering') || text.includes('food') || text.includes('plate') || text.includes('menu') || text.includes('lunch') || text.includes('dinner')) {
      return `Our catering platters are fully customisable:\n\n• *Veg Delight (₹350/plate)*: Pappu, Andhra curries, sweets, Vuyyuru special Sambar.\n• *Royal Non-Veg Feast (₹550/plate)*: Gongura Mutton, Chicken Biryani, Nellore Fish Pulusu.\n\nType something like *"Estimate: 200 veg and 100 nonveg"* to see pricing calculations.`;
    }

    // Check wedding decors query
    if (text.includes('decor') || text.includes('stage') || text.includes('wedding') || text.includes('mandapam') || text.includes('backdrop')) {
      return `We have 3 premium wedding packages:\n\n1. *Royal Classic Wedding (₹1,50,000)*: Standard stage, entry arches.\n2. *Vuyyuru Royal Wedding (₹3,00,000)*: Grand floral stage, smoke/couple entry, VIP chairs.\n3. *Imperial Andhra Wedding (₹6,00,000)*: Theme stage, pyro entry, management.\n\nType *"Estimate: Wedding Royal"* to calculate.`;
    }

    // Estimate Quote parsing
    if (text.includes('estimate') || text.includes('cost') || text.includes('quote') || text.includes('price')) {
      // Look for numbers in text for plates
      const numbers = text.match(/\d+/g);
      let vegCount = 0;
      let nonVegCount = 0;
      let packageCost = 150000; // Classic Wedding default
      let packageName = 'Royal Classic Wedding';

      if (numbers) {
        if (numbers.length === 1) {
          vegCount = parseInt(numbers[0]);
        } else if (numbers.length >= 2) {
          vegCount = parseInt(numbers[0]);
          nonVegCount = parseInt(numbers[1]);
        }
      }

      if (text.includes('royal')) {
        packageCost = 300000;
        packageName = 'Vuyyuru Royal Wedding';
      } else if (text.includes('imperial')) {
        packageCost = 600000;
        packageName = 'Imperial Andhra Wedding';
      }

      const cateringTotal = (vegCount * 350) + (nonVegCount * 550);
      const subtotal = packageCost + cateringTotal;
      const tax = subtotal * 0.18;
      const total = subtotal + tax;

      return `Here is a custom estimate quote:\n\n• *Decor:* ${packageName} (${formatCurrency(packageCost)})\n• *Catering Veg (${vegCount} plates):* ${formatCurrency(vegCount * 350)}\n• *Catering Non-Veg (${nonVegCount} plates):* ${formatCurrency(nonVegCount * 550)}\n• *Subtotal:* ${formatCurrency(subtotal)}\n• *GST (18%):* ${formatCurrency(tax)}\n\n*ESTIMATED TOTAL:* ${formatCurrency(total)}\n\nBook your slot on the Booking Page to secure this price!`;
    }

    return `Thank you for writing. I can help you calculate pricing budgets. Type *"Estimate: 200 veg guests and Wedding Royal"* to run cost calculations, or call us at *+91 93932 17676*.`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Save to Firestore logs
    try {
      await addDoc(collection(db, 'chatMessages'), {
        sender: 'user',
        text: userMessage.text,
        timestamp: userMessage.timestamp
      });
    } catch (err) {
      console.warn("Firestore message save error:", err);
    }

    // Bot response delayed trigger
    setTimeout(async () => {
      const replyText = parseBotResponse(userMessage.text);
      const botReply = {
        id: Math.random().toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);

      try {
        await addDoc(collection(db, 'chatMessages'), {
          sender: 'bot',
          text: botReply.text,
          timestamp: botReply.timestamp
        });
      } catch (err) {
        console.warn("Firestore response save error:", err);
      }
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[490]">
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-burgundy border border-gold/30 text-gold flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
          aria-label="Ask assistant"
        >
          <MessageSquare className="w-5 h-5 animate-pulse" />
        </button>
      )}

      {/* Expanded chat drawer panel */}
      {isOpen && (
        <div className="w-[310px] sm:w-[350px] h-[450px] bg-charcoal border border-gold/15 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
          {/* Header */}
          <div className="bg-charcoal border-b border-gold/10 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-gold" />
              <span className="font-display text-sm font-bold text-champagne">Adithya Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-champagne/70 hover:text-gold p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-charcoal/20">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={m.id} className={`flex items-start ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <div className="w-6 h-6 rounded-full border border-gold/20 flex items-center justify-center bg-white/5 mr-2 shrink-0">
                      <Bot className="w-3.5 h-3.5 text-gold" />
                    </div>
                  )}
                  <div className={`p-3 rounded-lg text-xs max-w-[80%] font-body whitespace-pre-line leading-relaxed ${
                    isBot 
                      ? 'bg-white/5 border border-white/5 text-champagne/90' 
                      : 'bg-gold/10 border border-gold/20 text-gold'
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full border border-gold/20 flex items-center justify-center bg-white/5 mr-2 shrink-0">
                  <Bot className="w-3.5 h-3.5 text-gold animate-bounce" />
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-[10px] text-champagne/50">
                  Assistant is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gold/10 flex items-center space-x-2 bg-charcoal/40">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about stages, food, catering estimates..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-champagne focus:outline-none focus:border-gold/30"
            />
            <button type="submit" className="p-2 bg-gold text-charcoal rounded-lg hover:scale-105 transition-transform cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
