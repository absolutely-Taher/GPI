import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

interface DialogButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomDialogProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: DialogButton[];
  icon?: string;
  iconColor?: string;
  onDismiss?: () => void;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  visible,
  title,
  message,
  buttons,
  icon,
  iconColor,
  onDismiss,
}) => {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getButtonStyle = (buttonStyle: string = 'default') => {
    switch (buttonStyle) {
      case 'destructive':
        return {
          backgroundColor: isDark ? '#FF4444' : '#FF3B30',
          color: '#FFFFFF',
        };
      case 'cancel':
        return {
          backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
          color: isDark ? '#FFFFFF' : '#000000',
        };
      default:
        return {
          backgroundColor: theme.primary,
          color: '#FFFFFF',
        };
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <Animated.View
          style={[
            styles.overlayBackground,
            {
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.dialog,
              {
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                shadowColor: '#000000',
              },
            ]}
          >
            {/* Icon */}
            {icon && (
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: iconColor
                      ? `${iconColor}15`
                      : `${theme.primary}15`,
                  },
                ]}
              >
                <Icon
                  name={icon}
                  size={32}
                  color={iconColor || theme.primary}
                />
              </View>
            )}

            {/* Title */}
            <Text
              style={[
                styles.title,
                {
                  color: isDark ? '#FFFFFF' : '#000000',
                },
              ]}
            >
              {title}
            </Text>

            {/* Message */}
            <Text
              style={[
                styles.message,
                {
                  color: isDark ? '#EBEBF5CC' : '#3C3C4399',
                },
              ]}
            >
              {message}
            </Text>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => {
                const buttonStyle = getButtonStyle(button.style);
                const isLastButton = index === buttons.length - 1;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      {
                        backgroundColor: buttonStyle.backgroundColor,
                        marginRight: isLastButton ? 0 : 12,
                      },
                    ]}
                    onPress={button.onPress}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color: buttonStyle.color,
                          fontWeight: button.style === 'destructive' ? '700' : '600',
                        },
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: width - 64,
    maxWidth: 400,
  },
  dialog: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Ubuntu-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Ubuntu-Regular',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
  },
});

