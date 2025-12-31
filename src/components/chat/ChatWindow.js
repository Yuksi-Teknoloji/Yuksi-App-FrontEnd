import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import useChatStore from '@/store/chatStore';

import BgImage from '@/assets/images/background-motor-grey.jpg';
import MoreVertIcon from '@/assets/icons/more-vert.svg';
import AttachIcon from '@/assets/icons/attach.svg';
import CameraIcon from '@/assets/icons/camera.svg';
import MicIcon from '@/assets/icons/mic.svg';
import SendIcon from '@/assets/icons/send.svg';

// Typing indicator component
const TypingIndicator = ({botBubbleColor}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View style={[styles.typingBubble, {backgroundColor: botBubbleColor}]}>
      <View style={styles.typingDots}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const ChatWindow = ({
  title = 'Chat',
  TopIcon,
  topIconProps = { width: 48, height: 48 },
  userBubbleColor = '#707070',
  botBubbleColor = '#FF5B04',
  onBack,
}) => {
  const inputText = useChatStore(s => s.inputText);
  const setInputText = useChatStore(s => s.setInputText);
  const messages = useChatStore(s => s.messages);
  const sendMessage = useChatStore(s => s.sendMessage);
  const sendSuggestion = useChatStore(s => s.sendSuggestion);
  const showSuggestions = useChatStore(s => s.showSuggestions);
  const suggestions = useChatStore(s => s.suggestions);
  const isLoading = useChatStore(s => s.isLoading);
  const scrollRef = useRef(null);

  const handleSend = () => {
    sendMessage(inputText);
  };

  const handleSuggestionPress = (text) => {
    sendSuggestion(text);
  };

  return (
    <ImageBackground source={BgImage} style={styles.bg} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <View style={styles.overlay}>
          {/* Top row: back arrow + capsule */}
          <View style={styles.topRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Geri"
              activeOpacity={0.7}
              style={styles.backBtn}
              onPress={onBack}
            >
              <View style={styles.arrow} />
            </TouchableOpacity>

            {/* Top capsule */}
            <View style={styles.topCapsule}>
              <View style={styles.topLeft}>
                {TopIcon ? <TopIcon {...topIconProps} /> : null}
                <View style={{ marginLeft: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.kanguruText}>{title}</Text>
                    <Text style={styles.chatbotText}> chatbot</Text>
                  </View>
                  <Text style={styles.statusText}>Aktif</Text>
                </View>
              </View>
              <View style={styles.topRight}>
                <TouchableOpacity activeOpacity={0.7} style={styles.rightIconBtn}>
                  <MoreVertIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Chat area */}
          <View style={styles.chatArea}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.messageList}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
            >
            {showSuggestions && (
              <View style={styles.suggestionColumn}>
                {suggestions.map(s => (
                  <Pressable
                    key={s}
                    onPress={() => handleSuggestionPress(s)}
                    android_ripple={{ color: '#FF5B0440', borderless: false }}
                    style={({ pressed }) => [
                      styles.suggestionChip,
                      pressed && styles.suggestionChipPressed,
                    ]}
                  >
                    <Text style={styles.suggestionText} numberOfLines={1}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {messages.map(m => {
              const isUser = m.side === 'user';
              const bubbleStyle = [
                isUser ? styles.messageBubbleUser : styles.messageBubbleBot,
                {backgroundColor: isUser ? userBubbleColor : botBubbleColor},
              ];
              return (
                <View key={m.id} style={bubbleStyle}>
                  <Text style={styles.messageText}>{m.text}</Text>
                </View>
              );
            })}
              {isLoading && <TypingIndicator botBubbleColor={botBubbleColor} />}
            </ScrollView>
          </View>

          {/* Bottom composer */}
          <View style={styles.composer}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Soru sor"
              placeholderTextColor="#64748B"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            {inputText.trim().length === 0 ? (
              <>
                <TouchableOpacity activeOpacity={0.7} style={[styles.iconBtn, { marginLeft: 6 }]}>
                  <AttachIcon width={18} height={18} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={[styles.iconBtn, { marginLeft: 6 }]}> 
                  <CameraIcon width={18} height={18} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.iconBtn, { marginLeft: 6 }]}
                onPress={handleSend}
              >
                <SendIcon width={18} height={18} />
              </TouchableOpacity>
            )}
          </View>
            <TouchableOpacity activeOpacity={0.8} style={styles.micBtn}>
              <MicIcon width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  keyboardAvoid: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center', marginRight: 2 },
  arrow: { width: 12, height: 12, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#FF5B04', opacity: 1, transform: [{ rotate: '45deg' }] },
  topCapsule: {
    width: 362,
    height: 64,
    alignSelf: 'center',
    borderRadius: 39,
    opacity: 1,
    backgroundColor: '#C4C4C4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    transform: [{ rotate: '0deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    elevation: 10,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rightIconBtn: { padding: 6, borderRadius: 16 },
  kanguruText: { fontFamily: 'Urbanist', fontWeight: '700', fontSize: 20, color: '#FF5B04' },
  chatbotText: { fontFamily: 'Urbanist', fontWeight: '700', fontSize: 16, color: '#0F172A' },
  statusText: { marginTop: 2, fontFamily: 'Urbanist', fontWeight: '600', fontSize: 12, color: '#FF5B04' },
  chatArea: { flex: 1 },
  messageList: { flexGrow: 1, justifyContent: 'flex-end', gap: 10, paddingVertical: 8, paddingTop: 8 },
  suggestionColumn: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    marginLeft: 8,
    marginBottom: 8,
  },
  suggestionChip: {
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 39,
    backgroundColor: 'rgba(205,205,205,0.54)', // #CDCDCD8A
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    // Shadow approximation
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 6,
  },
  suggestionChipPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: 'rgba(205,205,205,0.7)',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  suggestionText: {
    // Dimensions are not strictly necessary for text; we follow typography specs
    color: '#FF5B04', // interpreting requested background as brand color for text
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16, // 100%
    letterSpacing: 0,
  },
  messageBubbleUser: {
    alignSelf: 'flex-end',
    width: 296,
    minHeight: 56,
    opacity: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 32,
    paddingTop: 16,
    paddingRight: 24,
    paddingBottom: 16,
    paddingLeft: 24,
  },
  messageBubbleBot: {
    alignSelf: 'flex-start',
    width: 296,
    minHeight: 56,
    opacity: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 4,
    paddingTop: 16,
    paddingRight: 24,
    paddingBottom: 16,
    paddingLeft: 24,
  },
  messageText: {color: '#FFFFFF', fontFamily: 'Urbanist', fontSize: 14, lineHeight: 18},
  typingBubble: {
    alignSelf: 'flex-start',
    minWidth: 80,
    height: 56,
    opacity: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  composer: {marginTop: 12, flexDirection: 'row', alignItems: 'center'},
  inputWrap: {
    width: 294,
    height: 50,
    backgroundColor: 'rgba(254,254,254,0.7)',
    borderWidth: 1,
    borderColor: '#FF5B04',
    borderRadius: 39,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    elevation: 10,
  },
  iconBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#FF5B04', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, marginLeft: 8, fontFamily: 'Urbanist', fontSize: 16, color: '#0F172A' },
  micBtn: { marginLeft: 10, width: 52, height: 52, borderRadius: 26, backgroundColor: '#FF5B04', alignItems: 'center', justifyContent: 'center' },
});

export default ChatWindow;
