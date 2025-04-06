import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Switch,
} from 'react-native';
import { toggleBookmark, isJobBookmarked } from './bookmarkStorage';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const JobDetailsScreen = ({ route }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();

  const { job } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      const bookmarked = await isJobBookmarked(job.id);
      setIsBookmarked(bookmarked);
    };
    checkBookmark();
  }, []);

  // 🧠 Set the toggle switch in the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={stylesHeader.headerSwitchContainer}>
          <Text style={{ color: isDark ? '#fff' : '#000', marginRight: 6 }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? '#FFC107' : '#fff'}
            trackColor={{ false: '#888', true: '#666' }}
          />
        </View>
      ),
    });
  }, [navigation, isDark]);

  const handleCall = () => {
    if (job.contact_number) {
      Linking.openURL(`tel:${job.contact_number}`);
    }
  };

  const handleBookmarkToggle = async () => {
    await toggleBookmark(job);
    const updated = await isJobBookmarked(job.id);
    setIsBookmarked(updated);
  };

  const styles = themedStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Job Detail</Text>
      <Text style={styles.company}>{job.company_name}</Text>
      <Text style={styles.description}>
        {job.full_description || job.description}
      </Text>

      <View style={styles.detailBox}>
        <Text style={styles.detailText}>📍 Location: {job.location}</Text>
        <Text style={styles.detailText}>💼 Job Role: {job.role}</Text>
        <Text style={styles.detailText}>🕒 Job Type: {job.type}</Text>
        <Text style={styles.detailText}>👥 Openings: {job.openings}</Text>
        <Text style={styles.detailText}>💰 Salary: {job.salary}</Text>
        <Text style={styles.detailText}>📞 Contact: {job.contact_name}</Text>
        <Text style={styles.detailText}>🧾 Experience: {job.experience}</Text>
        <Text style={styles.detailText}>🎓 Qualification: {job.qualification}</Text>
        <Text style={styles.detailText}>👫 Gender: {job.gender}</Text>
        <Text style={styles.detailText}>💸 Agent Commission: {job.agent_commission}</Text>
        <Text style={styles.detailText}>❌ No Fee to Apply</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.bookmarkButton, isBookmarked && styles.bookmarked]}
          onPress={handleBookmarkToggle}
        >
          <Text style={styles.buttonText}>
            {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={handleCall}>
          <Text style={styles.buttonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default JobDetailsScreen;

// 🎨 Theme-aware styles
const themedStyles = (isDark) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    company: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: isDark ? '#ccc' : '#555',
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      color: isDark ? '#eee' : '#444',
    },
    detailBox: {
      marginBottom: 20,
      padding: 12,
      backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
      borderRadius: 8,
    },
    detailText: {
      fontSize: 15,
      marginBottom: 6,
      color: isDark ? '#ddd' : '#333',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bookmarkButton: {
      backgroundColor: '#FFD700',
      padding: 12,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
    },
    bookmarked: {
      backgroundColor: '#FFB700',
    },
    applyButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      flex: 1,
      marginLeft: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

// 💡 Header styles (outside theme)
const stylesHeader = StyleSheet.create({
  headerSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});
