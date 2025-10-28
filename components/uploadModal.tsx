/**
 * UploadModal Component
 * 
 * Modal that shows upload options when user taps the + FAB.
 * Allows user to choose between camera, file picker, or email forward.
 * 
 * USAGE:
 * - Import this component where you need it (like Home screen)
 * - Show/hide with visible prop
 * - Handle selections with onSelectCamera, onSelectFiles, onSelectEmail callbacks
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { styles } from './uploadModal.styles';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectFiles: () => void;
  onSelectEmail: () => void;
}

export default function UploadModal({
  visible,
  onClose,
  onSelectCamera,
  onSelectFiles,
  onSelectEmail,
}: UploadModalProps) {
  // Upload options data
  const options = [
    {
      id: 'camera',
      icon: 'camera' as const,
      title: 'Scan with Camera',
      subtitle: 'Take a photo of your document',
      onPress: onSelectCamera,
    },
    {
      id: 'files',
      icon: 'folder-open' as const,
      title: 'Choose from Files',
      subtitle: 'Pick from your device storage',
      onPress: onSelectFiles,
    },
    {
      id: 'email',
      icon: 'mail' as const,
      title: 'Forward Email',
      subtitle: 'Send to your unique email address',
      onPress: onSelectEmail,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop - tapping closes modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          {/* Modal Content - prevent backdrop tap from closing when tapping content */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Add Document</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <View style={styles.optionsList}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionItem,
                      index < options.length - 1 && styles.optionItemBorder,
                    ]}
                    onPress={() => {
                      option.onPress();
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.textLight}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}