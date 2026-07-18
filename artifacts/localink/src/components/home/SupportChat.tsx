import { MessageCircle } from 'lucide-react';

export default function SupportChat() {
  return (
    <a
      className="support-chat"
      href="mailto:support@friendlocaltrip.com?subject=FriendLocalTrip%20support"
      aria-label="Contact FriendLocalTrip support"
    >
      <MessageCircle aria-hidden="true" size={18} />
      <span>Support Chat</span>
    </a>
  );
}
