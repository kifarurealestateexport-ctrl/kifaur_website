'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, ChevronDown } from 'lucide-react'

// WhatsApp number — update if needed
const WA_NUMBER = '255714940231'

// ─── Chatbot conversation flow ───────────────────────────────────────────────
type Option = { label: string; next: string; waMsg?: string }
type Step   = { message: string; options?: Option[]; end?: boolean }

const FLOW: Record<string, Step> = {
  start: {
    message: "Karibu! 👋 Welcome to **Kifaru Real Estate & Building**.\n\nHow can we help you today?",
    options: [
      { label: '🏠 Buy or Build a House',    next: 'buy'      },
      { label: '🧱 Paving Blocks',            next: 'paving'   },
      { label: '🏗️ Commercial Construction', next: 'commercial'},
      { label: '🏢 Properties for Rent',      next: 'rent'     },
      { label: '📋 Floor Plans & Packages',   next: 'floorplan'},
      { label: '📞 Talk to an Agent',         next: 'agent'    },
    ],
  },
  buy: {
    message: "Great! We build quality homes with our **Pay After Handover** model.\n\nWhat type of home are you looking for?",
    options: [
      { label: '2-Bedroom Bungalow (~TZS 45M)',   next: 'quote', waMsg: "I'm interested in a 2-bedroom bungalow. Please contact me." },
      { label: '3-Bedroom House (~TZS 75M)',       next: 'quote', waMsg: "I'm interested in a 3-bedroom house. Please contact me." },
      { label: '4-Bedroom Villa (~TZS 130M)',      next: 'quote', waMsg: "I'm interested in a 4-bedroom villa. Please contact me." },
      { label: 'Custom Design',                    next: 'quote', waMsg: "I need a custom house design. Please contact me." },
      { label: '⬅ Back',                           next: 'start' },
    ],
  },
  paving: {
    message: "We manufacture premium paving blocks in multiple shapes and colours:\n\n• **Rectangular** — Grey, Black\n• **Square/Flat** — Red, Terracotta\n• **Hexagonal** — Dark Grey, Black\n\nMinimum order: 100 sq. metres. Nationwide delivery available.",
    options: [
      { label: 'Request Paving Quote', next: 'quote', waMsg: "Hello, I'd like a quote for paving blocks. Please contact me with details." },
      { label: 'Ask about delivery',   next: 'quote', waMsg: "I have questions about paving block delivery to my location." },
      { label: '⬅ Back',               next: 'start' },
    ],
  },
  commercial: {
    message: "We are CRB **Class 5 registered** for commercial construction.\n\nWe build:\n• Office blocks\n• Hotels & lodges\n• Schools & classrooms\n• Warehouses\n• Healthcare facilities",
    options: [
      { label: 'Get a Project Quote', next: 'quote', waMsg: "I need a quote for a commercial building project. Please contact me." },
      { label: '⬅ Back',              next: 'start' },
    ],
  },
  rent: {
    message: "We have properties available for rent across Dar es Salaam, Arusha and Dodoma.\n\nWould you like to speak with an agent about available rentals?",
    options: [
      { label: 'Yes, contact an agent', next: 'quote', waMsg: "I'm looking for a property to rent. Please contact me." },
      { label: 'View properties online', next: 'viewprops' },
      { label: '⬅ Back',                next: 'start' },
    ],
  },
  viewprops: {
    message: "You can browse all our available properties on our website. Click the button below to view listings.",
    options: [
      { label: '⬅ Back', next: 'start' },
    ],
    end: true,
  },
  floorplan: {
    message: "We have ready-made floor plans starting from **TZS 28M**.\n\nAll plans include:\n✓ Architectural design\n✓ Full construction\n✓ Pay after handover\n✓ Flexible installments",
    options: [
      { label: 'Get a Package Quote', next: 'quote', waMsg: "I'm interested in a floor plan package. Please share details and pricing." },
      { label: 'Custom floor plan',   next: 'quote', waMsg: "I need a custom floor plan design. Please contact me." },
      { label: '⬅ Back',             next: 'start' },
    ],
  },
  agent: {
    message: "Our agents are available:\n\n📅 **Mon–Fri:** 8:00 AM – 6:00 PM\n📅 **Sat:** 9:00 AM – 4:00 PM\n\n📞 +255 714 940 231\n📞 +255 713 860 510\n\nOr send us a WhatsApp message and we'll get back to you shortly.",
    options: [
      { label: '💬 Send WhatsApp Now', next: 'quote', waMsg: "Hello, I'd like to speak with an agent. Please contact me." },
      { label: '⬅ Back',              next: 'start' },
    ],
  },
  quote: {
    message: "Perfect! Tap the button below to send us a WhatsApp message and our team will contact you within a few hours. 😊",
    options: [],
    end: true,
  },
}

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export default function WhatsAppWidget() {
  const [open,      setOpen]      = useState(false)
  const [step,      setStep]      = useState('start')
  const [history,   setHistory]   = useState<{ sender: 'bot'|'user'; text: string }[]>([])
  const [waMsg,     setWaMsg]     = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Initialise with first bot message
  useEffect(() => {
    setHistory([{ sender: 'bot', text: FLOW.start.message }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const choose = (option: Option) => {
    // Add user choice to history
    setHistory(h => [...h, { sender: 'user', text: option.label }])
    // Set waMsg if provided
    if (option.waMsg) setWaMsg(option.waMsg)
    // Move to next step
    const nextStep = FLOW[option.next]
    if (nextStep) {
      setTimeout(() => {
        setStep(option.next)
        setHistory(h => [...h, { sender: 'bot', text: nextStep.message }])
      }, 400)
    }
  }

  const openWhatsApp = (msg?: string) => {
    const text = msg || waMsg || "Hello, I'm interested in Kifaru Building Company services. Please contact me."
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const restart = () => {
    setStep('start')
    setWaMsg('')
    setHistory([{ sender: 'bot', text: FLOW.start.message }])
  }

  const current = FLOW[step]

  return (
    <>
      {/* WhatsApp floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat widget */}
        {open && (
          <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ maxHeight: '520px' }}>
            {/* Header */}
            <div className="bg-[#25D366] px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                  <img src="/uploads/logo.png"
                    alt="Kifaru"
                    className="w-full h-full object-contain p-0.5"
                    onError={e => {
                      const t = e.target as HTMLImageElement
                      t.style.display = 'none'
                      t.nextElementSibling?.removeAttribute('style')
                    }} />
                  <span style={{ display: 'none' }} className="text-[#25D366] font-heading font-bold text-sm">K</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Kifaru Real Estate</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse" />
                    <p className="text-green-100 text-xs">Typically replies quickly</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3" style={{ maxHeight: '320px' }}>
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#25D366] text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                  }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Options */}
            <div className="p-3 bg-white border-t border-gray-100 space-y-1.5">
              {current?.end ? (
                <div className="space-y-2">
                  <button onClick={() => openWhatsApp()}
                    className="w-full bg-[#25D366] hover:bg-[#20b558] text-white text-xs font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Open WhatsApp
                  </button>
                  {step !== 'viewprops' && (
                    <a href="/properties" className="block w-full text-center text-brand-navy text-xs py-2 hover:underline">
                      Browse Properties →
                    </a>
                  )}
                  <button onClick={restart} className="w-full text-gray-400 text-xs py-1.5 hover:text-gray-600 transition-colors">
                    ↺ Start over
                  </button>
                </div>
              ) : (
                current?.options?.map((opt, i) => (
                  <button key={i} onClick={() => choose(opt)}
                    className="w-full text-left text-xs font-medium text-brand-navy border border-gray-200 hover:border-brand-navy hover:bg-blue-50 px-3.5 py-2.5 rounded-lg transition-all">
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main WhatsApp button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative"
          style={{ backgroundColor: '#25D366' }}
          aria-label="Chat on WhatsApp">

          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#25D366' }} />
          )}

          {open ? (
            <ChevronDown size={24} className="text-white" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}