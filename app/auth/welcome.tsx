/**
 * Welcome Screen
 * 
 * First screen users see when opening the app.
 * Shows app branding, tagline, and options to login or sign up.
 * 
 * USAGE:
 * - Place in app/auth/ folder or app/ folder (outside of tabs)
 * - This is the entry point before authentication
 * - Navigate to login/signup from here
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import styles from './welcome.styles';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/App Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="documents" size={64} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>Paper Pile</Text>
          <Text style={styles.tagline}>
            Your family's important documents,{'\n'}organized and searchable
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="scan" size={28} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Scan & Store</Text>
              <Text style={styles.featureDescription}>
                Snap a photo of any document and store it securely in the cloud
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="search" size={28} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Search Instantly</Text>
              <Text style={styles.featureDescription}>
                Find any document in seconds with powerful AI-powered search
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="people" size={28} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Share with Family</Text>
              <Text style={styles.featureDescription}>
                Collaborate with family members and keep everyone organized
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="shield-checkmark" size={28} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure & Private</Text>
              <Text style={styles.featureDescription}>
                Bank-level encryption keeps your sensitive documents safe
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer to push buttons to bottom on small screens */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text style={styles.signupButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            Already have an account? <Text style={styles.loginButtonTextBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}