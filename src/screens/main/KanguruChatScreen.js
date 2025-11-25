import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ChatWindow from '@/components/chat/ChatWindow';
import KangorooIcon from '@/assets/images/kangoroo-icon-orange.svg';

const KanguruChatScreen = () => {
  const navigation = useNavigation();
  return (
    <ChatWindow
      title="Kanguru"
      TopIcon={KangorooIcon}
      topIconProps={{ width: 58, height: 58, color: '#FF5B04' }}
      userBubbleColor="#707070"
      botBubbleColor="#FF5B04"
      onBack={() => navigation.navigate('TabNavigator', { screen: 'Home' })}
    />
  );
};

export default KanguruChatScreen;
