import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Link, useParams } from 'wouter';

import Navbar from '@/components/layout/Navbar';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';
import { canOpenPrototypeChat } from '@/components/traveler/bookingHistoryData';
import { QUICK_ACTIONS, quickActionText, formatChatTime } from '@/components/traveler/chatPrototypeData';

import './booking-chat.css';

export default function BookingChatPage() {
  const { bookingId = '' } = useParams<{ bookingId: string }>();
  const { getBookingById, getChatMessages, appendChatMessage } = useTravelerPrototype();
  const booking = getBookingById(bookingId);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = booking ? getChatMessages(bookingId, booking.bookingDate) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!booking || !canOpenPrototypeChat(booking.status)) {
    return (
      <div className="booking-chat-page">
        <Navbar variant="home" />
        <main className="booking-chat-unavailable">
          <h1>Chat unavailable</h1>
          <p>
            {!booking
              ? 'This booking was not found in the prototype session.'
              : 'Chat is only available for confirmed or completed bookings.'}
          </p>
          <Link href="/bookings" className="btn btn-accent">View All Bookings</Link>
        </main>
      </div>
    );
  }

  function handleSend() {
    const text = inputText.trim();
    if (!text || !booking) return;
    appendChatMessage(bookingId, text, booking.guideName);
    setInputText('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleQuickAction(actionKey: string) {
    const text = quickActionText(actionKey as Parameters<typeof quickActionText>[0]);
    if (!booking) return;
    appendChatMessage(bookingId, text, booking.guideName);
  }

  return (
    <div className="booking-chat-page">
      <header className="chat-header">
        <Link href={`/bookings/${bookingId}`} className="chat-header-back" aria-label="Back to booking">
          <ArrowLeft size={20} />
        </Link>
        <img src={booking.guidePortrait} alt="" className="chat-header-avatar" />
        <div className="chat-header-info">
          <strong>{booking.guideName}</strong>
          <span>{booking.experiencePreference} · {booking.bookingDate}</span>
        </div>
      </header>

      <main className="chat-body">
        <div className="chat-prototype-banner">
          Demo chat — guide replies are automated. Messages reset each session.
        </div>

        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Start a conversation with {booking.guideName} about your upcoming experience.</p>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender === 'traveler' ? 'chat-bubble--traveler' : 'chat-bubble--guide'}`}
            >
              {msg.sender === 'guide' && (
                <img src={booking.guidePortrait} alt="" className="chat-bubble-avatar" />
              )}
              <div className="chat-bubble-content">
                <p>{msg.text}</p>
                <time>{formatChatTime(msg.timestamp)}</time>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <div className="chat-quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.key}
                type="button"
                className="chat-quick-btn"
                onClick={() => handleQuickAction(action.key)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="chat-input-bar">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type a message…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!inputText.trim()}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
