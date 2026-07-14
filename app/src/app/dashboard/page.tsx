'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarRating from '@/components/ui/StarRating';
import { 
  BOOKINGS, 
  CONVERSATIONS, 
  TRAVELER_NOTIFICATIONS, 
  GUIDES, 
  REVIEWS 
} from '@/data/mockData';
import { 
  Calendar, 
  MessageSquare, 
  Heart, 
  History, 
  Bell, 
  Send, 
  User, 
  ShieldCheck, 
  MapPin, 
  Check, 
  Info,
  Clock
} from 'lucide-react';
import { formatCurrency, categoryLabel } from '@/lib/utils';
import type { Booking, Conversation, Message, Guide } from '@/types';

function TravelerDashboardContent() {
  const searchParams = useSearchParams();
  const chatPreset = searchParams?.get('chat');

  // Tabs state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'messages' | 'saved' | 'past' | 'notifications'>('upcoming');

  // Messages / Chat state
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [localConversations, setLocalConversations] = useState<Conversation[]>(CONVERSATIONS);

  // Saved guides state
  const [savedGuides, setSavedGuides] = useState<Guide[]>(GUIDES.slice(0, 2));

  // Initialize preset chat if specified in URL query
  useEffect(() => {
    if (chatPreset) {
      setActiveTab('messages');
      const found = localConversations.find(c => c.participantIds.includes(chatPreset));
      if (found) {
        setActiveConversation(found);
      } else {
        // Create new simulated conversation
        const targetGuide = GUIDES.find(g => g.id === chatPreset);
        if (targetGuide) {
          const newConv: Conversation = {
            id: `conv-sim-${Date.now()}`,
            participantIds: ['traveler-001', targetGuide.id],
            participantNames: { 'traveler-001': 'Alex Johnson', [targetGuide.id]: targetGuide.displayName },
            participantAvatars: {
              'traveler-001': 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
              [targetGuide.id]: targetGuide.avatar,
            },
            lastMessage: 'Hi! Let me know what you would like to explore.',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            messages: [
              {
                id: `msg-sim-${Date.now()}`,
                senderId: targetGuide.id,
                senderName: targetGuide.displayName,
                senderAvatar: targetGuide.avatar,
                text: `Hello Alex! Thanks for visiting my profile. Do you have any specific plans for Saigon? I can customise an itinerary for you.`,
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: true,
              }
            ]
          };
          setLocalConversations(prev => [newConv, ...prev]);
          setActiveConversation(newConv);
        }
      }
    }
  }, [chatPreset]);

  // Send message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeConversation) return;

    const newMsg: Message = {
      id: `msg-new-${Date.now()}`,
      senderId: 'traveler-001',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
      text: typedMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    const updatedConversations = localConversations.map(conv => {
      if (conv.id === activeConversation.id) {
        const nextMsgs = [...conv.messages, newMsg];
        return {
          ...conv,
          messages: nextMsgs,
          lastMessage: newMsg.text,
          lastMessageTime: newMsg.timestamp,
        };
      }
      return conv;
    });

    setLocalConversations(updatedConversations);
    setActiveConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: newMsg.text,
      lastMessageTime: newMsg.timestamp,
    } : null);

    setTypedMessage('');

    // Simulated guide response
    setTimeout(() => {
      const guideId = activeConversation.participantIds.find(id => id !== 'traveler-001') || '';
      const guideName = activeConversation.participantNames[guideId] || 'Guide';
      const guideAvatar = activeConversation.participantAvatars[guideId] || '';

      const respMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        senderId: guideId,
        senderName: guideName,
        senderAvatar: guideAvatar,
        text: `Thanks for the details! I'm reviewing this now and will send you a suggested itinerary in a few minutes.`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const finalConversations = updatedConversations.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, respMsg],
            lastMessage: respMsg.text,
            lastMessageTime: respMsg.timestamp,
          };
        }
        return conv;
      });

      setLocalConversations(finalConversations);
      if (activeConversation.id === convId) {
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, respMsg],
          lastMessage: respMsg.text,
          lastMessageTime: respMsg.timestamp,
        } : null);
      }
    }, 2000);
  };

  const convId = activeConversation?.id;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <main className="container py-10 flex-1">
        {/* Dashboard Header Banner */}
        <div className="bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E8E4DC] shrink-0 bg-[#F5F0EA] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80"
                alt="Traveler Alex Johnson"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[#1A1A1A]">
                Hello, Alex Johnson
              </h1>
              <p className="text-xs text-[#5A5A5A] flex items-center gap-1.5 mt-0.5">
                <span>United States</span>
                <span>·</span>
                <span>Traveler Profile #9281</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#FAFAF7] border border-[#E8E4DC] py-2.5 px-4 rounded-xl text-center min-w-[100px]">
              <span className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">Upcoming</span>
              <span className="text-lg font-bold text-[#1C3A2E]">1 Trip</span>
            </div>
            <div className="bg-[#FAFAF7] border border-[#E8E4DC] py-2.5 px-4 rounded-xl text-center min-w-[100px]">
              <span className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">Saved Guides</span>
              <span className="text-lg font-bold text-[#1C3A2E]">{savedGuides.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Selector Links */}
        <div className="flex border-b border-[#E8E4DC] gap-6 mb-8 overflow-x-auto whitespace-nowrap pb-1">
          {[
            { id: 'upcoming', label: 'Upcoming Trips', icon: <Calendar size={14} /> },
            { id: 'pending', label: 'Pending Requests', icon: <Clock size={14} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={14} /> },
            { id: 'saved', label: 'Saved Guides', icon: <Heart size={14} /> },
            { id: 'past', label: 'Past Experiences', icon: <History size={14} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 pb-3 font-semibold text-xs transition-colors relative ${
                  isSelected ? 'text-[#1C3A2E]' : 'text-[#8A8A8A] hover:text-[#1C3A2E]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1C3A2E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[400px]">
          
          {/* UPCOMING TRIPS */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {BOOKINGS.filter(b => b.status === 'scheduled').map((booking) => {
                const guide = GUIDES.find(g => g.id === booking.guideId);
                if (!guide) return null;
                return (
                  <div key={booking.id} className="bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4 items-start text-left">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E8E4DC] shrink-0">
                        <img src={guide.avatar} alt={guide.firstName} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="space-y-1">
                        <span className="badge badge-verified text-[9px] py-0.5 px-1 font-bold bg-[#E8F5EE] text-[#1C6B3A] rounded">
                          Confirmed Scheduled Trip
                        </span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#1A1A1A]">
                          Saigon Street Food & Market Walk
                        </h3>
                        <p className="text-xs text-[#5A5A5A]">
                          Guide: <strong className="text-[#1A1A1A]">{guide.firstName} {guide.lastName}</strong>
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#8A8A8A] pt-2">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date} · {booking.startTime}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {booking.duration}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {booking.meetingArea}</span>
                          <span className="flex items-center gap-1"><User size={12} /> {booking.adultsCount} Adults</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#F5F0EA] pt-4 md:pt-0 shrink-0">
                      <div className="text-left md:text-right mb-0 md:mb-3">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Escrow Total</span>
                        <span className="text-lg font-bold text-[#1C3A2E]">{formatCurrency(booking.pricing.total)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setActiveConversation(localConversations[0] || null);
                            setActiveTab('messages');
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          Message Guide
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PENDING REQUESTS */}
          {activeTab === 'pending' && (
            <div className="text-center py-16 bg-white border border-[#E8E4DC] rounded-2xl max-w-md mx-auto">
              <Clock size={36} className="text-[#C4614A] mx-auto mb-4 opacity-75" />
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1A1A1A] mb-1">
                No pending requests
              </h3>
              <p className="text-xs text-[#5A5A5A] max-w-xs mx-auto mb-6">
                All booking requests have been reviewed. Ready to match with another guide?
              </p>
              <Link href="/guides" className="btn btn-accent btn-sm">
                Search local guides
              </Link>
            </div>
          )}

          {/* MESSAGES / CHAT */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 md:grid-cols-12 border border-[#E8E4DC] bg-white rounded-2xl overflow-hidden shadow-sm h-[550px]">
              {/* Chat list (4/12) */}
              <div className="md:col-span-4 border-r border-[#E8E4DC] overflow-y-auto divide-y divide-[#F5F0EA]">
                <div className="p-4 bg-[#FAFAF7] border-b border-[#E8E4DC]">
                  <h3 className="text-xs font-bold text-[#1C3A2E] uppercase tracking-wider">Conversations</h3>
                </div>

                {localConversations.map((conv) => {
                  const guideId = conv.participantIds.find(id => id !== 'traveler-001') || '';
                  const guideName = conv.participantNames[guideId] || 'Guide';
                  const guideAvatar = conv.participantAvatars[guideId] || '';
                  const isSelected = activeConversation?.id === conv.id;
                  
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full text-left p-4 flex gap-3 items-start transition-colors ${
                        isSelected ? 'bg-[#F5F0EA]' : 'hover:bg-[#FAFAF7]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E8E4DC] shrink-0">
                        <img src={guideAvatar} alt={guideName} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-sans text-xs font-bold text-[#1A1A1A]">{guideName}</h4>
                          <span className="text-[9px] text-[#8A8A8A]">Today</span>
                        </div>
                        <p className="text-[11px] text-[#5A5A5A] truncate">{conv.lastMessage}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Chat Thread (8/12) */}
              <div className="md:col-span-8 flex flex-col justify-between h-full bg-[#FAFAF7]">
                {activeConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-[#E8E4DC] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E8E4DC]">
                          <img
                            src={activeConversation.participantAvatars[activeConversation.participantIds.find(id => id !== 'traveler-001') || '']}
                            alt="avatar"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <h4 className="font-sans text-xs font-bold text-[#1A1A1A]">
                            {activeConversation.participantNames[activeConversation.participantIds.find(id => id !== 'traveler-001') || '']}
                          </h4>
                          <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                            ● online response support
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {activeConversation.messages.map((msg) => {
                        const isMe = msg.senderId === 'traveler-001';
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 text-xs`}>
                            {!isMe && (
                              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E8E4DC] shrink-0">
                                <img src={msg.senderAvatar} alt="avatar" className="w-full h-full object-cover object-top" />
                              </div>
                            )}
                            <div className={`max-w-xs p-3 rounded-xl shadow-sm ${
                              isMe 
                                ? 'bg-[#1C3A2E] text-white rounded-br-none' 
                                : 'bg-white border border-[#E8E4DC] text-[#1A1A1A] rounded-bl-none'
                            }`}>
                              <p className="leading-relaxed">{msg.text}</p>
                              <span className={`text-[8px] mt-1 block text-right ${isMe ? 'text-white/70' : 'text-[#8A8A8A]'}`}>
                                Today
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E8E4DC] flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message to custom build your itinerary..."
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        className="input flex-1 min-h-[40px] text-xs"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm px-4 flex items-center justify-center shrink-0"
                        aria-label="Send message"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <MessageSquare size={36} className="text-[#8A8A8A] mb-2 opacity-50" />
                    <span className="text-xs font-semibold text-[#8A8A8A]">Select a conversation to start messaging</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SAVED GUIDES */}
          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedGuides.map((guide) => (
                <div key={guide.id} className="relative">
                  <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-[4/3] w-full overflow-hidden relative">
                      <img src={guide.avatar} alt={guide.firstName} className="w-full h-full object-cover object-top" />
                      <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded text-[9px] font-bold text-[#1C6B3A] border border-[#B8DFC8]">
                        Verified
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#1A1A1A]">{guide.firstName}</h4>
                        <span className="text-xs font-bold text-[#1C3A2E]">${guide.pricing.perHour}/hr</span>
                      </div>
                      <p className="text-[10px] text-[#5A5A5A] line-clamp-1">{guide.shortIntro}</p>
                      <div className="flex gap-2 border-t border-[#F5F0EA] pt-3">
                        <Link href={`/guides/${guide.id}`} className="btn btn-outline btn-sm flex-1 text-[10px]">
                          View Profile
                        </Link>
                        <Link href={`/book/${guide.id}`} className="btn btn-accent btn-sm flex-1 text-[10px]">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAST EXPERIENCES */}
          {activeTab === 'past' && (
            <div className="space-y-6">
              {BOOKINGS.filter(b => b.status === 'completed').map((booking) => {
                const guide = GUIDES.find(g => g.id === booking.guideId);
                if (!guide) return null;
                return (
                  <div key={booking.id} className="bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4 items-start text-left">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E8E4DC] shrink-0">
                        <img src={guide.avatar} alt={guide.firstName} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-neutral text-[9px] py-0.5 px-1.5 font-bold rounded">
                            Completed Trip
                          </span>
                          <span className="text-[9px] font-bold text-[#1C6B3A] bg-[#E8F5EE] px-1.5 rounded">✓ Escrow Reconciled</span>
                        </div>
                        
                        <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#1A1A1A]">
                          Saigon Colonial Heritage & Architecture Walk
                        </h3>
                        <p className="text-xs text-[#5A5A5A]">
                          Guide: <strong className="text-[#1A1A1A]">{guide.firstName} {guide.lastName}</strong>
                        </p>
                        
                        <div className="flex gap-4 text-xs text-[#8A8A8A] pt-1">
                          <span>Completed on: {booking.date}</span>
                          <span>·</span>
                          <span>Rating: 5.0 ★</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#F5F0EA] pt-4 md:pt-0 shrink-0">
                      <div className="text-left md:text-right mb-0 md:mb-3">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Amount Paid</span>
                        <span className="text-base font-bold text-[#1A1A1A]">{formatCurrency(booking.pricing.total)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm text-[10px] cursor-not-allowed" disabled>
                          Review Submitted
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#F5F0EA] text-xs">
              <div className="p-4 bg-[#FAFAF7] flex justify-between items-center border-b border-[#E8E4DC]">
                <span className="font-bold text-[#1C3A2E] uppercase tracking-wider">Alert Center</span>
                <button className="text-[10px] text-[#C4614A] font-bold hover:underline">Mark all as read</button>
              </div>

              {TRAVELER_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="p-4 flex gap-4 items-start hover:bg-[#FAFAF7]">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-[#E8E4DC]' : 'bg-[#C4614A]'}`} />
                  <div className="flex-1 text-left space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A]">{notif.title}</span>
                      <span className="text-[9px] text-[#8A8A8A]">Today</span>
                    </div>
                    <p className="text-[#5A5A5A]">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TravelerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAF7]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C3A2E]" />
      </div>
    }>
      <TravelerDashboardContent />
    </Suspense>
  );
}
