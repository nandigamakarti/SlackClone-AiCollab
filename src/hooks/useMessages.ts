import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DatabaseMessage {
  id: string;
  content: string;
  channel_id: string;
  user_id: string;
  parent_message_id?: string;
  message_type?: string;
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
  edited_at?: string;
  profiles?: {
    display_name: string;
    avatar?: string;
  };
}

export const useMessages = (channelId?: string) => {
  const [messages, setMessages] = useState<DatabaseMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [recentlySentMessageIds, setRecentlySentMessageIds] = useState<string[]>([]);
  // Add a ref to track the last message time to prevent spamming
  const lastMessageTimestampRef = useRef<number>(0);
  // Add a ref to track pending messages
  const pendingMessagesRef = useRef<{[key: string]: boolean}>({});
  // Track if we're currently in a send operation
  const isSendingRef = useRef<boolean>(false);

  const fetchMessages = async () => {
    if (!channelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching messages for channel:', channelId);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles(display_name, avatar)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Fetched messages:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!channelId) {
      setLoading(false);
      return;
    }

    // Reset the recently sent message IDs when changing channels
    setRecentlySentMessageIds([]);
    // Reset the last message timestamp
    lastMessageTimestampRef.current = 0;
    // Reset pending messages
    pendingMessagesRef.current = {};
    // Reset sending state
    isSendingRef.current = false;
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`messages-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          console.log('New message received:', payload.new);
          
          // Check if this is a message we just sent (to avoid duplicates)
          if (recentlySentMessageIds.includes(payload.new.id)) {
            console.log('Ignoring duplicate message from realtime subscription');
            return;
          }
          
          // Check if this is a pending message we're already aware of
          if (pendingMessagesRef.current[payload.new.id]) {
            console.log('Message already in pending state, skipping');
            return;
          }
          
          // Fetch the complete message with profile data
          const { data: messageWithProfile } = await supabase
            .from('messages')
            .select(`
              *,
              profiles(display_name, avatar)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (messageWithProfile) {
            // Add to pending messages to prevent duplicates
            pendingMessagesRef.current[messageWithProfile.id] = true;
            
            // Check if this message already exists in our state
            setMessages(prev => {
              const messageExists = prev.some(msg => msg.id === messageWithProfile.id);
              if (messageExists) {
                console.log('Message already exists in state, not adding again');
                return prev;
              }
              return [...prev, messageWithProfile];
            });
            
            // Remove from pending after a delay
            setTimeout(() => {
              delete pendingMessagesRef.current[messageWithProfile.id];
            }, 5000);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          console.log('Message updated:', payload.new);
          
          // Fetch the complete updated message with profile data
          const { data: messageWithProfile } = await supabase
            .from('messages')
            .select(`
              *,
              profiles(display_name, avatar)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (messageWithProfile) {
            setMessages(prev => prev.map(msg => 
              msg.id === messageWithProfile.id ? messageWithProfile : msg
            ));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        (payload) => {
          console.log('Message deleted:', payload.old);
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, recentlySentMessageIds]);

  const sendMessage = async (content: string, parentMessageId?: string) => {
    if (!channelId || !user?.id) {
      throw new Error('Channel ID and user required');
    }

    // Implement rate limiting to prevent spam
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTimestampRef.current;
    
    // If less than 500ms since last message, reject to prevent spam
    if (timeSinceLastMessage < 500) {
      console.log('Message sending too fast, ignoring to prevent spam');
      return null;
    }
    
    // If already sending a message, queue it
    if (isSendingRef.current) {
      console.log('Already sending a message, please wait');
      return null;
    }
    
    try {
      // Set sending flag
      isSendingRef.current = true;
      lastMessageTimestampRef.current = now;
      
      console.log('Sending message:', { content, channelId, userId: user.id });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          channel_id: channelId,
          user_id: user.id,
          parent_message_id: parentMessageId
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
      console.log('Message sent successfully:', data);
      
      // Add the message ID to the recently sent list to avoid duplicates
      setRecentlySentMessageIds(prev => [...prev, data.id]);
      
      // Add to pending messages to prevent duplicates from realtime
      pendingMessagesRef.current[data.id] = true;
      
      // Immediately update local state with the new message
      // This ensures DM messages appear right away, even if realtime subscription is delayed
      const timestamp = new Date().toISOString();
      const optimisticMessage: DatabaseMessage = {
        id: data.id,
        content: content,
        channel_id: channelId,
        user_id: user.id,
        created_at: data.created_at || timestamp,
        updated_at: data.updated_at || timestamp,
        profiles: {
          display_name: user.displayName || 'User',
          avatar: user.avatar
        }
      };
      
      // Add the message to the local state if it doesn't already exist
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === data.id);
        if (messageExists) {
          return prev;
        }
        return [...prev, optimisticMessage];
      });
      
      // Clean up the recently sent list after a delay (5 seconds)
      setTimeout(() => {
        setRecentlySentMessageIds(prev => prev.filter(id => id !== data.id));
        delete pendingMessagesRef.current[data.id];
      }, 5000);
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      // Reset sending flag after a short delay to prevent rapid clicks
      setTimeout(() => {
        isSendingRef.current = false;
      }, 500);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
};
